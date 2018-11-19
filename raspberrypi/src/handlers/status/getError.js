/**
 * Get error if any
 *
 * GET: /status/error
 * 
 */
exports.handler = function getError(req, res, next) {
  res.send('getError')
  next()
}
