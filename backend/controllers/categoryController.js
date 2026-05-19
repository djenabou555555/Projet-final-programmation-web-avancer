const db = require('../config/db');

exports.getAll = (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.create = (req, res) => {
  const { nom, description } = req.body;
  db.query('INSERT INTO categories (nom, description) VALUES (?, ?)', [nom, description || null], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: 'Catégorie créée', categoryId: result.insertId });
  });
};

exports.update = (req, res) => {
  const { nom, description } = req.body;
  db.query('UPDATE categories SET nom = ?, description = ? WHERE id = ?', [nom, description || null, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Catégorie modifiée' });
  });
};

exports.delete = (req, res) => {
  db.query('DELETE FROM categories WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Catégorie supprimée' });
  });
};
