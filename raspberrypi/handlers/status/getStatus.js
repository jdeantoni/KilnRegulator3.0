
/**
 * Get current status of oven
 *
 * GET: /status
 *
 */
exports.handler = function getStatus(req, res, next) {
  const arduino = require('../../services/arduinorepository').first();
  if (!arduino) {
    res.status(200);
    res.send({errored: true});
    return;
  }

  res.send({
    delay: arduino.status.delay, //warning still in minutes here
    currentSegment : arduino.status.currentSegment,
    errored: arduino.errored,
    state: arduino.status.state,
    elementState: arduino.status.elementState,
    sample: {
      timestamp: arduino.status.timestamp,
      temperature: arduino.status.temperature
    }
  });
  next()
}
