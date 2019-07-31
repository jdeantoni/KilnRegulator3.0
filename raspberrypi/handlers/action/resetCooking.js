/**
 * Reset cooking
 *
 * POST: /action/reset
 *
 */
exports.handler = function resetCooking(req, res, next) {
  const arduino = require('../../services/arduinorepository').first();
  if (!arduino) {
    res.status(503);
    res.send({errored: true});
    return;
  }

  if (!arduino.status || arduino.status.state != "stopped") {
    res.status(400);
    res.send({error: "not in stopped state"});
    return;
  }

  arduino.reset();

  res.send('')
  next()
}
