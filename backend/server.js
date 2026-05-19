require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/ouvrages', require('./routes/ouvrageRoutes'));
app.use('/api/panier', require('./routes/panierRoutes'));
app.use('/api/commandes', require('./routes/commandeRoutes'));
app.use('/api/listes', require('./routes/listeRoutes'));
app.use('/api/ouvrages', require('./routes/avisRoutes'));
app.use('/api/commentaires', require('./routes/commentaireRoutes'));

app.listen(process.env.PORT, () => {
  console.log(`Serveur lancé sur port ${process.env.PORT}`);
});