const express = require('express');
const panierController = require('../controllers/panierController');

const router = express.Router();

router.get('/', panierController.getCart);
router.post('/items', panierController.addItem);
router.put('/items/:id', panierController.updateItem);
router.delete('/items/:id', panierController.deleteItem);

module.exports = router;
