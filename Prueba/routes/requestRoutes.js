const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const upload = require('../config/uploadConfig');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Middleware para validar datos de solicitud
const validateRequestData = (req, res, next) => {
  let { userId, requestDetails, typeRequest } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Usuario no autenticado.' });
  }

  // Validar tipo de solicitud
  if (!typeRequest) {
    return res.status(400).json({ error: 'El tipo de solicitud es obligatorio.' });
  }

  // Intentar parsear requestDetails si es string
  if (typeof requestDetails === 'string') {
    try {
      requestDetails = JSON.parse(requestDetails);
      req.body.requestDetails = requestDetails;
    } catch (error) {
      return res.status(400).json({ error: 'Error al procesar los detalles de la solicitud.' });
    }
  }

  // Validar estructura de requestDetails
  if (!Array.isArray(requestDetails) || requestDetails.length === 0) {
    return res.status(400).json({ error: 'Debe incluir al menos un componente en la solicitud.' });
  }

  // Validar que cada detalle tenga la estructura correcta
  const isValidDetail = requestDetails.every(detail => 
    detail.componentId && 
    typeof detail.quantity === 'number' && 
    detail.quantity > 0
  );

  if (!isValidDetail) {
    return res.status(400).json({ 
      error: 'Los detalles de la solicitud deben incluir componentId y quantity válidos.' 
    });
  }

  next();
};

// Rutas de solicitudes
router.post('/', authenticateToken,upload.single('file'), validateRequestData, requestController.createRequest);
router.get('/', authenticateToken, requestController.getFilteredRequests);
router.get('/:id', authenticateToken, requestController.getRequestById);

// Rutas específicas para admin
router.put('/:id', authenticateToken,authorizeRoles(['admin']),requestController.acceptRequest);
router.put('/:id/finalize', authenticateToken,authorizeRoles(['admin']),requestController.finalizeRequest);
router.put('/:id/not-returned', authenticateToken,authorizeRoles(['admin']), requestController.markAsNotReturned);
router.get('/not-returned', authenticateToken,authorizeRoles(['admin']), requestController.getNotReturnedLoans);
router.post('/:id/reject', authenticateToken, authorizeRoles(['admin']), requestController.rejectRequest);

// Rutas que pueden usar tanto admin como usuarios
router.delete('/:id', authenticateToken,requestController.deleteRequest);
router.put('/:id/return-date', authenticateToken,requestController.updateReturnDate);

module.exports = router;