/**
 * Clear error if any
 *
 * DELETE: /errors
 *
 */
exports.handler = function clearError(req, res, next) {
  const eh = require('../../services/errorhandler');
  eh.logfile = [];

  const arduino = require('../../services/arduinorepository').first();
  if (!arduino) {
    res.status(503);
    res.send({errored: true});
    return;
  }

  arduino.errored = false;

  res.send('');
  next()
}
