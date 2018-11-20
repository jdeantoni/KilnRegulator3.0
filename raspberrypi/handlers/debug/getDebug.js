/**
 * Get current status of oven with debugging info
 *
 * GET: /debug
 * 
 */
exports.handler = function getDebug(req, res, next) {
  res.send('getDebug')
  next()
}
