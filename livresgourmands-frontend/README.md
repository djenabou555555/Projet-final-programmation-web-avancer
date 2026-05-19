#  Recette  Gourmandes— Frontend React

Frontend du site **Recettesgourmands.net**, développé en React + React-Bootstrap pour le cours **420-WA6-AG (Étape 3)**.

---

## 🗂 Structure du projet

```
frontend/
├── index.html
├── vite.config.js
├── package.json
├── .env.example
└── src/
    ├── main.jsx                     ← Point d'entrée React
    ├── api/
    │   └── axios.js                 ← Instance Axios configurée (JS pur)
    ├── app/
    │   ├── App.jsx                  ← Racine de l'application
    │   ├── routes.jsx               ← Toutes les routes (public + admin)
    │   ├── context/
    │   │   └── CartContext.jsx      ← Contexte panier (localStorage)
    │   ├── components/
    │   │   ├── NavBar.jsx           ← Barre de navigation principale
    │   │   ├── BookCard.jsx         ← Carte livre réutilisable
    │   │   ├── Layout.jsx           ← Wrapper NavBar + Footer
    │   │   └── ProtectedRoute.jsx   ← Garde de routes admin
    │   └── pages/
    │       ├── HomePage.jsx         ← Accueil (hero + badges + livres populaires)
    │       ├── Products.jsx         ← Catalogue avec recherche et filtres
    │       ├── ProductPage.jsx      ← Détail d'un livre
    │       ├── Cart.jsx             ← Panier dynamique
    │       ├── Categories.jsx       ← Grille de catégories
    │       ├── Login.jsx            ← Connexion
    │       ├── Register.jsx         ← Inscription
    │       └── admin/
    │           ├── AdminLayout.jsx  ← Sidebar admin
    │           ├── AdminDashboard.jsx ← Statistiques
    │           ├── AdminOuvrages.jsx  ← CRUD ouvrages
    │           └── AdminCommandes.jsx ← Gestion commandes
    └── styles/
        ├── index.css               ← Styles globaux + composants
        ├── theme.css               ← Variables CSS, couleurs, typographie
        └── cart.css                ← Styles panier
```

---

## ⚙️ Installation

### Prérequis
- Node.js ≥ 18
- npm ≥ 9
- Le backend Node.js/Express doit tourner sur `http://localhost:3000`

### Étapes

```bash
# 1. Cloner / se placer dans le dossier frontend
cd frontend

# 2. Installer les dépendances
npm install

# 3. Créer le fichier d'environnement
cp .env.example .env
# Vérifier que VITE_API_URL pointe bien vers votre API
```

---

## 🚀 Lancement

### Développement
```bash
npm run dev
```
L'application est accessible sur **http://localhost:5173**

### Production
```bash
npm run build
npm run preview
```

---

## 🔗 Variables d'environnement

| Variable | Valeur par défaut | Description |
|----------|-------------------|-------------|
| `VITE_API_URL` | `http://localhost:3000/api` | URL de base de l'API |

---

## 📡 Routes de l'application

| Route | Page | Protection |
|-------|------|-----------|
| `/` | Page d'accueil | Public |
| `/products` | Catalogue (recherche + filtres) | Public |
| `/products/:id` | Détail d'un livre | Public |
| `/cart` | Panier | Public |
| `/categories` | Catégories | Public |
| `/login` | Connexion | Public |
| `/register` | Inscription | Public |
| `/admin` | Dashboard admin | Admin / Gestionnaire |
| `/admin/ouvrages` | CRUD ouvrages | Admin / Gestionnaire |
| `/admin/commandes` | Gestion commandes | Admin / Gestionnaire |

---

## 🎨 Design System

| Élément | Valeur |
|---------|--------|
| Couleur principale | `#2C5F2E` (vert) |
| Fond | `#F5F0E8` (crème) |
| Texte | `#2D2D2D` |
| Navy | `#1A2332` |
| Police titres | Playfair Display (serif) |
| Police texte | Lato (sans-serif) |

---

## ✅ Fonctionnalités implémentées

- [x] Page d'accueil avec hero, badges confiance, livres populaires
- [x] Catalogue avec recherche textuelle (titre / auteur / ISBN) et filtre par catégorie
- [x] Page détail livre avec sélecteur de quantité
- [x] **Panier dynamique** — ajout, modification de quantité, suppression, vider, total, livraison gratuite dès 50 €
- [x] **Persistance panier** via localStorage
- [x] Page catégories avec grille visuelle
- [x] **Authentification** — connexion, inscription, déconnexion
- [x] **Routage protégé** pour l'administration (rôles : administrateur, gestionnaire, editeur)
- [x] **Dashboard admin** avec statistiques
- [x] **CRUD ouvrages** complet (création, édition, suppression avec confirmation) via modal
- [x] **Gestion commandes** avec changement de statut (en_cours → payee → expédiée → annulée)
- [x] Gestion des erreurs (API indisponible, produit épuisé, stock 0)
- [x] Responsive mobile / tablette / desktop (Bootstrap grid)
- [x] Intercepteur Axios avec token JWT automatique + redirection 401

---

## 🎬 Instructions pour la vidéo de démonstration

**Durée recommandée : 5-8 minutes**

### Séquence suggérée :

1. **Page d'accueil** (30 s)
   - Montrer le hero, les badges de confiance
   - Faire défiler jusqu'aux livres populaires
   - Cliquer sur "Voir tous les livres"

2. **Catalogue & Recherche** (60 s)
   - Taper un titre dans la barre de recherche → filtrage en temps réel
   - Changer de catégorie dans le menu déroulant
   - Réinitialiser les filtres

3. **Page produit & Panier** (90 s)
   - Cliquer sur un livre → page détail
   - Changer la quantité → Ajouter au panier (badge se met à jour)
   - Aller dans le panier → modifier quantité, supprimer un article, voir le total

4. **Inscription / Connexion** (60 s)
   - Créer un nouveau compte (tous les champs visibles)
   - Se connecter avec un compte existant

5. **Administration** (120 s)
   - Se connecter avec un compte admin
   - Dashboard → voir les statistiques
   - Ouvrages → créer un ouvrage (remplir le modal)
   - Ouvrages → modifier, puis supprimer (confirmation)
   - Commandes → changer le statut d'une commande

6. **Responsive** (30 s)
   - Montrer le site en vue mobile (outils développeur du navigateur)

---

## 📦 Dépendances principales

| Package | Version | Usage |
|---------|---------|-------|
| react | ^18.3.1 | Framework UI |
| react-dom | ^18.3.1 | Rendu DOM |
| react-router-dom | ^6.24.1 | Routing SPA |
| react-bootstrap | ^2.10.2 | Composants UI |
| bootstrap | ^5.3.3 | CSS Bootstrap |
| axios | ^1.7.2 | Appels API HTTP |
| react-icons | ^5.2.1 | Icônes |
| vite | ^5.3.1 | Build tool |

---

## 👨‍💻 Auteur

Projet développé dans le cadre du cours **420-WA6-AG — Étape 3**  
Site : livresgourmands.net
