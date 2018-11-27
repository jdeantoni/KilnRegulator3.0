const eh = require('./errorhandler');
const ArduinoKilnRegulator = require('./arduinokilnregulator');

const glob = require('glob');

const DEFAULT_BAUDRATE = 115200;

class ArduinoRepository extends Array {
  constructor(pattern) {
    super();
    if (pattern)
      this.pattern = pattern;
    else
      this.pattern = '/dev/arduino/*'
    this.tryLoad();
  }

  tryLoad() {
    var ar = this;
    /*
     * Try to use udev?
     */
    glob.sync(this.pattern).forEach(function(f) { // Bloking enumeration to discover available Arduino for current client request
      const arduino = new ArduinoKilnRegulator(f, DEFAULT_BAUDRATE);
      ar.push(arduino);
      arduino.open();
    });
  }

  first() {
    if (this.length > 0) {
      return this[0];
    } else {
      this.tryLoad();
      if (this.length > 0) {
        return this[0];
      } else {
        eh.fatal('Arduino not found');
        return null;
      }
    }
  }
}

/*
 * Singleton
 */
const instance = new ArduinoRepository();
module.exports = instance;
