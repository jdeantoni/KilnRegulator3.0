const ArduinoKilnRegulator = require('./arduinokilnregulator');

const glob = require('glob');

const DEFAULT_BAUDRATE = 115200;

class ArduinoRepository extends Array {
  constructor(pattern) {
    super();
    var ar = this;
    if (!pattern)
      pattern = '/dev/arduino/*'

    /*
     * Try to use udev?
     */
    glob.sync(pattern).forEach(function(f) {
      const arduino = new ArduinoKilnRegulator(f, 115200);
      ar.push(arduino);
      arduino.open();
    });
  }
}

/*
 * Singleton
 */
const instance = new ArduinoRepository();
module.exports = instance;
