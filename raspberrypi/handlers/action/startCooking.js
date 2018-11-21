/**
 * Start cooking
 *
 * POST: /action/start
 *
 */
exports.handler = function startCooking(req, res, next) {
  const arduinoRepository = require('../../services/arduinorepository');
  if (arduinoRepository.length < 1) {
    res.status(503);
    res.send("Arduino not found.");
    return;
  }

  arduinoRepository[0].start();

  res.send('');
  next()
}
