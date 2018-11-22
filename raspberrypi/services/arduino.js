var SerialPort = require('serialport');

class Arduino {
  constructor(dev, baudRate) {
    var arduino = this;
    this.serialPort = new SerialPort(dev, {
      baudRate: baudRate,
      autoOpen: false
    });
    this.serialPort.on('error', function(err) {
      console.log(err);
      if (arduino.serialPort.isOpen)
        arduino.serialPort.close();
      setTimeout(function() {
        if (!arduino.serialPort.isOpen)
          arduino.open();
      }, 5000);
    });
    this.serialPort.on('close', function(err) {
      console.error('Connection to Arduino closed, ' + err);
      arduino.open();
    });
  }

  open() {
    this.serialPort.open();
  }
}

module.exports = Arduino;
