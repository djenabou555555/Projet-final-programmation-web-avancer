# Livre Gourmand

Application web de vente de livres de recettes en français, développée dans le cadre du cours 420-WA6-AG, Étape 3.

**Auteurs :** Djenabou Diallo et Victor Chanel Fouda  
**Session :** H25 — Collège André-Grasset

---

## Technologies

**Backend :** Node.js, Express.js, MySQL, JWT, bcrypt, Multer  
**Frontend :** React 18, React Router v6, React Bootstrap, Axios, Vite

---

## Prérequis

- Node.js v18 ou plus
- MySQL v8 ou plus
- phpMyAdmin

---

## Installation

### Backend

```bash
cd backend
npm install
```

Créer le fichier `.env` dans `backend/` :

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=monlivres
PORT=3000
JWT_SECRET=monSecretJWT
```

Lancer le serveur :

```bash
node server.js
```

Le serveur démarre sur http://localhost:3000

### Frontend

```bash
cd livresgourmands-frontend
npm install
```

Créer le fichier `.env` dans `livresgourmands-frontend/` :

```
VITE_API_URL=http://localhost:3000/api
```

Lancer l'application :

```bash
npm run dev
```

L'application démarre sur http://localhost:5173

---

## Base de données

Créer la base dans phpMyAdmin :

```sql
CREATE DATABASE IF NOT EXISTS monlivres CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Importer dans l'ordre :
1. `backend/sql/schema.sql` — création des tables
2. `backend/sql/seed_ouvrages.sql` — données de test

Créer un compte administrateur :

```sql
INSERT INTO users (nom, email, password_hash, role) VALUES (
  'Admin',
  'admin@recettes.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'administrateur'
);
```

Mot de passe de ce compte : `password`

---

## Comptes de test

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@recettes.com | password | Administrateur |
| julie@example.com | password | Client |
| antoine@example.com | password | Editeur |
| marie@example.com | password | Client |

---

## Fonctionnalités

- Page d'accueil avec recettes populaires
- Catalogue avec recherche par titre, auteur ou ISBN
- Filtrage par catégorie
- Page détail avec description, prix, stock et avis clients
- Panier dynamique avec persistance dans le navigateur
- Livraison gratuite à partir de 50 dollars
- Formulaire de paiement avec validation
- Confirmation de commande
- Inscription et connexion sécurisée avec JWT
- Tableau de bord administrateur avec statistiques
- Gestion complète des recettes (ajout, modification, suppression)
- Gestion des commandes avec changement de statut
- Design responsive pour mobile, tablette et desktop

---

## Routes principales

| Route | Description |
|-------|-------------|
| / | Page d'accueil |
| /products | Catalogue de recettes |
| /products/:id | Détail d'une recette |
| /categories | Parcourir par catégorie |
| /cart | Panier |
| /checkout | Paiement |
| /login | Connexion |
| /register | Inscription |
| /admin | Tableau de bord admin |
| /admin/ouvrages | Gestion des recettes |
| /admin/commandes | Gestion des commandes |

---

## Auteurs

**Djenabou Diallo** — Développeuse Full Stack  
**Victor Chanel Fouda** — Développeur Full Stack

Collège André-Grasset — 420-WA6-AG — H25
