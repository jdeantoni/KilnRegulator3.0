/**
 * Get all programs
 *
 * GET: /programs
 *
 */
exports.handler = function getPrograms(req, res, next) {
  const programs = require('../../services/programrepository').all();

  res.send(programs);
  next()
}
