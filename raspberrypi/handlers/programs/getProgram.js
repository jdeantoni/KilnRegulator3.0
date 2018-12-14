/**
 * Get one program
 *
 * GET: /programs/{uuid}
 *
 * path:
 *   uuid {uuid}
 *
 */
exports.handler = function getProgram(req, res, next) {
  const programRepository = require('../../services/programrepository');

  if (!req.params.hasOwnProperty('uuid')) {
    res.status(400);
    res.send('Missing uuid');
    return;
  }

  programRepository.get(req.params.uuid, function(err, program) {
    if (err) {
      res.status(500);
      res.send({error: err});
      console.error(err);
    } else if (!program) {
      res.status(404);
      res.send({error: 'Program with uuid ' + req.body.uuid + ' does not exist.'});
    } else {
      res.send(program);
    }
    next()
  });
}
