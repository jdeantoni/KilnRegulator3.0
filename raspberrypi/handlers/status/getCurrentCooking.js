/**
 * Get current cooking info from the beginning
 *
 * GET: /status/cooking
 *
 */
exports.handler = function getCurrentCooking(req, res, next) {
  const cookingRepository = require('../../services/cookingrepository');
  const arduino = require('../../services/arduinorepository').first();
  if (!arduino) {
    res.status(503);
    res.send({errored: true});
    return;
  }

  if (!arduino.cooking.uuid) {
    res.status(400);
    res.send({error: "Cooking not started"});
    return;
  }

  cookingRepository.get(arduino.cooking.uuid, function(err, cooking) {
    if (err) {
      res.status(500);
      res.send({error: err});
      console.error(err);
    } else {
      res.send(cooking);
    }
    next()
  });
}
