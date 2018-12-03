const events = require('events');
const msgpack = require('msgpack5')();
const { crc8 } = require('crc'); // CRC8 compatible with Arduino's crc8-ccitt

const Arduino = require('./arduino');

class ArduinoMessagePack extends Arduino {
  constructor(dev, baudRate) {
    super(dev, baudRate);
    this.emitter = new events.EventEmitter();
    this.encoder = msgpack.encoder();
    this.decoder = msgpack.decoder();
    this.msgId = 0;
    this.msgBacklog = {};

    // Accomodate Arduino's receive buffer
    this.bufferFill = 0;
    this.maxBufferSize = 64;
    this.outputBuffer = [];

    this.timeout = 5000; // 5secs
    const arduino = this;
    setInterval(function() { arduino.checkBacklog(arduino); }, this.timeout);
  }

  deleteFromBacklog(id) {
    this.bufferFill -= this.msgBacklog[id].length; // decrease buffer filling since Arduino cleared it from its receive buffer
    delete this.msgBacklog[id];

    if (this.outputBuffer.length > 0) {
      const nextMsg = this.outputBuffer[this.outputBuffer.length - 1];
      if (nextMsg.emsg.length + this.bufferFill < this.maxBufferSize) {
        this.writeImmediate(nextMsg.msg, nextMsg.emsg, nextMsg.cb);

        this.outputBuffer.splice(this.outputBuffer.length - 1, 1); // delete from outputBuffer
      }
    }
  }

  checkBacklog(arduino) {
    for (var id in arduino.msgBacklog) {
      if (arduino.msgBacklog.hasOwnProperty(id)) {
        if (arduino.msgBacklog[id].timestamp + arduino.timeout < Date.now()) { // aknowledgment not received, message timed out
          arduino.emitter.emit('error', 'Aknowledgment not received for ' + arduino.msgBacklog[id].msg, arduino.msgBacklog[id].msg);
          this.deleteFromBacklog(id); // assume it has been read and cleared from the buffer by the Arduino anyway, to prevent blocking subsequent message sending
        }
      }
    }
  }

  on(e, c) {
    if (e === 'data') {
      const arduino = this;
      this.serialPort.on('data', function (data) {
        try {
          arduino.decoder.write(data);
        } catch(e) {
          console.log(e);
        }
      });
      this.decoder.on('data', function(msg, error) {
        if (msg && !error && msg.hasOwnProperty('ack')) {
          /*
           * Acknowledgment received, check CRC
           */
          if (!arduino.msgBacklog.hasOwnProperty(msg.id)) {
            c(null, 'Arduino: Message id not found in backlog');
            return;
          }
          const origMsg = arduino.msgBacklog[msg.id];

          this.bufferFill -= origMsg.length; // decrease buffer filling since Arduino cleared it from its receive buffer

          const expectedCrc = origMsg.crc;
          const actualCrc = msg.crc;
          if (expectedCrc != actualCrc) {
            c(null, 'Arduino: CRC error, ' + expectedCrc + ' != ' + actualCrc, origMsg.msg);
            arduino.deleteFromBacklog(msg.id);
            return;
          }
          arduino.deleteFromBacklog(msg.id);
          arduino.emitter.emit('ack-' + origMsg.msg[0], origMsg);
        }
        c(msg, error);
      });
    } else {
      this.emitter.on(e, c);
    }
  }

  writeImmediate(m, emsg, c) {
    const curMsgId = m[0];
    console.log(m);
    this.bufferFill += emsg.length;

    /*
     * Compute CRC and save it to backlog
     */
    const msgcrc8 = crc8(emsg);
    this.msgBacklog[curMsgId] = {'msg': m.slice(1), 'crc': msgcrc8, 'timestamp': Date.now(), 'length': emsg.length};

    this.serialPort.write(emsg, c);
  }

  /*
   * bufferize output messages since arduino's output buffer is 64 bytes only
   * buffer overflow on arduino's side will cause message to be dropped or corrupted
   */
  write(m, c) {
    m.unshift(this.msgId);

    const emsg = msgpack.encode(m);
    // make sure we don't enqueue message > maxBufferSize
    if (emsg.length > this.maxBufferSize) {
      this.emitter.emit('error', 'Message too long, ' + emsg.length + ' > 64');
      return;
    }

    if (this.outputBuffer.length > 0 // output buffer not empty, enqueue after
      || (this.bufferFill + emsg.length > this.maxBufferSize)) { // won't fit in Arduino's receive buffer, enqueue…
      this.outputBuffer.unshift({'msg': m, 'cb': c, 'emsg': emsg}); // put new message at the beginning, last message sent first;
    } else { // can write immediately
      this.writeImmediate(m, emsg, c);
    }

    this.msgId++;
    if (this.msgId > (Math.pow(2, 32) - 1)) { // artificial uint32 overflow since it will overflow on the Arduino (Arduino's ulong = uint32)
      this.msgId = 0;
    }
  }
}

module.exports = ArduinoMessagePack;
