// controllers/loanController.js
const loanModel = require('../models/loanModel');

// Crear un préstamo
const createLoan = async (req, res) => {
  try {
    const data = req.body;
    const loan = await loanModel.createLoan(data);
    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los préstamos
const getAllLoans = async (req, res) => {
  try {
    const loans = await loanModel.getAllLoans();
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un préstamo por ID
const getLoanById = async (req, res) => {
  const { id } = req.params;
  try {
    const loan = await loanModel.getLoanById(id);
    if (!loan) {
      return res.status(404).json({ error: 'Préstamo no encontrado' });
    }
    res.status(200).json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un préstamo por ID
const updateLoan = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updatedLoan = await loanModel.updateLoan(id, data);
    res.status(200).json(updatedLoan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un préstamo por ID
const deleteLoan = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedLoan = await loanModel.deleteLoan(id);
    res.status(200).json(deletedLoan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createLoan,
  getAllLoans,
  getLoanById,
  updateLoan,
  deleteLoan,
};
