/**
 * Get error if any
 *
 * GET: /status/error
 *
 */
exports.handler = function getError(req, res, next) {
  const eh = require('../../services/errorhandler');

  res.send(eh.logfile);

  next()
}
