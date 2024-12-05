const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear un detalle de solicitud
const createRequestDetail = async (data) => {
  try {
    const requestDetail = await prisma.requestDetail.create({
      data: data,
    });
    return requestDetail;
  } catch (error) {
    throw new Error('Error al crear el detalle de la solicitud');
  }
};

// Obtener todos los detalles de solicitud
const getAllRequestDetails = async () => {
  try {
    const requestDetails = await prisma.requestDetail.findMany({
      include: {
        request: true, // Incluir la solicitud relacionada
        component: true, // Incluir el componente relacionado
      },
    });
    return requestDetails;
  } catch (error) {
    throw new Error('Error al obtener los detalles de la solicitud');
  }
};

// Obtener un detalle de solicitud por ID
const getRequestDetailById = async (id) => {
  try {
    const requestDetail = await prisma.requestDetail.findUnique({
      where: { requestDetailId: Number(id) },
      include: {
        request: true, // Incluir la solicitud relacionada
        component: true, // Incluir el componente relacionado
      },
    });
    return requestDetail;
  } catch (error) {
    throw new Error('Error al obtener el detalle de la solicitud');
  }
};

// Actualizar un detalle de solicitud por ID
const updateRequestDetail = async (id, data) => {
  try {
    const updatedRequestDetail = await prisma.requestDetail.update({
      where: { requestDetailId: Number(id) },
      data: data,
    });
    return updatedRequestDetail;
  } catch (error) {
    throw new Error('Error al actualizar el detalle de la solicitud');
  }
};

// Eliminar un detalle de solicitud por ID (cuando se rechaza o se cancela una solicitud)
const deleteRequestDetail = async (id) => {
  try {
    const deletedRequestDetail = await prisma.requestDetail.delete({
      where: { requestDetailId: Number(id) },
    });
    return deletedRequestDetail;
  } catch (error) {
    throw new Error('Error al eliminar el detalle de la solicitud');
  }
};

module.exports = {
  createRequestDetail,
  getAllRequestDetails,
  getRequestDetailById,
  updateRequestDetail,
  deleteRequestDetail,
};
