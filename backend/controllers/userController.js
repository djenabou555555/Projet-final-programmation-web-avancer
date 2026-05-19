const db = require('../config/db');

exports.me = (req, res) => {
  db.query(
    'SELECT id, nom, email, role, actif, created_at, updated_at FROM users WHERE id = ?',
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
      if (results.length === 0) return res.status(404).json({ message: 'Utilisateur introuvable' });
      res.json(results[0]);
    }
  );
};

exports.getAll = (req, res) => {
  db.query(
    'SELECT id, nom, email, role, actif, created_at, updated_at FROM users ORDER BY id DESC',
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
      res.json(results);
    }
  );
};

exports.update = (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { nom, email, role, actif } = req.body;

  if (req.user.role !== 'administrateur' && req.user.id !== userId) {
    return res.status(403).json({ message: 'Accès refusé' });
  }

  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    if (rows.length === 0) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const user = rows[0];
    const updatedNom = nom || user.nom;
    const updatedEmail = email || user.email;
    const updatedRole = req.user.role === 'administrateur' && role ? role : user.role;
    const updatedActif = req.user.role === 'administrateur' && typeof actif === 'boolean' ? actif : user.actif;

    db.query(
      'UPDATE users SET nom = ?, email = ?, role = ?, actif = ? WHERE id = ?',
      [updatedNom, updatedEmail, updatedRole, updatedActif, userId],
      (updateErr) => {
        if (updateErr) return res.status(500).json({ message: 'Impossible de mettre à jour', error: updateErr });
        res.json({ message: 'Utilisateur mis à jour' });
      }
    );
  });
};
