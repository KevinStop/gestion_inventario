// routes/requestDetailRoutes.js
const express = require('express');
const router = express.Router();
const requestDetailController = require('../controllers/requestDetailController');

// Crear un detalle de solicitud
router.post('/', requestDetailController.createRequestDetail);

// Obtener todos los detalles de solicitud
router.get('/', requestDetailController.getAllRequestDetails);

// Obtener un detalle de solicitud por ID
router.get('/:id', requestDetailController.getRequestDetailById);

// Actualizar un detalle de solicitud por ID
router.put('/:id', requestDetailController.updateRequestDetail);

// Eliminar un detalle de solicitud por ID
router.delete('/:id', requestDetailController.deleteRequestDetail);

module.exports = router;
