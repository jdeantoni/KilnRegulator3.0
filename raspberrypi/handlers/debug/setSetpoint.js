/**
 * set target temperature
 *
 * POST: /debug
 *
 * body:
 *   setpoint {double}
 *
 */
exports.handler = function setSetpoint(req, res, next) {
  let params = req.body;
  if (!req.body.hasOwnProperty('setpoint')) {
    res.status(400);
    res.send('Missing setpoint');
    return;
  }

  const arduinoRepository = require('../../services/arduinorepository');
  if (arduinoRepository.length < 1) {
    res.status(503);
    res.send("Arduino not found.");
    return;
  }

  arduinoRepository[0].setSetpoint(req.body.setpoint);

  res.send('')
  next()
}
