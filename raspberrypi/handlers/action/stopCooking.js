/**
 * Stop cooking
 *
 * POST: /action/stop
 *
 */
exports.handler = function stopCooking(req, res, next) {
  const arduino = require('../../services/arduinorepository').first();
  if (!arduino) {
    res.status(503);
    res.send({errored: true});
    return;
  }

  arduino.stop();

  res.send('')
  next()
}
