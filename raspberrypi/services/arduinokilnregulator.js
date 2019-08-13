const uuidv1 = require('uuid/v1');

const ArduinoMessagePack = require('./arduinomessagepack');
const ElementState = require('../model/elementState')
const KilnState = require('../model/kilnState')
const cookingRepository = require('./cookingrepository');
const programRepository = require('./programrepository');

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

    this.currentProgram = undefined;
    this.cooking = {};
    this.isInFullSeg = false;
    this.hasBeenExtended = false;
    this.errored = false;
    this.delay = 0;
    this.timerProcess = 0;

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
      
      this.status = status;
     
      if (status.state != "stopped"){
      //  console.log('////////////////////  ADJUST PROGRAM !!')
       // console.log('this.currentProgram:',this.currentProgram)
       // console.log('this.status.currentSegment', this.status.currentSegment)
        if (this.status.currentSegment >= 0 && this.currentProgram.segments[this.status.currentSegment].isFull){
       //     console.log('increase ?')
            this.increaseSegmentAccordingToRealData(timestamp)
        }else if (this.isInFullSeg){ //Actually was in full seg :)
            this.isInFullSeg = false;
            if (this.hasBeenExtended){
              this.hasBeenExtended = false;
              //save previous changes
              programRepository.remove(this.currentProgram.uuid,
              () => {
                  console.log("progam "+this.currentProgram.name+" removed");
                }
              );
              programRepository.add(this.currentProgram,
              () => {
                  console.log("progam "+this.currentProgram.name+" added");
                }
              );
            }else{
      //       console.log('shrink ?')
             this.shrinkSegmentAccordingToRealData(timestamp)
           }
        }
      //  console.log('                        ////////////////////  ')
      }
    }
  }
  
    increaseSegmentAccordingToRealData(timestamp){
      if (this.currentProgram === undefined){
        console.log('increaseSegmentAccordingToRealData => program undefined...');
        return
      }
        this.isInFullSeg = true;
        var lastTimeStamp = timestamp;
        var theoreticEndTime = 0;         
        for (let i = 0; i <= this.status.currentSegment; i++){
          theoreticEndTime += this.currentProgram.segments[i].duration //in seconds
        }
        //console.log("two times :)",lastTimeStamp," ",theoreticEndTime)
        if (theoreticEndTime < lastTimeStamp){
            const dif = lastTimeStamp - theoreticEndTime;
            this.currentProgram.segments[this.status.currentSegment].duration = this.currentProgram.segments[this.status.currentSegment].duration + dif
          //  console.log('      new duration:',this.currentProgram.segments[this.status.currentSegment].duration)
            var previousTemp= 20;
            if (this.status.currentSegment > 0){
              previousTemp = this.currentProgram.segments[this.status.currentSegment -1].targetTemperature
            }
            this.currentProgram.segments[this.status.currentSegment].slope = (this.currentProgram.segments[this.status.currentSegment].targetTemperature - previousTemp)/this.currentProgram.segments[this.status.currentSegment].duration;
            this.hasBeenExtended = true;
        }
      //  console.log('...');
    }

    shrinkSegmentAccordingToRealData(timestamp){
      if (this.currentProgram === undefined){
        return
      }
        this.isInFullSeg = false;
        var lastTimeStamp = timestamp
        var theoreticEndTime = 0;
        for (let i = 0; i < this.status.currentSegment; i++){ //strict less since we moved to next segment
          theoreticEndTime += this.currentProgram.segments[i].duration //in seconds
        }
        //console.log("two times :-/",lastTimeStamp," ",theoreticEndTime)
        if (theoreticEndTime > lastTimeStamp){
            const dif = theoreticEndTime - lastTimeStamp;
            this.currentProgram.segments[this.status.currentSegment-1].duration = this.currentProgram.segments[this.status.currentSegment-1].duration - dif
           // console.log('      new duration:',this.currentProgram.segments[this.status.currentSegment-1].duration)
            var previousTemp= 20;
            if (this.status.currentSegment > 1){ //we are next seg
              previousTemp = this.currentProgram.segments[this.status.currentSegment -2].targetTemperature
            }
         //   console.log('      previous target temp :',previousTemp);
            this.currentProgram.segments[this.status.currentSegment-1].slope = (this.currentProgram.segments[this.status.currentSegment-1].targetTemperature - previousTemp)/this.currentProgram.segments[this.status.currentSegment-1].duration;
          //  console.log('      new slope :',this.currentProgram.segments[this.status.currentSegment-1].slope);
            
           programRepository.remove(this.currentProgram.uuid,
            () => {
                console.log("progam "+this.currentProgram.name+" removed");
              }
            );
            programRepository.add(this.currentProgram,
            () => {
                console.log("progam "+this.currentProgram.name+" added");
              }
            );
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
    if (this.timerProcess != 0){
      clearTimeout(this.timerProcess);
      this.timerProcess = 0;
    }
    this.arduino.write(["stop"]);
    this.arduino.emitter.once('ack-stop', function(msg) {
      console.log('Stopped!');
    });
  }

  start(program, d) {
    this.delay = d;//delay is in hour
    console.log("arduinoKilRegulator.js => cooking will start in "+this.delay+" hours, i.e., "+parseInt(this.delay*3600)+" seconds....");
    if (d > 0){
      this.arduino.write(["delay", parseInt(this.delay*60)]);
      this.arduino.emitter.once('ack-delay', function(msg) {
            console.log('cooking have been delayed');
          });
      this.timerProcess = setTimeout(function() { this.actualStart(program.segments, program) }.bind(this), Number((this.delay*3600000)+1500));
    }else{
      this.actualStart(program.segments, program)
    }
  }

  actualStart(segments, program){
    console.log("actual cooking started");
    this.currentProgram = program;
    const akn = this;
    const arduino = this.arduino;
    for (const i in segments) {
      let segment = segments[i];
      let oldSegment = null;
      segment.duration = Math.trunc(segment.duration); //cut under seconds :-/
      if (i > 0)
        oldSegment = segments[i-1];
      segment = this.fillSegment(segment, oldSegment);
      arduino.write(['segment', [
        parseInt(i),
        segment.targetTemperature,
        segment.slope,
        segment.duration,
        segment.isFull
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
    this.currentProgram = undefined;
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
