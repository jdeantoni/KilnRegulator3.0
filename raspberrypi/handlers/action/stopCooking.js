/**
 * Stop cooking
 *
 * POST: /action/stop
 *
 */
exports.handler = function stopCooking(req, res, next) {
  const arduinoRepository = require('../../services/arduinorepository');
  if (arduinoRepository.length < 1) {
    res.status(503);
    res.send("Arduino not found.");
    return;
  }

  arduinoRepository[0].stop();

  res.send('')
  next()
}
