const db = require('../config/db');

exports.create = (req, res) => {
  const clientId = 1;
  const { adresse_livraison, mode_livraison, mode_paiement } = req.body;

  db.query('SELECT id FROM panier WHERE client_id = ? AND actif = 1', [clientId], (err, panierRows) => {
    if (err) return res.status(500).json(err);
    if (panierRows.length === 0) return res.status(400).json({ message: 'Panier vide' });

    const panierId = panierRows[0].id;

    db.query(
      'SELECT pi.*, o.stock FROM panier_items pi JOIN ouvrages o ON pi.ouvrage_id = o.id WHERE pi.panier_id = ?',
      [panierId],
      (err2, items) => {
        if (err2) return res.status(500).json(err2);
        if (items.length === 0) return res.status(400).json({ message: 'Panier vide' });

        const bad = items.find((item) => item.quantite > item.stock);
        if (bad) return res.status(400).json({ message: 'Stock insuffisant' });

        const total = items.reduce((sum, item) => sum + item.quantite * item.prix_unitaire, 0).toFixed(2);

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
                  db.query('UPDATE panier SET actif = 0 WHERE id = ?', [panierId], (err5) => {
                    if (err5) return db.rollback(() => res.status(500).json(err5));
                    db.commit((err6) => {
                      if (err6) return db.rollback(() => res.status(500).json(err6));
                      res.status(201).json({ message: 'Commande créée', commandeId });
                    });
                  });
                  return;
                }

                const item = items[index];
                db.query(
                  'INSERT INTO commande_items (commande_id, ouvrage_id, quantite, prix_unitaire) VALUES (?, ?, ?, ?)',
                  [commandeId, item.ouvrage_id, item.quantite, item.prix_unitaire],
                  (err5) => {
                    if (err5) return db.rollback(() => res.status(500).json(err5));
                    db.query('UPDATE ouvrages SET stock = stock - ? WHERE id = ?', [item.quantite, item.ouvrage_id], (err6) => {
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
      }
    );
  });
};

exports.getOrders = (req, res) => {
  db.query('SELECT * FROM commandes ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getById = (req, res) => {
  db.query('SELECT * FROM commandes WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: 'Commande introuvable' });

    const commande = results[0];
    db.query('SELECT * FROM commande_items WHERE commande_id = ?', [req.params.id], (err2, items) => {
      if (err2) return res.status(500).json(err2);
      res.json({ commande, items });
    });
  });
};

exports.updateStatus = (req, res) => {
  const statut = req.body.statut;
  db.query('UPDATE commandes SET statut = ?, updated_at = NOW() WHERE id = ?', [statut, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Statut de commande mis à jour' });
  });
};
