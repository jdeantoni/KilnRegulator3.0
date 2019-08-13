var mongoose = require('mongoose');

var programSchema = new mongoose.Schema({
  uuid:  { type: String, required: true },
  name: String,
  lastModificationDate: { type: Date, default: Date.now },
  segments: [{
    targetTemperature: Number,
    slope: Number,
    duration: Number,
    isFull: Boolean
  }],
  segmentsEditableStates: [{type:Boolean, default: true} ],
  archived: { type: Boolean, default: false}
});
mongoose.model('program', programSchema);
