const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getDb } = require('../database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configuration multer pour les uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|webm|mp3|wav/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
  fileFilter: fileFilter
});

// GET - Récupérer tous les médias
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const { type, featured } = req.query;
    
    let query = 'SELECT * FROM media';
    const params = [];
    
    if (type) {
      query += ' WHERE type = ?';
      params.push(type);
    }
    
    if (featured) {
      query += params.length ? ' AND featured = ?' : ' WHERE featured = ?';
      params.push(1);
    }
    
    query += ' ORDER BY date DESC';
    
    const media = await db.all(query, params);
    res.json(media);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des médias' });
  }
});

// GET - Récupérer un média par ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const media = await db.get('SELECT * FROM media WHERE id = ?', [req.params.id]);
    
    if (!media) {
      return res.status(404).json({ error: 'Média non trouvé' });
    }
    
    res.json(media);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération du média' });
  }
});

// POST - Upload de média (admin seulement)
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    const { title, description, type, tags, featured } = req.body;
    const db = getDb();
    
    const fileUrl = `/uploads/${req.file.filename}`;
    
    // Déterminer le type basé sur l'extension
    let mediaType = type;
    if (!mediaType) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) mediaType = 'photo';
      else if (['.mp4', '.webm'].includes(ext)) mediaType = 'video';
      else if (['.mp3', '.wav'].includes(ext)) mediaType = 'audio';
      else mediaType = 'photo';
    }

    const result = await db.run(
      `INSERT INTO media (title, description, url, type, tags, featured) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, fileUrl, mediaType, tags || '', featured || 0]
    );

    const newMedia = await db.get('SELECT * FROM media WHERE id = ?', [result.lastID]);
    res.status(201).json(newMedia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'upload du média' });
  }
});

// PUT - Mettre à jour un média (admin seulement)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, tags, featured } = req.body;
    const db = getDb();

    const result = await db.run(
      `UPDATE media 
       SET title = ?, description = ?, tags = ?, featured = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, description, tags || '', featured || 0, req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Média non trouvé' });
    }

    const updatedMedia = await db.get('SELECT * FROM media WHERE id = ?', [req.params.id]);
    res.json(updatedMedia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du média' });
  }
});

// DELETE - Supprimer un média (admin seulement)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const db = getDb();
    const media = await db.get('SELECT url FROM media WHERE id = ?', [req.params.id]);
    
    if (!media) {
      return res.status(404).json({ error: 'Média non trouvé' });
    }

    // Supprimer le fichier physique
    const filePath = path.join(__dirname, '..', media.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const result = await db.run('DELETE FROM media WHERE id = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Média non trouvé' });
    }

    res.json({ message: 'Média supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression du média' });
  }
});

// POST - Incrémenter les téléchargements
router.post('/:id/download', async (req, res) => {
  try {
    const db = getDb();
    await db.run('UPDATE media SET downloads = downloads + 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'incrémentation des téléchargements' });
  }
});

module.exports = router;