/**
 * Get current status of oven
 *
 * GET: /status
 * 
 */
var msgpack = require('msgpack5')() // namespace our extensions
  , encode  = msgpack.encode
  , decode  = msgpack.decode
  , decoder = msgpack.decoder()


var temperature = 0.0;

var SerialPort = require('serialport');

var serialPort = new SerialPort('/dev/ttyUSB0', {
    baudRate: 115200
});

// Open errors will be emitted as an error event
serialPort.on('error', function(err) {
  console.log('Error: ', err.message);
})

// Switches the port into "flowing mode"
serialPort.on('data', function (data) {
    console.log('Data:', data.toString('hex'));
    //console.log(decode(data));
    decoder.write(data);
});

decoder.on('data', function (data) {
    console.log(data);
    temperature = data.temperature;
});



exports.handler = function getStatus(req, res, next) {
//  res.send('getStatus')
  res.send({
  	sample: {temperature: temperature}});

  next()
}
