const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Rutas públicas
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Rutas protegidas
router.get('/', authenticateToken, authorizeRole('admin'), userController.getAllUsers);
router.get('/:id', authenticateToken, userController.getUserById);
router.put('/:id', authenticateToken, userController.updateUser);
router.put('/:id/deactivate', authenticateToken, userController.deactivateUser);

// Ruta para extender la sesión (renovar el token)
router.post('/extend-session', authenticateToken, userController.extendSession);

module.exports = router;
