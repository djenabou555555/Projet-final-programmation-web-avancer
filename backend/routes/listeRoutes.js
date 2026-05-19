const express = require('express');
const listeController = require('../controllers/listeController');

const router = express.Router();

router.post('/', listeController.create);
router.post('/:id/items', listeController.addItem);
router.get('/:code', listeController.getByCode);
router.post('/:id/acheter', listeController.purchase);

module.exports = router;
