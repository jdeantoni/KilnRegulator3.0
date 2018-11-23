/**
 * Start cooking
 *
 * POST: /action/start
 *
 */
exports.handler = function startCooking(req, res, next) {
  const arduino = require('../../services/arduinorepository').first();
  if (!arduino) {
    res.status(503);
    res.send({errored: true});
    return;
  }

  arduino.start();

  res.send('');
  next()
}
