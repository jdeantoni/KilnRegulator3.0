var SerialPort = require('serialport');

const eh = require('./errorhandler');

class Arduino {
  constructor(dev, baudRate) {
    var arduino = this;
    this.serialPort = new SerialPort(dev, {
      baudRate: baudRate,
      autoOpen: false
    });
    this.serialPort.on('error', function(err) {
      eh.error(err.message);
      if (arduino.serialPort.isOpen)
        arduino.serialPort.close();
      setTimeout(function() {
        if (!arduino.serialPort.isOpen)
          arduino.open();
      }, 5000);
    });
    this.serialPort.on('close', function(err) {
      eh.error('Connection to Arduino closed, ' + err);
      arduino.open();
    });
  }

  open() {
    this.serialPort.open();
  }
}

module.exports = Arduino;
