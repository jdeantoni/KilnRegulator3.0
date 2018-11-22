const ArduinoMessagePack = require('./arduinomessagepack');
const ElementState = require('../model/elementState')
const KilnState = require('../model/kilnState')

class ArduinoKilnRegulator {
  constructor(dev, baudRate) {
    this.arduino = new ArduinoMessagePack(dev, baudRate);

    this.temperature = 0.0;
    this.state = "";
    this.elementState = "";
    this.currentSegment = -1;
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
    this.state = this.findStateName(data.state);
    this.elementState = this.findElementStateName(data.elementState);
    this.currentSegment = data.currentSegment;
    this.temperature = data.temperature;
  }

  findStateName(state) {
    return KilnState[state];
  }

  findElementStateName(state) {
    return ElementState[state];
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

  findStateName(state) {
    return StateElement[state];
  }

  findElementStateName(state) {
    return KilnState[state];
  }
}

module.exports = ArduinoKilnRegulator;
