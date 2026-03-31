const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const bcrypt = require('bcryptjs');

let db;

async function initializeDatabase() {
  db = await open({
    filename: path.join(__dirname, 'church.db'),
    driver: sqlite3.Database
  });

  // Création des tables
  await db.exec(`
    -- Table des utilisateurs
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Table des posts (événements)
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT CHECK(type IN ('message', 'news', 'verse')) NOT NULL,
      author TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      featured INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      likes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Table des médias
    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      url TEXT NOT NULL,
      type TEXT CHECK(type IN ('photo', 'video', 'audio')) NOT NULL,
      thumbnail TEXT,
      duration TEXT,
      tags TEXT,
      views INTEGER DEFAULT 0,
      downloads INTEGER DEFAULT 0,
      likes INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Table des programmes
    CREATE TABLE IF NOT EXISTS programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      long_description TEXT,
      day TEXT,
      time TEXT,
      location TEXT,
      category TEXT CHECK(category IN ('weekly', 'monthly', 'annual')) NOT NULL,
      type TEXT,
      week TEXT,
      month TEXT,
      dates TEXT,
      capacity TEXT,
      leaders TEXT,
      highlights TEXT,
      color TEXT,
      icon TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Table des statistiques
    CREATE TABLE IF NOT EXISTS stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE UNIQUE NOT NULL,
      visitors INTEGER DEFAULT 0,
      page_views INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Table des logs admin
    CREATE TABLE IF NOT EXISTS admin_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_id INTEGER,
      action TEXT,
      details TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (admin_id) REFERENCES users(id)
    );
  `);

  // Création d'un utilisateur admin par défaut
  const adminExists = await db.get('SELECT * FROM users WHERE username = ?', ['admin']);
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    await db.run(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['admin', 'admin@eglise.com', hashedPassword, 'admin']
    );
    console.log('✅ Compte admin créé: admin / Admin123!');
  }

  console.log('✅ Base de données initialisée');
  return db;
}

function getDb() {
  return db;
}

module.exports = { initializeDatabase, getDb };