const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', auth, userController.me);
router.get('/', userController.getAll);
router.put('/:id', userController.update);

module.exports = router;
