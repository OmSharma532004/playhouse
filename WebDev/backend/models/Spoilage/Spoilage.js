const mongoose = require('mongoose');

const spoilageSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  spoilage: { type: Number, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  sunlight: { type: Number, required: true },
});

module.exports = mongoose.model('Spoilage', spoilageSchema);
