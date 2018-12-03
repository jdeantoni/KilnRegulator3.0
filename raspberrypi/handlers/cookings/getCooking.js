/**
 * get the cooking with the given uuid (including all samples)
 *
 * GET: /cookings/{uuid}
 *
 * path:
 *   uuid {uuid}
 *
 */
exports.handler = function getCooking(req, res, next) {
  const cookingRepository = require('../../services/cookingrepository');

  if (!(req.params.hasOwnProperty('uuid') && req.params.uuid != null)) {
    res.status(400);
    res.send('Missing uuid');
    return;
  }

  cookingRepository.get(req.params.uuid, function(err, cooking) {
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
