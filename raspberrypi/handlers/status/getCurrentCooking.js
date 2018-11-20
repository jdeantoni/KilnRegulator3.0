/**
 * Get current cooking info from the beginning
 *
 * GET: /status/cooking
 * 
 */
exports.handler = function getCurrentCooking(req, res, next) {
  res.send('getCurrentCooking')
  next()
}
