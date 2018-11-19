/**
 * Start cooking
 *
 * POST: /action/start
 * 
 */
exports.handler = function startCooking(req, res, next) {
  res.send('startCooking')
  next()
}
