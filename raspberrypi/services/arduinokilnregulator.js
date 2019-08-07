const uuidv1 = require('uuid/v1');

const ArduinoMessagePack = require('./arduinomessagepack');
const ElementState = require('../model/elementState')
const KilnState = require('../model/kilnState')
const cookingRepository = require('./cookingrepository');

const eh = require('./errorhandler');

class ArduinoKilnRegulator {
  constructor(dev, baudRate) {
    const akr = this;
    this.arduino = new ArduinoMessagePack(dev, baudRate);

    this.status = {
      temperature: 0.0,
      state: "ready",
      elementState: "",
      currentSegment: -1,
      output: 0,
      setPoint: 0,
      timestamp: 0,
      delay: 0
    };

    this.cooking = {};

    this.errored = false;
    this.delay = 0;

    eh.on('error', function(msg, timestamp) {
      akr.errored = true;
    });

    eh.on('FATAL', function(msg, timestamp) {
      akr.stop();
      akr.errored = true;
    });

    // Should be more agressive than FATAL and really shutdown everything in hardware
    eh.on('PANIC', function(msg, timestamp) {
      akr.stop();
      akr.errored = true;
    });
  }

  handleError(akr, err, msg) {
    eh.error(err);
    if (msg && msg[0] == 'stop') { // we tried to send a stop command and it failed, try again…
      console.log('Trying to send stop again…');
      akr.stop();
    }
  }

  handleMessage(msg) {
    console.log(msg);
    if (msg.command == 'status') {
      this.updateState(msg);
    } else if (msg.command == 'timesync') {
      this.arduino.write(['timesync', Math.floor(Date.now() / 1000)]); // send timestamp in seconds
    }
  }

  open() {
    const akr = this;
    this.arduino.on('data', function(msg, error, originalmsg) {
      console.log(msg);
      if (error) {
        akr.handleError(akr, error, originalmsg);
      } else {
        akr.handleMessage(msg);
      }
    });
    this.arduino.on('error', function(err, originalmsg) {
      akr.handleError(akr, err, originalmsg);
    });
    this.arduino.open();
  }

  updateState(data) {
    let status = { // convert between short names and long names, and between index and enum string
      state: this.findStateName(data.s),
      elementState: this.findElementStateName(data.eS),
      currentSegment: data.cS,
      temperature: data.t,
      output: data.o,
      setPoint: data.sP,
      timestamp: data.ts,
      delay:data.d
    }

    // update current cooking
    if (status.state != "ready" && this.cooking.startDate) { // cooking started, collect samples even in stopped state
      const startDate = Math.floor(Date.parse(this.cooking.startDate) / 1000);
      let timestamp = status.timestamp - startDate; // timestamp from start of program in seconds

      if (timestamp < 0 && this.cooking.offset === undefined) { // arduino not exactly synced… add offset.
        this.cooking.offset = timestamp;
      }
      if (this.cooking.offset) {
        timestamp -= this.cooking.offset;
      }

      status.timestamp = timestamp;

      // save new segment in database
      cookingRepository.addSegment(this.cooking, {timestamp: timestamp, temperature: status.temperature});
    }

    this.status = status;
  }

  findStateName(state) {
    return KilnState[state];
  }

  findElementStateName(state) {
    return ElementState[state];
  }

  // if a segment is missing a parameter, try to estimate it
  fillSegment(segment, oldSegment) {
    let oldTemperature = 20;
    if (oldSegment != null)
      oldTemperature = oldSegment.targetTemperature;

    if (segment.targetTemperature == null) {
      segment.targetTemperature = oldTemperature + segment.slope * segment.duration;
    }

    const deltaTemp = segment.targetTemperature - oldTemperature;
    if (segment.slope == null) {
      segment.slope = deltaTemp / segment.duration;
    }

    if (segment.duration == null) {

      segment.duration = deltaTemp / segment.slope;
    }

    return segment;
  }

  stop() {
    this.arduino.write(["stop"]);
    this.arduino.emitter.once('ack-stop', function(msg) {
      console.log('Stopped!');
    });
  }

  start(program, d) {
    this.delay = d;//delay is in hour
    console.log("arduinoKilRegulator.js => cooking will start in "+this.delay+" hours, i.e., "+parseInt(this.delay*3600)+" seconds....");
    setTimeout(function() { this.actualStart(program.segments, program) }.bind(this), Number(this.delay*3600000));
    this.arduino.write(["delay", parseInt(this.delay*60)]);
        this.arduino.emitter.once('ack-delay', function(msg) {
          console.log('cooking have been delayed of '+parseInt(this.delay*60)+ 'minutes');
        });
  }

  actualStart(segments, program){
    console.log("actual cooking started");
    const akn = this;
    const arduino = this.arduino;
    for (const i in segments) {
      let segment = segments[i];
      let oldSegment = null;
      if (i > 0)
        oldSegment = segments[i-1];
      segment = this.fillSegment(segment, oldSegment);

      arduino.write(['segment', [
        parseInt(i),
        segment.targetTemperature,
        segment.slope,
        segment.duration
      ]]);
    }

    this.arduino.write(["start", segments.length]);
    this.arduino.emitter.once('ack-start', function(msg) {
      console.log('Started!');
      akn.cooking.uuid = uuidv1();
      akn.cooking.startDate = (new Date()).toISOString();
      akn.cooking.programId = program.uuid;
      delete akn.cooking.offset; // reset offset

      cookingRepository.add(akn.cooking);
    });
  }

  reset() {
    const akn = this;
    this.arduino.write(["reset"]);
    this.arduino.emitter.once('ack-reset', function(msg) {
      console.log('Reset!');
      akn.cooking = {};
    });
  }

  setSetpoint(setpoint) {
    this.arduino.write(["setpoint", setpoint]);
  }
}

module.exports = ArduinoKilnRegulator;
