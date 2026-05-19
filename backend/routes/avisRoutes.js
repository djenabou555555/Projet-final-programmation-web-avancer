const express = require('express');
const avisController = require('../controllers/avisController');

const router = express.Router();

router.post('/:id/avis', avisController.create);

module.exports = router;
