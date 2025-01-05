const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const upload = require('../config/uploadConfig');

// Middleware para validar datos de solicitud
const validateRequestData = (req, res, next) => {
  let { userId, requestDetails } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Usuario no autenticado.' });
  }

  // Intentar parsear `requestDetails` si es una cadena JSON
  if (typeof requestDetails === 'string') {
    try {
      requestDetails = JSON.parse(requestDetails);
      req.body.requestDetails = requestDetails; // Actualizamos el valor en `req.body`
    } catch (error) {
      return res.status(400).json({ error: 'Error al procesar los detalles de la solicitud.' });
    }
  }

  // Validar que `requestDetails` sea un array
  if (!Array.isArray(requestDetails)) {
    return res.status(400).json({ error: 'Los detalles de la solicitud deben ser un array.' });
  }

  if (requestDetails.length === 0) {
    return res.status(400).json({ error: 'Debe incluir al menos un componente en la solicitud.' });
  }

  next();
};

router.post('/', upload.single('file'), validateRequestData, requestController.createRequest);
router.get('/', requestController.getFilteredRequests);
router.get('/:id', requestController.getRequestById);
router.put('/:id', requestController.acceptRequest);
router.delete('/:id', requestController.deleteRequest);
router.put('/:id/finalize', requestController.finalizeRequest);
router.put('/:id/return-date', requestController.updateReturnDate);

module.exports = router;