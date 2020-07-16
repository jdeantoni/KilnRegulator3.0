var mongoose = require('mongoose');
const options = { // Inspired from https://mongoosejs.com/docs/connections.html
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
};

// Auto reconnect doesn't seem to work so do our own stuff here (with some logging too)
var db = mongoose.connection;
db.on('connecting', function() {
  console.log('connecting to MongoDB...');
});
db.on('error', function(error) {
  console.error('Error in MongoDb connection: ' + error);
  mongoose.disconnect();
});
db.on('connected', function() {
  console.log('MongoDB connected!');
});
db.once('open', function() {
  console.log('MongoDB connection opened!');
});
db.on('reconnected', function () {
  console.log('MongoDB reconnected!');
});
db.on('disconnected', function() {
  console.log('MongoDB disconnected!');
  setTimeout(function() {
    mongoose.connect('mongodb://127.0.0.1/kilnregulator', options);
  }, 5000);
});
mongoose.connect('mongodb://127.0.0.1/kilnregulator', options);
