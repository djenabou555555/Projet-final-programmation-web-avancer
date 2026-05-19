const db = require('../config/db');

exports.create = (req, res) => {
  const { name, price, category_id } = req.body;
  const image = req.file ? req.file.filename : null;

  db.query(
    "INSERT INTO products (name, price, image, category_id) VALUES (?, ?, ?, ?)",
    [name, price, image, category_id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Produit ajouté");
    }
  );
};

exports.getAll = (req, res) => {
  db.query(
    `SELECT products.*, categories.name AS category
     FROM products
     JOIN categories ON products.category_id = categories.id`,
    (err, results) => {
      res.json(results);
    }
  );
};

exports.update = (req, res) => {
  const { name, price } = req.body;

  db.query(
    "UPDATE products SET name=?, price=? WHERE id=?",
    [name, price, req.params.id],
    () => res.json("Produit modifié")
  );
};

exports.delete = (req, res) => {
  db.query("DELETE FROM products WHERE id=?",
    [req.params.id],
    () => res.json("Produit supprimé")
  );
};
