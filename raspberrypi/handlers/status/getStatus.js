
/**
 * Get current status of oven
 *
 * GET: /status
 *
 */
exports.handler = function getStatus(req, res, next) {
  const arduinoRepository = require('../../services/arduinorepository');
  if (arduinoRepository.length < 1) {
    res.status(503);
    res.send("Arduino not found.");
    return;
  }

  res.send({
    state: arduinoRepository[0].state,
    elementState: arduinoRepository[0].elementState,
    sample: {
      timestamp: 0,
      temperature: arduinoRepository[0].temperature
    }
  });
  next()
}
