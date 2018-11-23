const events = require('events');

const CRESET = "\x1b[0m";
const CRED = "\x1b[31m";
const CYELLOW = "\x1b[33m";
const CWHITE = "\x1b[37m";
const CBRED = "\x1b[41m";
const CBOLD = "\x1b[1m";
const CBLINK = "\x1b[5m";

class ErrorHandler {
  constructor() {
    const eh = this;
    this.emitter = new events.EventEmitter();
    this.logfile = [];

    // do this mainly because we always need to handle an 'error' event in NodeJS…
    this.on('warning', function(message, timestamp) { eh.logMessage('warning', message, timestamp); });
    this.on('error', function(message, timestamp) { eh.logMessage('error', message, timestamp); });
    this.on('FATAL', function(message, timestamp) { eh.logMessage('FATAL', message, timestamp); });
    this.on('PANIC', function(message, timestamp) { eh.logMessage('PANIC', message, timestamp); });
  }

  logMessage(severity, message, timestamp) {
    if (!timestamp) {
      timestamp = Date.now();
    }
    this.logfile.push({
      severity: severity,
      message: message,
      timestamp: timestamp
    });
  }

  printMessage(color, severity, message, timestamp) {
    if (!color) {
      color = '';
    }
    console.error(color + severity + ': ' + message + CRESET);
  }

  log(color, severity, message, timestamp) {
    this.printMessage(color, severity, message, timestamp);
    this.emitter.emit(severity, message, timestamp);
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
    this.log(CBRED + CWHITE + CBOLD + CBLINK, 'PANIC', message);
  }

  on(e, c) {
    this.emitter.on(e, c);
  }
}

const instance = new ErrorHandler();
module.exports = instance;
