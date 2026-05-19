const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
  const { nom, email, password } = req.body;
  const password_hash = bcrypt.hashSync(password, 10);

  db.query(
    'INSERT INTO users (nom, email, password_hash) VALUES (?, ?, ?)',
    [nom, email, password_hash],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: 'Utilisateur créé', userId: result.insertId });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: 'Email introuvable' });

    const user = results[0];
    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user.id, nom: user.nom, email: user.email, role: user.role } });
  });
};
