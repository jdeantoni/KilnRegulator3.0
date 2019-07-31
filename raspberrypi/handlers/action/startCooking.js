/**
 * Start cooking
 *
 * POST: /action/start
 *
 */
exports.handler = function startCooking(req, res, next) {
  const programRepository = require('../../services/programrepository');

  if (!req.body.hasOwnProperty('uuid')) {
    res.status(400);
    res.send('Missing uuid');
    return;
  }

  programRepository.exists(req.body.uuid, function(err, exists) {
    if (err) {
      res.status(500);
      res.send({error: err});
      console.error(err);
    } else if (!exists) {
      res.status(400);
      res.send('Program ' + req.body.uuid + ' not found');
    } else {
      programRepository.get(req.body.uuid, function(err, program) {
        if (err) {
          res.status(500);
          res.send({error: err});
          console.error(err);
        } else {

          const arduino = require('../../services/arduinorepository').first();
          if (!arduino || arduino.errored) {
            res.status(503);
            res.send({errored: true});
            return;
          }

          arduino.start(program);

          res.send('');
          next()
        }
      });
    }
  });
}
