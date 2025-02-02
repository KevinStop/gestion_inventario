const express = require('express');
const router = express.Router();
const componentController = require('../controllers/componentController');
const upload = require('../config/uploadConfig');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Ruta pública (no necesita autenticación ni autorización)
router.get('/filter', componentController.filterComponentsByCategories);
router.get('/:id', componentController.getComponentById);
router.get('/', componentController.getAllComponents);

// Rutas protegidas para admin (requieren autenticación y autorización)
router.post('/', authenticateToken, authorizeRoles(['admin']), upload.single('image'), componentController.createComponentWithMovement);
router.put('/:id', authenticateToken, authorizeRoles(['admin']), upload.single('image'), componentController.updateComponent);
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), componentController.deleteComponent);

module.exports = router;