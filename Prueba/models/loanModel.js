// models/loanModel.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear un préstamo
const createLoan = async (data) => {
  try {
    const loan = await prisma.loan.create({
      data: data,
    });
    return loan;
  } catch (error) {
    throw new Error('Error al crear el préstamo');
  }
};

// Obtener todos los préstamos
const getAllLoans = async () => {
  try {
    const loans = await prisma.loan.findMany({
      include: {
        request: true,  // Incluir la solicitud relacionada
        user: true,     // Incluir el usuario relacionado
        component: true // Incluir el componente relacionado
      },
    });
    return loans;
  } catch (error) {
    throw new Error('Error al obtener los préstamos');
  }
};

// Obtener un préstamo por ID
const getLoanById = async (id) => {
  try {
    const loan = await prisma.loan.findUnique({
      where: { loanId: Number(id) },
      include: {
        request: true,
        user: true,
        component: true
      },
    });
    return loan;
  } catch (error) {
    throw new Error('Error al obtener el préstamo');
  }
};

// Actualizar un préstamo por ID
const updateLoan = async (id, data) => {
  try {
    const updatedLoan = await prisma.loan.update({
      where: { loanId: Number(id) },
      data: data,
    });
    return updatedLoan;
  } catch (error) {
    throw new Error('Error al actualizar el préstamo');
  }
};

// Eliminar un préstamo por ID
const deleteLoan = async (id) => {
  try {
    const deletedLoan = await prisma.loan.delete({
      where: { loanId: Number(id) },
    });
    return deletedLoan;
  } catch (error) {
    throw new Error('Error al eliminar el préstamo');
  }
};

module.exports = {
  createLoan,
  getAllLoans,
  getLoanById,
  updateLoan,
  deleteLoan,
};
