/**
 * add new program
 *
 * POST: /programs
 *
 * body:
 *   uuid {uuid} Program UUID used for this cooking.
 *   name {string} Program name.
 *   lastModificationDate {date-time} Date and time when this program was last modified.
 *   segments {array}
 *
 */
exports.handler = function addProgram(req, res, next) {
  const programRepository = require('../../services/programrepository');

  const keys = ['uuid', 'name', 'segments', 'lastModificationDate', 'segmentsEditableStates'];
  for (const k in keys) {
    if (!(req.body.hasOwnProperty(keys[k]) && req.body[keys[k]] != null)) {
      res.status(400+keys[k]);
      res.send('Missing ' + keys[k]);
      return;
    }
  }

  programRepository.exists(req.body.uuid, function(err, exists) {
    if (err) {
      res.status(500);
      res.send({error: err});
      console.error(err);
    } else if (exists) {
      programRepository.isArchived(req.body.uuid, function(err, archived) {
        if (err) {
          res.status(500);
          res.send({error: err});
          console.error(err);
        } else if (archived) { //program has been archived previously (deleted but still had a cooking referencing it), so assume it's the same and unarchive
          programRepository.unArchive(req.body.uuid, function(err, program) {
            if (err) {
              res.status(500);
              res.send({error: err});
              console.error(err);
            } else {
              console.log("Unarchived: " + uuid);
              res.send(program);
            }
          });
        } else { //program is still available, uuid duplicates not allowed
          res.status(409);
          res.send({error: 'Program with uuid ' + req.body.uuid + ' already exists.'});
        }
      });
    } else {
      programRepository.add({
        uuid: req.body.uuid,
        name: req.body.name,
        segments: req.body.segments,
        lastModificationDate: req.body.lastModificationDate,
        segmentsEditableStates:req.body.segmentsEditableStates
      }, function(err, program) {
        if (err) {
          res.status(500);
          res.send({error: err});
          console.error(err);
        } else {
          console.log("Created: " + program);
          res.send(program);
        }
        next()
      });
    }
  });

}
