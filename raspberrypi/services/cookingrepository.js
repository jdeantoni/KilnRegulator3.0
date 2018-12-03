/*
 * Should persist in database, in memory for now
 */

var mongoose = require('mongoose');

class CookingRepository {
  constructor() {
  }

  exists(uuid, c) {
    mongoose.model('cooking').count({uuid: uuid}, function (err, count){
      if(count>0) {
        c(err, true);
      } else {
        c(err, false);
      }
    });
  }

  parseMongoCooking(mCooking) {
    var cooking = {
      uuid: mCooking.uuid,
      programId: mCooking.programId,
      startDate: mCooking.startDate,
    };
    if (mCooking.samples) {
      let samples = [];
      mCooking.samples.forEach(function(mSample) {
        let sample = {};
        sample.timestamp = mSample.timestamp;
        sample.temperature = mSample.temperature;
        samples.push(sample);
      });
      cooking.samples = samples;
    }
    return cooking;
  }

  get(uuid, c) {
    const pr = this;
    mongoose.model('cooking').findOne({uuid: uuid}, function(err, cooking) {
      if (err || !cooking) {
        c(err, null);
      } else {
        c(err, pr.parseMongoCooking(cooking));
      }
    });
  }

  add(p, c) {
    mongoose.model('cooking').create(p, c);
  }

  remove(uuid, c) {
    const pr = this;
    mongoose.model('cooking').findOne({uuid: uuid}, function(err, cooking) {
      if (!err) {
        cooking.remove();
        c(err, null);
      } else {
        c(err, pr.parseMongoCooking(cooking));
      }
    });
  }

  addSegment(p, s, c) {
    var conditions = { uuid: p.uuid }, update = { $push: { samples: s }};

    mongoose.model('cooking').findOneAndUpdate(conditions, update, function(err, res) {
      if (err) {
        console.error(err);
      }
    });
  }

  all(c) {
    const pr = this;
    mongoose.model('cooking').find({})
      .select('-samples')
      .sort({name: 'ascending'})
      .exec(function(err, cookings) {
        if (err) {
          c(err, null);
        } else {
          cookings = cookings.map(function(cooking) {
            return pr.parseMongoCooking(cooking);
          });
          c(err, cookings);
        }
      });
  }
}

/*
 * Singleton
 */
const instance = new CookingRepository();
module.exports = instance;
