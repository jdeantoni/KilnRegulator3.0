/**
 * Get current cooking info from the beginning
 *
 * GET: /status/cooking
 *
 */
exports.handler = function getCurrentCooking(req, res, next) {
  const arduino = require('../../services/arduinorepository').first();
  if (!arduino) {
    res.status(503);
    res.send({errored: true});
    return;
  }

  if (!arduino.cooking.startDate) {
    res.status(400);
    res.send({error: "Cooking not started"});
  }

  res.send(arduino.cooking);
  next()
}
