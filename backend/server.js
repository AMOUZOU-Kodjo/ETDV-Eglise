const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const PORT = 5000;
const SECRET = "SUPER_SECRET_KEY";

// -------------------
// Admin sécurisé
// -------------------
const ADMIN_EMAIL = "admin@eglise.com";
const ADMIN_PASSWORD = bcrypt.hashSync("123456", 10);

// -------------------
// Middleware JWT
// -------------------
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: "Accès refusé" });

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Token invalide" });
  }
};

// -------------------
// Upload config
// -------------------
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// -------------------
// Fake DB
// -------------------
let posts = [];

// -------------------
// LOGIN
// -------------------
app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL)
    return res.status(401).json({ message: "Email incorrect" });

  const valid = await bcrypt.compare(password, ADMIN_PASSWORD);

  if (!valid)
    return res.status(401).json({ message: "Mot de passe incorrect" });

  const token = jwt.sign({ email }, SECRET, { expiresIn: "2h" });

  res.json({ token });
});

// -------------------
// UPLOAD
// -------------------
app.post("/upload", verifyToken, upload.single("file"), (req, res) => {
  res.json({
    mediaUrl: `http://localhost:5000/uploads/${req.file.filename}`,
  });
});

// -------------------
// CRUD POSTS
// -------------------
app.get("/posts", (req, res) => {
  res.json(posts);
});

app.post("/posts", verifyToken, (req, res) => {
  const newPost = {
    id: Date.now(),
    ...req.body,
  };
  posts.push(newPost);
  res.json(newPost);
});

app.put("/posts/:id", verifyToken, (req, res) => {
  posts = posts.map((p) =>
    p.id == req.params.id ? { ...p, ...req.body } : p
  );
  res.json({ message: "Post modifié" });
});

app.delete("/posts/:id", verifyToken, (req, res) => {
  posts = posts.filter((p) => p.id != req.params.id);
  res.json({ message: "Post supprimé" });
});

app.listen(PORT, () =>
  console.log(`Serveur démarré sur http://localhost:${PORT}`)
);