# MonLivres - Backend API

API REST simple pour la librairie MonLivres, réalisée avec Node.js, Express et MySQL.

## Présentation
Ce projet fournit une API backend fonctionnelle pour gérer :
- authentification JWT
- gestion des utilisateurs et des rôles
- gestion des catégories et ouvrages
- panier et commandes
- listes cadeaux
- avis clients
- commentaires modérés

## Technologies utilisées
- Node.js
- Express
- MySQL (mysql2)
- JWT
- bcrypt
- dotenv
- cors
- multer

## Installation
1. Copier ce dépôt dans `backend`
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Créer un fichier `.env` à partir de `.env.example`
4. Configurer la base de données MySQL et exécuter `sql/schema.sql`
5. Importer les données de `sql/seed.sql`

## Démarrage
```bash
npm run start
```

ou en développement :
```bash
npm run dev
```

## Fichiers importants
- `server.js` : configuration du serveur
- `config/db.js` : connexion MySQL
- `routes/` : définition des routes API
- `controllers/` : logique des endpoints
- `middleware/` : authentification, rôles, erreurs
- `sql/schema.sql` : schéma de la base
- `sql/seed.sql` : données de test

## Endpoints principaux

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Utilisateurs
- `GET /api/users/me`
- `GET /api/users` (admin)
- `PUT /api/users/:id`

### Catégories
- `GET /api/categories`
- `POST /api/categories` (éditeur, gestionnaire, admin)
- `PUT /api/categories/:id` (éditeur, gestionnaire, admin)
- `DELETE /api/categories/:id` (gestionnaire, admin)

### Ouvrages
- `GET /api/ouvrages`
- `GET /api/ouvrages/:id`
- `POST /api/ouvrages` (éditeur, gestionnaire, admin)
- `PUT /api/ouvrages/:id` (éditeur, gestionnaire, admin)
- `DELETE /api/ouvrages/:id` (éditeur, gestionnaire, admin)

### Panier
- `GET /api/panier`
- `POST /api/panier/items`
- `PUT /api/panier/items/:id`
- `DELETE /api/panier/items/:id`

### Commandes
- `POST /api/commandes`
- `GET /api/commandes`
- `GET /api/commandes/:id`
- `PUT /api/commandes/:id/status` (gestionnaire, admin)

### Listes cadeaux
- `POST /api/listes`
- `GET /api/listes/:code`
- `POST /api/listes/:id/acheter`

### Avis et commentaires
- `POST /api/ouvrages/:id/avis`
- `POST /api/ouvrages/:id/commentaires`
- `PUT /api/commentaires/:id/valider` (éditeur, gestionnaire, admin)

## Rôles utilisateurs
- `client`
- `editeur`
- `gestionnaire`
- `administrateur`

## Notes
- Le middleware JWT protège les routes sensibles.
- Les ouvrages affichés sont filtrés pour n’inclure que ceux avec un stock > 0.
- Les commentaires sont soumis avec `valide = false` et doivent être validés.
- Un avis est autorisé uniquement après achat du livre.
