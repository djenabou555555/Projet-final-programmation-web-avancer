const db = require('../config/db');

exports.getAll = (req, res) => {
  db.query('SELECT * FROM ouvrages WHERE stock > 0', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getById = (req, res) => {
  db.query('SELECT * FROM ouvrages WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: 'Ouvrage introuvable' });
    res.json(results[0]);
  });
};

exports.create = (req, res) => {
  const { titre, auteur, isbn, description, prix, stock, categorie_id } = req.body;
  const image = req.file ? req.file.filename : null;

  db.query(
    'INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, image, categorie_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [titre, auteur, isbn, description || null, prix, stock, image, categorie_id || null],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: 'Ouvrage créé', ouvrageId: result.insertId });
    }
  );
};

exports.update = (req, res) => {
  const { titre, auteur, isbn, description, prix, stock, categorie_id } = req.body;
  const image = req.file ? req.file.filename : null;

  db.query(
    'UPDATE ouvrages SET titre = ?, auteur = ?, isbn = ?, description = ?, prix = ?, stock = ?, image = ?, categorie_id = ? WHERE id = ?',
    [titre, auteur, isbn, description || null, prix, stock, image, categorie_id || null, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Ouvrage modifié' });
    }
  );
};

exports.delete = (req, res) => {
  db.query('DELETE FROM ouvrages WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Ouvrage supprimé' });
  });
};
