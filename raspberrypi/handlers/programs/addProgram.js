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

  const keys = ['uuid', 'name', 'segments', 'lastModificationDate'];
  for (const k in keys) {
    if (!req.body.hasOwnProperty(keys[k])) {
      res.status(400);
      res.send('Missing ' + keys[k]);
      return;
    }
  }

  if (programRepository.exists(req.body.uuid)) {
    res.status(409);
    res.send({error: 'Program with uuid ' + req.body.uuid + ' already exists.'});
    return;
  }

  programRepository.add({
    uuid: req.body.uuid,
    name: req.body.name,
    segments: req.body.segments,
    lastModificationDate: req.body.lastModificationDate
  });

  res.send('');
  next()
}
