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
  res.status(500);
  res.send({error: 'Not implemented.'})
  next()
}
