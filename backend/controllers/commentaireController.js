const db = require('../config/db');

exports.create = (req, res) => {
  const clientId = 1;
  const ouvrageId = parseInt(req.params.id, 10);
  const { contenu } = req.body;

  if (!contenu) return res.status(400).json({ message: 'Contenu du commentaire requis' });

  db.query(
    'INSERT INTO commentaires (client_id, ouvrage_id, contenu, valide) VALUES (?, ?, ?, false)',
    [clientId, ouvrageId, contenu],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Impossible de créer le commentaire', error: err });
      res.status(201).json({ message: 'Commentaire soumis', commentaireId: result.insertId });
    }
  );
};

exports.validateComment = (req, res) => {
  const commentId = parseInt(req.params.id, 10);
  const editorId = 1;

  db.query('SELECT * FROM commentaires WHERE id = ?', [commentId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    if (rows.length === 0) return res.status(404).json({ message: 'Commentaire introuvable' });

    db.query(
      'UPDATE commentaires SET valide = true, date_validation = NOW(), valide_par = ? WHERE id = ?',
      [editorId, commentId],
      (updateErr) => {
        if (updateErr) return res.status(500).json({ message: 'Impossible de valider le commentaire', error: updateErr });
        res.json({ message: 'Commentaire validé' });
      }
    );
  });
};
