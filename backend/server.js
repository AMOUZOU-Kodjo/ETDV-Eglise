const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const Post = require("./models/Post");
const Media = require("./models/Media");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


mongoose.connect(
  "mongodb+srv://kodjoamouzouv_db_user:FxVdRgavq9y2fXp0@cluster0.hxbj70y.mongodb.net/churchDB?retryWrites=true&w=majority"
)
.then(() => console.log("MongoDB Atlas connecté"))
.catch(err => console.log(err));

/* ================= POSTS ================= */

app.get("/posts", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

app.post("/posts", async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.json(post);
});

app.put("/posts/:id", async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(post);
});

app.delete("/posts/:id", async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Post supprimé" });
});

/* ================= MEDIA ================= */

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.get("/media", async (req, res) => {
  const media = await Media.find();
  res.json(media);
});

app.post("/media", upload.single("file"), async (req, res) => {
  const newMedia = new Media({
    title: req.body.title,
    type: req.body.type,
    url: `http://localhost:3001/uploads/${req.file.filename}`
  });
  await newMedia.save();
  res.json(newMedia);
});

app.put("/media/:id", upload.single("file"), async (req, res) => {
  const updateData = {
    title: req.body.title,
    type: req.body.type
  };

  if (req.file) {
    updateData.url = `http://localhost:3001/uploads/${req.file.filename}`;
  }

  const media = await Media.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json(media);
});

app.delete("/media/:id", async (req, res) => {
  await Media.findByIdAndDelete(req.params.id);
  res.json({ message: "Média supprimé" });
});

app.listen(3001, () => console.log("Serveur lancé sur port 3001"));