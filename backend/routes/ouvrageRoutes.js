const express = require('express');
const multer = require('multer');
const ouvrageController = require('../controllers/ouvrageController');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });
const router = express.Router();

router.get('/', ouvrageController.getAll);
router.get('/:id', ouvrageController.getById);
router.post('/', upload.single('image'), ouvrageController.create);
router.put('/:id', upload.single('image'), ouvrageController.update);
router.delete('/:id', ouvrageController.delete);

module.exports = router;
