const express = require('express');
const commentaireController = require('../controllers/commentaireController');

const router = express.Router();

router.post('/:id/commentaires', commentaireController.create);
router.put('/:id/valider', commentaireController.validateComment);

module.exports = router;
