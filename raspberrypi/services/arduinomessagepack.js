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

    this.timeout = 5000; // 5secs
    const arduino = this;
    setInterval(function() { arduino.checkBacklog(arduino); }, this.timeout);
  }

  checkBacklog(arduino) {
    for (var id in arduino.msgBacklog) {
      if (arduino.msgBacklog.hasOwnProperty(id)) {
        if (arduino.msgBacklog[id].timestamp + arduino.timeout < Date.now()) { // aknowledgment not received, message timed out
          arduino.emitter.emit('error', 'Aknowledgment not received for msg ' + id, arduino.msgBacklog[id].msg);
          delete arduino.msgBacklog[id];
        }
      }
    }
  }

  on(e, c) {
    if (e === 'data') {
      const arduino = this;
      this.serialPort.on('data', function (data) {
        arduino.decoder.write(data);
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

          const expectedCrc = arduino.msgBacklog[msg.id].crc;
          const actualCrc = msg.crc;
          if (expectedCrc != actualCrc) {
            c(null, 'Arduino: CRC error', arduino.msgBacklog[msg.id].msg);
            delete arduino.msgBacklog[msg.id];
            return;
          }
          delete arduino.msgBacklog[msg.id];
        }
        c(msg, error);
      });
    } else {
      this.emitter.on(e, c);
    }
  }

  write(m, c) {
    m.unshift(this.msgId);
    const emsg = msgpack.encode(m);

    /*
     * Compute CRC and save it to backlog
     */
    const msgcrc8 = crc8(emsg);
    this.msgBacklog[this.msgId] = {'msg': m.slice(1), 'crc': msgcrc8, 'timestamp': Date.now()};

    this.serialPort.write(emsg, c);
    this.msgId++;
    if (this.msgId > (Math.pow(2, 32) - 1)) { // artificial uint32 overflow since it will overflow on the Arduino (Arduino's ulong = uint32)
      this.msgId = 0;
    }
  }
}

module.exports = ArduinoMessagePack;
