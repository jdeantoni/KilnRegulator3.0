/**
 * delete program, ie. archive old program if referenced or delete it
 *
 * DELETE: /programs/{uuid}
 *
 * path:
 *   uuid {uuid}
 *
 * body:
 *   uuid {uuid} Program UUID used for this cooking.
 *   name {string} Program name.
 *   lastModificationDate {date-time} Date and time when this program was last modified.
 *   segments {array}
 *
 */
exports.handler = function deleteProgram(req, res, next) {
  const programRepository = require('../../services/programrepository');

  if (!req.params.hasOwnProperty('uuid')) {
    res.status(400);
    res.send('Missing uuid');
    return;
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
      programRepository.removeOrArchiveIfUsed(req.params.uuid, function(err, doc) {
        if (err) {
          res.status(500);
          res.send({error: err});
          console.error(err);
        } else {
          res.send('');
        }
      });
    }
  });
}
