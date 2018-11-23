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

  const arduino = require('../../services/arduinorepository').first();
  if (!arduino) {
    res.status(503);
    res.send({errored: true});
    return;
  }

  arduino.setSetpoint(req.body.setpoint);

  res.send('')
  next()
}
