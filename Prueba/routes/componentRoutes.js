const express = require('express');
const router = express.Router();
const componentController = require('../controllers/componentController');
const upload = require('../config/uploadConfig');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Ruta pública (no necesita autenticación ni autorización)
router.get('/filter', componentController.filterComponentsByCategories);
router.get('/count', componentController.getComponentCount);
router.get('/:id', componentController.getComponentById);
router.get('/', componentController.getAllComponents);

// Rutas protegidas para admin (requieren autenticación y autorización)
router.post('/', authenticateToken, authorizeRole('admin'), upload.single('image'), componentController.createComponent);
router.put('/:id', authenticateToken, authorizeRole('admin'), upload.single('image'), componentController.updateComponent);
router.delete('/:id', authenticateToken, authorizeRole('admin'), componentController.deleteComponent);

module.exports = router;