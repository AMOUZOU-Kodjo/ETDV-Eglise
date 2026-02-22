const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  type: String
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema);