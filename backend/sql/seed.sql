USE monlivres;

INSERT INTO users (nom, email, password_hash, role) VALUES
('Administrateur', 'admin@monlivres.test', '$2b$10$o4MiC6irjhBYVwM7DZ267O04dZM/p1v2WuuPBWWBDFrqURBmd8Yge', 'administrateur'),
('Editeur', 'editeur@monlivres.test', '$2b$10$o4MiC6irjhBYVwM7DZ267O04dZM/p1v2WuuPBWWBDFrqURBmd8Yge', 'editeur'),
('Client', 'client@monlivres.test', '$2b$10$o4MiC6irjhBYVwM7DZ267O04dZM/p1v2WuuPBWWBDFrqURBmd8Yge', 'client');

INSERT INTO categories (nom, description) VALUES
('Romans', 'Romans contemporains et classiques'),
('Science-fiction', 'Ouvrages futuristes et imaginaires'),
('Informatique', 'Livres sur le développement et les technologies');

INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, image, categorie_id) VALUES
('Le guide Node.js', 'Claire Dubois', '978-1234567890', 'Introduction pratique à Node.js', 29.90, 15, null, 3),
('Voyage sur Mars', 'Luc Martin', '978-0987654321', 'Roman de science-fiction captivant', 18.50, 8, null, 2),
('Lettres d’hier', 'Sophie Laurent', '978-1122334455', 'Roman historique et émotionnel', 21.00, 5, null, 1);

INSERT INTO listes_cadeaux (nom, proprietaire_id, code_partage) VALUES
('Anniversaire Lucas', 3, 'cadeau-lucas-01');

INSERT INTO liste_items (liste_id, ouvrage_id, quantite_souhaitee) VALUES
(1, 1, 1),
(1, 2, 2);
