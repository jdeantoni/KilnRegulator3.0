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

	if (!programRepository.exists(req.body.uuid)) {
		res.status(400);
		res.send('Program ' + uuid + ' not found');
	}

  const program = programRepository.get(req.body.uuid);

  const arduino = require('../../services/arduinorepository').first();
  if (!arduino) {
    res.status(503);
    res.send({errored: true});
    return;
  }

  arduino.start(program);

  res.send('');
  next()
}
