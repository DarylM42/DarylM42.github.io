const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  start: { type: Date, required: true },          // stored as Date in MongoDB
  description: { type: String, required: true },
  length: { type: Number, required: true },        // stored as Number
  price: { type: Number, required: true }          // stored as Number
});

mongoose.model('Trip', tripSchema);
