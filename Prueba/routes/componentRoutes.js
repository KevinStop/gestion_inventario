const express = require('express');
const router = express.Router();
const componentController = require('../controllers/componentController');
const upload = require('../config/uploadConfig');

router.get('/filter', componentController.filterComponentsByCategories);
router.get('/count', componentController.getComponentCount);
router.get('/:id', componentController.getComponentById);
router.get('/', componentController.getAllComponents);
router.post('/', upload.single('image'), componentController.createComponent);
router.put('/:id', upload.single('image'), componentController.updateComponent);
router.delete('/:id', componentController.deleteComponent);

module.exports = router;
