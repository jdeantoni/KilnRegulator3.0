var SerialPort = require('serialport');

class Arduino {
  constructor(dev, baudRate) {
    this.serialPort = new SerialPort(dev, {
      baudRate: baudRate,
      autoOpen: false
    });
    this.serialPort.on('error', function(err) {
      console.log(err);
    });
  }

  open() {
    this.serialPort.open();
  }
}

module.exports = Arduino;
