const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema({
  title: String,
  type: String,
  url: String
}, { timestamps: true });

module.exports = mongoose.model("Media", MediaSchema);