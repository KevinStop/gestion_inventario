const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

// Middleware para validar datos de solicitud
const validateRequestData = (req, res, next) => {
  const { userId, requestDetails } = req.body;

  if (!userId || !Array.isArray(requestDetails) || requestDetails.length === 0) {
    return res.status(400).json({ error: 'Datos de la solicitud inválidos.' });
  }
  
  next();
};

router.post('/', validateRequestData, requestController.createRequest);
router.get('/', requestController.getAllRequests);
router.get('/:id', requestController.getRequestById);
router.put('/:id', requestController.updateRequest);
router.delete('/:id', requestController.deleteRequest);
router.put('/:id/finalize', requestController.finalizeRequest);

module.exports = router;
