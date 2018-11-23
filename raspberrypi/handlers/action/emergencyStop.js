/**
 * PANIC
 *
 * POST: /action/emergencystop
 *
 */
exports.handler = function emergencyStop(req, res, next) {
  const eh = require('../../services/errorhandler');
  const arduino = require('../../services/arduinorepository').first();
  if (arduino) {
    arduino.stop();
  }

  eh.panic('Emergency stop requested by user');

  res.send('');
  next()
}
