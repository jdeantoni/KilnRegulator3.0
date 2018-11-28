/**
 * Get all programs
 *
 * GET: /programs
 *
 */
exports.handler = function getPrograms(req, res, next) {
  const programRepository = require('../../services/programrepository');

  programRepository.all(function(err, programs) {
    if (err) {
      res.status(500);
      res.send({error: err});
      console.error(err);
    } else {
      res.send(programs);
    }
    next()
  });
}
