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
    if (!req.body.hasOwnProperty(keys[k])) {
      res.status(400);
      res.send('Missing ' + keys[k]);
      return;
    }
  }

  if (!programRepository.exists(req.params.uuid)) {
    res.status(404);
    res.send({error: 'Program with uuid ' + req.body.uuid + ' does not exist.'});
    return;
  }

  programRepository.remove(req.params.uuid);

  programRepository.add({
    uuid: req.body.uuid,
    name: req.body.name,
    segments: req.body.segments,
    lastModificationDate: req.body.lastModificationDate
  });

  res.send('');
  next()
}
