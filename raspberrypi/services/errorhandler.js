const events = require('events');

const CRESET = "\x1b[0m";
const CRED = "\x1b[31m";
const CYELLOW = "\x1b[33m";
const CBRED = "\x1b[41m";
const CBLINK = "\x1b[5m";

class ErrorHandler {
  constructor() {
    this.logfile = [];
  }

  log(color, severity, message, timestamp) {
    if (!timestamp) {
      timestamp = Date.now();
    }
    if (!color) {
      color = '';
    }
    this.logfile.push({
      severity: severity,
      message: message,
      timestamp: timestamp
    });
    console.error(color +severity + ': ' + message + CRESET);
  }

  /*
   * Issue not affecting system reliability
   */
  warning(message) {
    this.log(CYELLOW, 'warning', message);
  }

  /*
   * Recoverable error
   */
  error(message) {
    this.log(CRED, 'error', message);
  }

  /*
   * Unrecoverable error
   */
  fatal(message) {
    this.log(CBRED, 'FATAL', message);
  }

  /*
   * Unrecoverable critical error
   */
  panic(message) {
    this.log(CBRED + CBLINK, 'PANIC', message);
  }
}

const instance = new ErrorHandler();
module.exports = instance;
