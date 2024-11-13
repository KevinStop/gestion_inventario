const express = require('express');
const router = express.Router();
const componentController = require('../controllers/componentController');
const upload = require('../config/uploadConfig');

router.get('/filter', componentController.filterComponentsByCategories);
router.post('/', upload.single('image'), componentController.createComponent);
router.get('/', componentController.getAllComponents);
router.get('/:id', componentController.getComponentById);
router.put('/:id', upload.single('image'), componentController.updateComponent);
router.delete('/:id', componentController.deleteComponent);

module.exports = router;
