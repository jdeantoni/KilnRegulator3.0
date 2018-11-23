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

  handleError(akr, err, msg) {
    console.error(err);
    if (msg && msg[0] == 'stop') { // we tried to send a stop command and it failed, try again…
      console.log('Trying to send stop again…');
      akr.stop();
    }
  }

  open() {
    const akr = this;
    this.arduino.on('data', function(msg, error, originalmsg) {
      console.log(msg);
      if (error) {
        akr.handleError(akr, error, originalmsg);
      } else {
        if (msg.command == 'status')
          akr.updateState(msg);
      }
    });
    this.arduino.on('error', function(err, originalmsg) {
      akr.handleError(akr, err, originalmsg);
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
