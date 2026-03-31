const express = require('express');
const { getDb } = require('../database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET - Récupérer tous les posts
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const posts = await db.all('SELECT * FROM posts ORDER BY date DESC');
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des posts' });
  }
});

// GET - Récupérer un post par ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const post = await db.get('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    
    if (!post) {
      return res.status(404).json({ error: 'Post non trouvé' });
    }
    
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération du post' });
  }
});

// POST - Créer un post (admin seulement)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, type, author, featured } = req.body;
    const db = getDb();

    const result = await db.run(
      'INSERT INTO posts (title, content, type, author, featured) VALUES (?, ?, ?, ?, ?)',
      [title, content, type, author, featured || 0]
    );

    const newPost = await db.get('SELECT * FROM posts WHERE id = ?', [result.lastID]);
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du post' });
  }
});

// PUT - Mettre à jour un post (admin seulement)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, content, type, author, featured } = req.body;
    const db = getDb();

    const result = await db.run(
      `UPDATE posts 
       SET title = ?, content = ?, type = ?, author = ?, featured = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, content, type, author, featured || 0, req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Post non trouvé' });
    }

    const updatedPost = await db.get('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du post' });
  }
});

// DELETE - Supprimer un post (admin seulement)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.run('DELETE FROM posts WHERE id = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Post non trouvé' });
    }

    res.json({ message: 'Post supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression du post' });
  }
});

// POST - Incrémenter les vues
router.post('/:id/view', async (req, res) => {
  try {
    const db = getDb();
    await db.run('UPDATE posts SET views = views + 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'incrémentation des vues' });
  }
});

// POST - Incrémenter les likes
router.post('/:id/like', async (req, res) => {
  try {
    const db = getDb();
    await db.run('UPDATE posts SET likes = likes + 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'incrémentation des likes' });
  }
});

module.exports = router;