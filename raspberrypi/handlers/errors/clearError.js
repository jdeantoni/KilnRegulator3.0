/**
 * Clear error if any
 *
 * DELETE: /errors
 *
 */
exports.handler = function clearError(req, res, next) {
  const eh = require('../../services/errorhandler');
  eh.logfile = [];
  res.send('');
  next()
}
