/*
 * Should persist in database, in memory for now
 */

var mongoose = require('mongoose');

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

  get(uuid, c) {
    mongoose.model('program').findOne({uuid: uuid}, c);
  }

  add(p, c) {
    mongoose.model('program').create(p, c);
  }

  remove(uuid, c) {
    this.get(uuid, function(err, program) {
      if (!err) {
        program.remove();
      }
      c(err, program);
    });
  }

  all(c) {
    mongoose.model('program').find({})
      .sort({name: 'ascending'})
      .exec(c);
  }
}

/*
 * Singleton
 */
const instance = new ProgramRepository();
module.exports = instance;
