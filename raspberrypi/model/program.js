var mongoose = require('mongoose');

var programSchema = new mongoose.Schema({
  uuid:  { type: String, required: true },
  name: String,
  lastModificationDate: { type: Date, default: Date.now },
  segments: [{
    targetTemperature: Number,
    slope: Number,
    duration: Number
  }]
});
mongoose.model('program', programSchema);
