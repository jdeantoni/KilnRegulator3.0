var mongoose = require('mongoose');

var cookingSchema = new mongoose.Schema({
  programId:  { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  samples: [{
    timestamp: Number,
    temperature: Number,
  }],
  error: String
});
mongoose.model('cooking', cookingSchema);
