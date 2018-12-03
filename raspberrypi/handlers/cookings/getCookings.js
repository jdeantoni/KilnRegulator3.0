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

  cookingRepository.all(function(err, cookings) {
    if (err) {
      res.status(500);
      res.send({error: err});
      console.error(err);
    } else {
      res.send(cookings);
    }
    next()
  });
}
