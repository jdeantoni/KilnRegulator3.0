const ArduinoMessagePack = require('./arduinomessagepack');

class ArduinoKilnRegulator {
  constructor(dev, baudRate) {
    this.arduino = new ArduinoMessagePack(dev, baudRate);

    this.temperature = 0.0;
  }

  open() {
    const akr = this;
    this.arduino.on('data', function(msg, error) {
      if (error) {
        console.err(error);
      } else {
        akr.updateState(msg);
      }
    });
    this.arduino.open();
  }

  updateState(data) {
    this.temperature = data.temperature;
  }

  stop() {
    this.arduino.write(["stop"]);
  }

  start() {
    this.arduino.write(["start"]);
  }

  setSetpoint(setpoint) {
    this.arduino.write(["setpoint", setpoint]);
  }
}

module.exports = ArduinoKilnRegulator;
