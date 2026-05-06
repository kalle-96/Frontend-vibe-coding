const mongoose = require("mongoose");

const conversionSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  result: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.models.Conversion || mongoose.model("Conversion", conversionSchema);