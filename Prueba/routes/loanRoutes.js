// routes/loanRoutes.js
const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

// Crear un préstamo
router.post('/', loanController.createLoan);

// Obtener todos los préstamos
router.get('/', loanController.getAllLoans);

// Obtener un préstamo por ID
router.get('/:id', loanController.getLoanById);

// Actualizar un préstamo por ID
router.put('/:id', loanController.updateLoan);

// Eliminar un préstamo por ID
router.delete('/:id', loanController.deleteLoan);

module.exports = router;
