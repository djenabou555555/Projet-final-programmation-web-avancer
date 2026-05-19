const db = require('../config/db');

exports.create = (req, res) => {
  const proprietaireId = 1;
  const { nom } = req.body;
  const code = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);

  db.query('INSERT INTO listes_cadeaux (nom, proprietaire_id, code_partage) VALUES (?, ?, ?)', [nom, proprietaireId, code], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: 'Liste créée', listeId: result.insertId, code_partage: code });
  });
};

exports.getByCode = (req, res) => {
  db.query('SELECT * FROM listes_cadeaux WHERE code_partage = ?', [req.params.code], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (rows.length === 0) return res.status(404).json({ message: 'Liste non trouvée' });

    db.query('SELECT * FROM liste_items WHERE liste_id = ?', [rows[0].id], (err2, items) => {
      if (err2) return res.status(500).json(err2);
      res.json({ liste: rows[0], items });
    });
  });
};

exports.addItem = (req, res) => {
  const listeId = req.params.id;
  const { ouvrage_id, quantite_souhaitee } = req.body;
  const quantity = parseInt(quantite_souhaitee, 10) || 1;

  if (!ouvrage_id || quantity <= 0) {
    return res.status(400).json({ message: 'Ouvrage et quantité requis' });
  }

  db.query(
    'INSERT INTO liste_items (liste_id, ouvrage_id, quantite_souhaitee) VALUES (?, ?, ?)',
    [listeId, ouvrage_id, quantity],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: 'Article ajouté à la liste', itemId: result.insertId });
    }
  );
};

exports.purchase = (req, res) => {
  const clientId = 1;
  const listeId = req.params.id;
  const { adresse_livraison, mode_livraison, mode_paiement } = req.body;

  db.query('SELECT * FROM liste_items WHERE liste_id = ?', [listeId], (err, items) => {
    if (err) return res.status(500).json(err);
    if (items.length === 0) return res.status(400).json({ message: 'Liste vide' });

    const ids = items.map((item) => item.ouvrage_id);
    db.query('SELECT id, stock, prix FROM ouvrages WHERE id IN (?)', [ids], (err2, ouvrages) => {
      if (err2) return res.status(500).json(err2);

      const notEnough = items.find((item) => {
        const ouvrage = ouvrages.find((o) => o.id === item.ouvrage_id);
        return !ouvrage || item.quantite_souhaitee > ouvrage.stock;
      });
      if (notEnough) return res.status(400).json({ message: 'Stock insuffisant pour un ou plusieurs ouvrages' });

      const total = items.reduce((sum, item) => {
        const ouvrage = ouvrages.find((o) => o.id === item.ouvrage_id);
        return sum + item.quantite_souhaitee * (ouvrage ? ouvrage.prix : 0);
      }, 0).toFixed(2);

      db.beginTransaction((err3) => {
        if (err3) return res.status(500).json(err3);

        db.query(
          'INSERT INTO commandes (client_id, total, statut, adresse_livraison, mode_livraison, mode_paiement) VALUES (?, ?, ?, ?, ?, ?)',
          [clientId, total, 'en_cours', adresse_livraison || null, mode_livraison || null, mode_paiement || null],
          (err4, result) => {
            if (err4) return db.rollback(() => res.status(500).json(err4));
            const commandeId = result.insertId;

            function insertItem(index) {
              if (index >= items.length) {
                return db.commit((err5) => {
                  if (err5) return db.rollback(() => res.status(500).json(err5));
                  res.status(201).json({ message: 'Achat de la liste effectué', commandeId });
                });
              }

              const item = items[index];
              db.query(
                'INSERT INTO commande_items (commande_id, ouvrage_id, quantite, prix_unitaire) VALUES (?, ?, ?, ?)',
                [commandeId, item.ouvrage_id, item.quantite_souhaitee, ouvrages.find((o) => o.id === item.ouvrage_id).prix],
                (err5) => {
                  if (err5) return db.rollback(() => res.status(500).json(err5));
                  db.query('UPDATE ouvrages SET stock = stock - ? WHERE id = ?', [item.quantite_souhaitee, item.ouvrage_id], (err6) => {
                    if (err6) return db.rollback(() => res.status(500).json(err6));
                    insertItem(index + 1);
                  });
                }
              );
            }

            insertItem(0);
          }
        );
      });
    });
  });
};
