const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear un nuevo periodo académico
const createAcademicPeriod = async (data) => {
  try {
    const academicPeriodData = {
      name: data.name,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    };

    const academicPeriod = await prisma.academicPeriod.create({
      data: academicPeriodData,
    });

    return academicPeriod;
  } catch (error) {
    console.error('Error al crear el periodo académico:', error.message);
    throw new Error('Error al crear el periodo académico');
  }
};

// Obtener todos los periodos académicos
const getAllAcademicPeriods = async () => {
  try {
    const academicPeriods = await prisma.academicPeriod.findMany({
      orderBy: { startDate: 'asc' },
    });
    return academicPeriods;
  } catch (error) {
    console.error('Error al obtener los periodos académicos:', error.message);
    throw new Error('Error al obtener los periodos académicos');
  }
};

// Obtener un periodo académico por ID
const getAcademicPeriodById = async (id) => {
  try {
    const academicPeriod = await prisma.academicPeriod.findUnique({
      where: { id: parseInt(id) },
    });

    if (!academicPeriod) {
      throw new Error('Periodo académico no encontrado');
    }

    return academicPeriod;
  } catch (error) {
    console.error('Error al obtener el periodo académico:', error.message);
    throw new Error('Error al obtener el periodo académico');
  }
};

// Actualizar un periodo académico por ID
const updateAcademicPeriod = async (id, data) => {
  try {
    const updatedData = {
      name: data.name,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      isActive: data.isActive,
    };

    const updatedAcademicPeriod = await prisma.academicPeriod.update({
      where: { id: parseInt(id) },
      data: updatedData,
    });

    return updatedAcademicPeriod;
  } catch (error) {
    console.error('Error al actualizar el periodo académico:', error.message);
    throw new Error('Error al actualizar el periodo académico');
  }
};

// Eliminar un periodo académico por ID
const deleteAcademicPeriod = async (id) => {
  try {
    const deletedAcademicPeriod = await prisma.academicPeriod.delete({
      where: { id: parseInt(id) },
    });

    return deletedAcademicPeriod;
  } catch (error) {
    console.error('Error al eliminar el periodo académico:', error.message);
    throw new Error('Error al eliminar el periodo académico');
  }
};

async function deactivateAllAcademicPeriods() {
  return prisma.academicPeriod.updateMany({
    where: { isActive: true },
    data: { isActive: false },
  });
}

async function setActiveAcademicPeriod(id) {
  return prisma.academicPeriod.update({
    where: { id: parseInt(id, 10) },
    data: { isActive: true },
  });
}

module.exports = {
  createAcademicPeriod,
  getAllAcademicPeriods,
  getAcademicPeriodById,
  updateAcademicPeriod,
  deleteAcademicPeriod,
  deactivateAllAcademicPeriods,
  setActiveAcademicPeriod,
};
