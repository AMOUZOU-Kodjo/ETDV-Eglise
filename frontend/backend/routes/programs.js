const express = require('express');
const { getDb } = require('../database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET - Récupérer tous les programmes
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const { category } = req.query;
    
    let query = 'SELECT * FROM programs';
    const params = [];
    
    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY date DESC';
    
    const programs = await db.all(query, params);
    res.json(programs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des programmes' });
  }
});

// GET - Récupérer un programme par ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const program = await db.get('SELECT * FROM programs WHERE id = ?', [req.params.id]);
    
    if (!program) {
      return res.status(404).json({ error: 'Programme non trouvé' });
    }
    
    // Parse JSON fields
    if (program.leaders) program.leaders = JSON.parse(program.leaders);
    if (program.highlights) program.highlights = JSON.parse(program.highlights);
    
    res.json(program);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération du programme' });
  }
});

// POST - Créer un programme (admin seulement)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title, description, long_description, day, time, location,
      category, type, week, month, dates, capacity, leaders, highlights, color, icon
    } = req.body;
    
    const db = getDb();

    const result = await db.run(
      `INSERT INTO programs 
       (title, description, long_description, day, time, location, category, type, week, month, dates, capacity, leaders, highlights, color, icon) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, description, long_description, day, time, location,
        category, type, week, month, dates, capacity,
        leaders ? JSON.stringify(leaders) : null,
        highlights ? JSON.stringify(highlights) : null,
        color, icon
      ]
    );

    const newProgram = await db.get('SELECT * FROM programs WHERE id = ?', [result.lastID]);
    res.status(201).json(newProgram);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du programme' });
  }
});

// PUT - Mettre à jour un programme (admin seulement)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const {
      title, description, long_description, day, time, location,
      category, type, week, month, dates, capacity, leaders, highlights, color, icon
    } = req.body;
    
    const db = getDb();

    const result = await db.run(
      `UPDATE programs 
       SET title = ?, description = ?, long_description = ?, day = ?, time = ?, location = ?,
           category = ?, type = ?, week = ?, month = ?, dates = ?, capacity = ?,
           leaders = ?, highlights = ?, color = ?, icon = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        title, description, long_description, day, time, location,
        category, type, week, month, dates, capacity,
        leaders ? JSON.stringify(leaders) : null,
        highlights ? JSON.stringify(highlights) : null,
        color, icon, req.params.id
      ]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Programme non trouvé' });
    }

    const updatedProgram = await db.get('SELECT * FROM programs WHERE id = ?', [req.params.id]);
    res.json(updatedProgram);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du programme' });
  }
});

// DELETE - Supprimer un programme (admin seulement)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.run('DELETE FROM programs WHERE id = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Programme non trouvé' });
    }

    res.json({ message: 'Programme supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression du programme' });
  }
});

module.exports = router;