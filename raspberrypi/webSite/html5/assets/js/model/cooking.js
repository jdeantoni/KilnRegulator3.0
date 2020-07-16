var mongoose = require('mongoose');

var cookingSchema = new mongoose.Schema({
  uuid:  { type: String, required: true },
  programId:  { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  samples: [{
      timestamp: Number,
      temperature: Number,
    }],
  error: String
});
mongoose.model('cooking', cookingSchema);
