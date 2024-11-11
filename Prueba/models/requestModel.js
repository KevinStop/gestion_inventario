const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear una solicitud
const createRequest = async (data) => {
  try {
    const request = await prisma.request.create({
      data: data,
    });
    return request;
  } catch (error) {
    throw new Error('Error al crear la solicitud');
  }
};

// Obtener todas las solicitudes
const getAllRequests = async () => {
  try {
    const requests = await prisma.request.findMany({
      include: {
        user: true, // Incluye los datos del usuario relacionado
      },
    });
    return requests;
  } catch (error) {
    throw new Error('Error al obtener las solicitudes');
  }
};

// Obtener una solicitud por ID
const getRequestById = async (id) => {
  try {
    const request = await prisma.request.findUnique({
      where: { requestId: Number(id) },
      include: {
        user: true, // Incluye los datos del usuario relacionado
      },
    });
    return request;
  } catch (error) {
    throw new Error('Error al obtener la solicitud');
  }
};

// Actualizar una solicitud por ID
const updateRequest = async (id, data) => {
  try {
    const updatedRequest = await prisma.request.update({
      where: { requestId: Number(id) },
      data: data,
    });
    return updatedRequest;
  } catch (error) {
    throw new Error('Error al actualizar la solicitud');
  }
};

// Eliminar una solicitud por ID
const deleteRequest = async (id) => {
  try {
    const deletedRequest = await prisma.request.delete({
      where: { requestId: Number(id) },
    });
    return deletedRequest;
  } catch (error) {
    throw new Error('Error al eliminar la solicitud');
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
};
