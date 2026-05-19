const db = require('../config/db');

exports.create = (req, res) => {
  const clientId = 1;
  const ouvrageId = parseInt(req.params.id, 10);
  const { note, commentaire } = req.body;

  if (!note || note < 1 || note > 5) {
    return res.status(400).json({ message: 'Note entre 1 et 5 requise' });
  }

  db.query(
    `SELECT 1 FROM commandes c
      JOIN commande_items ci ON c.id = ci.commande_id
      WHERE c.client_id = ? AND ci.ouvrage_id = ? LIMIT 1`,
    [clientId, ouvrageId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
      if (results.length === 0) return res.status(403).json({ message: 'Achat requis pour laisser un avis' });

      db.query(
        'INSERT INTO avis (client_id, ouvrage_id, note, commentaire) VALUES (?, ?, ?, ?)',
        [clientId, ouvrageId, note, commentaire || null],
        (insertErr, insertResult) => {
          if (insertErr) {
            if (insertErr.code === 'ER_DUP_ENTRY') {
              return res.status(400).json({ message: 'Vous avez déjà laissé un avis pour cet ouvrage' });
            }
            return res.status(500).json({ message: 'Impossible de créer l’avis', error: insertErr });
          }
          res.status(201).json({ message: 'Avis ajouté', avisId: insertResult.insertId });
        }
      );
    }
  );
};
