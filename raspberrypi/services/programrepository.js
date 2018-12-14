/*
 * Should persist in database, in memory for now
 */

var mongoose = require('mongoose');

var cookingRepository = require('./cookingrepository');

class ProgramRepository {
  constructor() {
  }

  exists(uuid, c) {
    mongoose.model('program').count({uuid: uuid}, function (err, count){
      if(count>0) {
        c(err, true);
      } else {
        c(err, false);
      }
    });
  }

  parseMongoProgram(mProgram) {
    let segments = [];
    mProgram.segments.forEach(function(mSegment) {
      let segment = {};
      if (mSegment.targetTemperature != null)
        segment.targetTemperature = mSegment.targetTemperature;
      if (mSegment.slope != null)
        segment.slope = mSegment.slope;
      if (mSegment.duration != null)
        segment.duration = mSegment.duration;
      segments.push(segment);
    });
    return {
      uuid: mProgram.uuid,
      name: mProgram.name,
      lastModificationDate: mProgram.lastModificationDate,
      segments: segments
    }
  }

  get(uuid, c) {
    const pr = this;
    mongoose.model('program').findOne({uuid: uuid}, function(err, program) {
      if (err || !program) {
        c(err,  null);
      } else {
        c(err, pr.parseMongoProgram(program));
      }
    });
  }

  add(p, c) {
    mongoose.model('program').create(p, c);
  }

  remove(uuid, c) {
    console.log("Remove " + uuid);
    const pr = this;
    mongoose.model('program').findOne({uuid: uuid}, function(err, program) {
      if (!err) {
        program.remove();
        c(err, pr.parseMongoProgram(program));
      } else {
        c(err, null);
      }
    });
  }

  all(c) {
    const pr = this;
    mongoose.model('program').find({})
      .sort({name: 'ascending'})
      .exec(function(err, programs) {
        if (err) {
          c(err, null);
        } else {
          programs = programs.map(function(program) {
            return pr.parseMongoProgram(program);
          });
          c(err, programs);
        }
      });
  }

  allNotArchived(c) {
    const pr = this;
    mongoose.model('program').find({ "archived": {$ne: true} })
      .sort({name: 'ascending'})
      .exec(function(err, programs) {
        if (err) {
          c(err, null);
        } else {
          programs = programs.map(function(program) {
            return pr.parseMongoProgram(program);
          });
          c(err, programs);
        }
      });
  }

  archive(uuid, c) {
    console.log("Archive " + uuid);
    mongoose.model('program').update({'uuid' : uuid}, {'$set' : {'archived': true}}, c);
  }

  removeOrArchiveIfUsed(uuid, c) {
    const pr = this;
    cookingRepository.isPogramIdUsed(uuid, function(err, res) {
      if (err) {
        c(err);
      } else if (res) {
        pr.archive(uuid, c);
      } else {
        pr.remove(uuid, c);
      }
    });
  }
}

/*
 * Singleton
 */
const instance = new ProgramRepository();
module.exports = instance;
