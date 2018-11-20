/**
 * Stop cooking
 *
 * POST: /action/stop
 * 
 */
exports.handler = function stopCooking(req, res, next) {
  res.send('stopCooking')
  next()
}
