const express = require('express');
const router = express.Router();
const componentController = require('../Controllers/componentController');

// Rutas para el CRUD de componentes
router.get('/components', componentController.getAllComponents);
router.get('/components/:id', componentController.getComponentById);
router.post('/components', componentController.createComponent);
router.put('/components/:id', componentController.updateComponent);
router.delete('/components/:id', componentController.deleteComponent);
router.delete('/components/:id/permanent', componentController.deleteComponentPermanently);


module.exports = router;