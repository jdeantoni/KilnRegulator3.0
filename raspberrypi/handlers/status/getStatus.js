
/**
 * Get current status of oven
 *
 * GET: /status
 *
 */
exports.handler = function getStatus(req, res, next) {
  const arduino = require('../../services/arduinorepository').first();
  if (!arduino) {
    res.status(503);
    res.send({errored: true});
    return;
  }

  res.send({
    errored: arduino.errored,
    state: arduino.state,
    elementState: arduino.elementState,
    sample: {
      timestamp: 0,
      temperature: arduino.temperature
    }
  });
  next()
}
