const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Rutas públicas
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Rutas protegidas
router.get('/me', authenticateToken, userController.getAuthenticatedUser);
router.put('/:id', authenticateToken, userController.updateUser);
router.put('/:id/deactivate', authenticateToken, userController.deactivateUser);
router.post('/logout', authenticateToken, userController.logoutUser);

// Ruta para extender la sesión (renovar el token)
router.post('/extend-session', authenticateToken, userController.extendSession);
router.get('/session-time', authenticateToken, userController.getSessionTime);

module.exports = router;
