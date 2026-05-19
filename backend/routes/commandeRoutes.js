const express = require('express');
const commandeController = require('../controllers/commandeController');

const router = express.Router();

router.post('/', commandeController.create);
router.get('/', commandeController.getOrders);
router.get('/:id', commandeController.getById);
router.put('/:id/status', commandeController.updateStatus);

module.exports = router;
