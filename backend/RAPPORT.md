# Rapport MonLivres

## Modèle SQL
La base de données `monlivres` contient les tables principales suivantes :
- `users` : utilisateurs avec rôle, email unique, mot de passe hashé, actif.
- `categories` : catégories d’ouvrages.
- `ouvrages` : produits avec prix, stock, image et catégorie.
- `panier` / `panier_items` : panier actif par client et articles conservés.
- `commandes` / `commande_items` : commandes clients et détails des articles.
- `listes_cadeaux` / `liste_items` : listes de cadeaux partageables.
- `avis` : avis clients avec contrainte unique par client/ouvrage.
- `commentaires` : commentaires soumis, validés par un éditeur.
- `payments` : table optionnelle pour les transactions.

## Relations entre les tables
- `ouvrages.categorie_id` pointe vers `categories.id`.
- `panier.client_id` et `commandes.client_id` pointent vers `users.id`.
- `panier_items` et `commande_items` relient un panier ou une commande à un ouvrage.
- `listes_cadeaux.proprietaire_id` relie une liste à un utilisateur.
- `avis` et `commentaires` relient un client et un ouvrage.
- `commentaires.valide_par` référence l’utilisateur qui valide.

## Règles métier implémentées
- Seuls les ouvrages avec `stock > 0` sont renvoyés dans la liste publique.
- Lors de la création d’une commande, le stock disponible est vérifié et décrémenté dans la transaction.
- Si le stock est insuffisant, la commande est bloquée.
- Pour laisser un avis, le client doit avoir acheté l’ouvrage au moins une fois.
- Les commentaires sont créés avec `valide = false` et validés ensuite par un éditeur.
- Un cron job désactive les paniers inactifs de plus de 24 heures.

## Authentification
- Les mots de passe sont hachés avec `bcrypt.hashSync`.
- La connexion retourne un JWT signé avec `process.env.JWT_SECRET`.
- Le middleware `authMiddleware` vérifie le token et ajoute `req.user`.

## Validation
- Les routes sensibles utilisent un middleware de rôle.

## Limitations possibles
- La gestion des commandes et des paniers est simple, sans historique de retrait de panier.
- Les commentaires validés sont stockés sans système de rejet avancé.
- La validation des images reste basique avec `multer`.
- Aucune page front n’est fournie : l’API est prête à être consommée par un client.
