const db = require('../config/db');

exports.getCart = (req, res) => {
 const userId = 1;

  db.query(
    'SELECT p.id AS panier_id, pi.id AS item_id, pi.ouvrage_id, pi.quantite, pi.prix_unitaire FROM panier p JOIN panier_items pi ON p.id = pi.panier_id WHERE p.client_id = ? AND p.actif = 1',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

exports.addItem = (req, res) => {
  const userId = 1;
  const { ouvrage_id, quantite } = req.body;
  const qty = parseInt(quantite, 10) || 1;

  if (!ouvrage_id || qty <= 0) {
    return res.status(400).json({ message: 'Ouvrage et quantité requis' });
  }

  db.query('SELECT * FROM panier WHERE client_id = ? AND actif = 1', [userId], (err, panierRows) => {
    if (err) return res.status(500).json(err);

    function add(panierId) {
      db.query('SELECT * FROM ouvrages WHERE id = ?', [ouvrage_id], (err2, books) => {
        if (err2) return res.status(500).json(err2);
        if (books.length === 0) return res.status(404).json({ message: 'Ouvrage introuvable' });
        if (qty > books[0].stock) return res.status(400).json({ message: 'Stock insuffisant' });

        db.query(
          'SELECT * FROM panier_items WHERE panier_id = ? AND ouvrage_id = ?',
          [panierId, ouvrage_id],
          (err3, items) => {
            if (err3) return res.status(500).json(err3);

            if (items.length > 0) {
              db.query(
                'UPDATE panier_items SET quantite = quantite + ? WHERE id = ?',
                [qty, items[0].id],
                (err4) => {
                  if (err4) return res.status(500).json(err4);
                  res.json({ message: 'Quantité mise à jour' });
                }
              );
            } else {
              db.query(
                'INSERT INTO panier_items (panier_id, ouvrage_id, quantite, prix_unitaire) VALUES (?, ?, ?, ?)',
                [panierId, ouvrage_id, qty, books[0].prix],
                (err4) => {
                  if (err4) return res.status(500).json(err4);
                  res.status(201).json({ message: 'Article ajouté au panier' });
                }
              );
            }
          }
        );
      });
    }

    if (panierRows.length === 0) {
      db.query('INSERT INTO panier (client_id, actif) VALUES (?, 1)', [userId], (err2, result) => {
        if (err2) return res.status(500).json(err2);
        add(result.insertId);
      });
    } else {
      add(panierRows[0].id);
    }
  });
};

exports.updateItem = (req, res) => {
  const itemId = req.params.id;
  const qty = parseInt(req.body.quantite, 10);

  if (!qty && qty !== 0) {
    return res.status(400).json({ message: 'Quantité requise' });
  }

  if (qty < 0) {
    return res.status(400).json({ message: 'Quantité invalide' });
  }

  if (qty === 0) {
    db.query('DELETE FROM panier_items WHERE id = ?', [itemId], (err) => {
      if (err) return res.status(500).json(err);
      return res.json({ message: 'Article supprimé du panier' });
    });
    return;
  }

  db.query('UPDATE panier_items SET quantite = ? WHERE id = ?', [qty, itemId], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Quantité de panier mise à jour' });
  });
};

exports.deleteItem = (req, res) => {
  db.query('DELETE FROM panier_items WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Article supprimé du panier' });
  });
};
