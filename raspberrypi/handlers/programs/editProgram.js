/**
 * edit program, ie. archive old program if referenced or delete it, and add new program
 *
 * PUT: /programs/{uuid}
 *
 * path:
 *   uuid
 *
 * body:
 *   uuid {uuid} Program UUID used for this cooking.
 *   name {string} Program name.
 *   lastModificationDate {date-time} Date and time when this program was last modified.
 *   segments {array}
 *
 */
exports.handler = function editProgram(req, res, next) {
  const programRepository = require('../../services/programrepository');

  const keys = ['uuid', 'name', 'segments', 'lastModificationDate'];
  for (const k in keys) {
    if (!(req.body.hasOwnProperty(keys[k]) && req.body[keys[k]] != null)) {
      res.status(400);
      res.send('Missing ' + keys[k]);
      return;
    }
  }

  programRepository.exists(req.params.uuid, function(err, exists) {
    if (err) {
      res.status(500);
      res.send({error: err});
      console.error(err);
    } else if (!exists) {
      res.status(404);
      res.send({error: 'Program with uuid ' + req.body.uuid + ' does not exist.'});
    } else {
      programRepository.remove(req.params.uuid, function(err, doc) {
        if (err) {
          res.status(500);
          res.send({error: err});
          console.error(err);
        } else {
          programRepository.add({
            uuid: req.body.uuid,
            name: req.body.name,
            segments: req.body.segments,
            lastModificationDate: req.body.lastModificationDate
          }, function(err, program) {
            if (err) {
              res.status(500);
              res.send({error: err});
              console.error(err);
            } else {
              console.log('Updated ' + req.body.uuid + ' with ' + program);
              res.send(program);
            }
            next()
          });
        }
      });
    }
  });
}
