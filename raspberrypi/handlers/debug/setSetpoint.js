/**
 * set target temperature
 *
 * POST: /debug
 * 
 * body:
 *   setpoint {double}
 *   
 */
exports.handler = function setSetpoint(req, res, next) {
  res.send('setSetpoint')
  next()
}
