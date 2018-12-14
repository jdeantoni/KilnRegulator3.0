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
  const programRepository = require('../../services/programrepository');

  cookingRepository.all(function(err, cookings) {
    if (err) {
      res.status(500);
      res.send({error: err});
      console.error(err);
    } else {
      programRepository.all(function(err, programs) {
        if (err) {
          res.status(500);
          res.send({error: err});
          console.error(err);
        } else {
          let programName = {};
          //map program uuid to program name
          programs.forEach((program) => {
            programName[program.uuid] = program.name;
          });

          //add program name from uuid using above map
          cookings.forEach((cooking) => {
            if (programName.hasOwnProperty(cooking.programId)) {
              cooking.programName = programName[cooking.programId];
            }
          });

          res.send(cookings);
          next()
        }
      });
    }
  });
}
