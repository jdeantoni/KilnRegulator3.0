const msgpack = require('msgpack5')();

const Arduino = require('./arduino');

class ArduinoMessagePack extends Arduino {
  constructor(dev, baudRate) {
    super(dev, baudRate);
    this.encoder = msgpack.encoder();
    this.decoder = msgpack.decoder();
  }

  on(e, c) {
    if (e === 'data') {
      const arduino = this;
      this.serialPort.on('data', function (data) {
        arduino.decoder.write(data);
      });
      this.decoder.on('data', c);
    } else {
      super.on(e, c);
    }
  }

  write(m, c) {
    serialPort.write(msgpack.encode(m), c);
  }
}

module.exports = ArduinoMessagePack;
