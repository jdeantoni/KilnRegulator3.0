const ArduinoMessagePack = require('./arduinomessagepack');
const ElementState = require('../model/elementState')
const KilnState = require('../model/kilnState')

const eh = require('./errorhandler');

class ArduinoKilnRegulator {
  constructor(dev, baudRate) {
    const akr = this;
    this.arduino = new ArduinoMessagePack(dev, baudRate);

    this.temperature = 0.0;
    this.state = "";
    this.elementState = "";
    this.currentSegment = -1;

    this.cooking = {};

    this.errored = false;

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
    this.state = this.findStateName(data.state);
    this.elementState = this.findElementStateName(data.elementState);
    this.currentSegment = data.currentSegment;
    this.temperature = data.temperature;

    // upadte current cooking
    if (this.cooking.startDate) { // cooking started
      const startDate = Math.floor(Date.parse(this.cooking.startDate) / 1000);
      const timestamp = data.timestamp - startDate; // timestamp from start of program in seconds
      //cookingRepository.addSample(currentCooking, timestamp, this.temperature); // should do something in database
      this.cooking.samples.push({timestamp: timestamp, temperature: data.temperature});
    }
  }

  findStateName(state) {
    return KilnState[state];
  }

  findElementStateName(state) {
    return ElementState[state];
  }

  // if a segment is missing a parameter, try to estimate it
  fillSegment(segment, oldSegment) {
    let oldTemperature = 0;
    if (oldSegment)
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

  start(program) {
    const akn = this;
    const arduino = this.arduino;
    const segments = program.segments;
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

    this.arduino.write(["start", program.segments.length]);
    this.arduino.emitter.once('ack-start', function(msg) {
      console.log('Started!');
      akn.cooking.startDate = (new Date()).toISOString();
      akn.cooking.programId = program.uuid;
      akn.cooking.samples = [];
    });
  }

  setSetpoint(setpoint) {
    this.arduino.write(["setpoint", setpoint]);
  }
}

module.exports = ArduinoKilnRegulator;
