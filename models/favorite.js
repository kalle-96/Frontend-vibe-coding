const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  from: String,
  to: String,
  amount: Number,
  result: Number
});

module.exports = mongoose.model("Favorite", favoriteSchema);