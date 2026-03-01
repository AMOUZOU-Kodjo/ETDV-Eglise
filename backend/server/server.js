require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const Post = require("./models/Post");
const auth = require("./middleware/auth");

mongoose.connect(process.env.MONGO_URI);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "temp/" });

app.post("/upload", auth, upload.single("file"), async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "auto",
  });

  const post = await Post.create({
    title: req.body.title,
    description: req.body.description,
    mediaUrl: result.secure_url,
    mediaType: result.resource_type,
  });

  res.json(post);
});

app.get("/posts", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

app.delete("/posts/:id", auth, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json("Post supprimé");
});

app.listen(5000);