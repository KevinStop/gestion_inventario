const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear una solicitud
const createRequest = async (data, requestDetails) => {
  if (!data.userId) {
    throw new Error('El campo userId es obligatorio para crear una solicitud.');
  }

  console.log('Datos para crear solicitud:', data, requestDetails);

  try {
    const request = await prisma.request.create({
      data: {
        user: {
          connect: { userId: data.userId }, // Conecta al usuario por userId
        },
        status: data.status || 'pendiente', // Estado por defecto
        description: data.description, // Descripción de la solicitud
        fileUrl: data.fileUrl, // Aquí agregas el fileUrl (si existe)
        requestDetails: {
          create: requestDetails.map(detail => ({
            component: {
              connect: { id: detail.componentId }, // Conecta el componente por ID
            },
            quantity: detail.quantity, // Cantidad del componente
          })),
        },
      },
    });

    return request;
  } catch (error) {
    console.error('Error en createRequest:', error);
    throw new Error('Error al crear la solicitud: ' + error.message);
  }
};

// Obtener todas las solicitudes
const getAllRequests = async () => {
  try {
    const requests = await prisma.request.findMany({
      include: {
        user: true, // Incluye los datos del usuario
        requestDetails: true, // Incluye los detalles de los componentes solicitados
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
        user: true, // Incluye los datos del usuario
        requestDetails: true, // Incluye los detalles de los componentes solicitados
      },
    });
    return request;
  } catch (error) {
    throw new Error('Error al obtener la solicitud');
  }
};

// Actualizar una solicitud por ID (aceptar/rechazar solicitud)
const updateRequest = async (id, data) => {
  try {
    // Obtener la solicitud antes de actualizarla para ver los detalles
    const request = await prisma.request.findUnique({
      where: { requestId: Number(id) },
      include: {
        requestDetails: true, // Incluye los detalles de los componentes solicitados
      },
    });

    // Si la solicitud es rechazada, eliminamos la solicitud
    if (data.status === 'rechazada') {
      await prisma.request.delete({
        where: { requestId: Number(id) },
      });
      return { message: "Solicitud rechazada y eliminada" };
    }

    // Si la solicitud es aceptada, actualizamos las cantidades de los componentes
    if (data.status === 'aceptada' && request.status !== 'aceptada') {
      for (const detail of request.requestDetails) {
        await prisma.component.update({
          where: { id: detail.componentId },
          data: {
            quantity: {
              decrement: detail.quantity, // Reducir la cantidad de los componentes
            },
          },
        });
      }
    }

    // Actualizar el estado de la solicitud
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

// Finalizar una solicitud y reponer los componentes
const finalizeRequest = async (id) => {
  try {
    // Obtener la solicitud para ver los detalles de los componentes
    const request = await prisma.request.findUnique({
      where: { requestId: Number(id) },
      include: {
        requestDetails: true,
      },
    });

    // Reponer los componentes cuando la solicitud es finalizada
    for (const detail of request.requestDetails) {
      await prisma.component.update({
        where: { id: detail.componentId },
        data: {
          quantity: {
            increment: detail.quantity, // Reponer la cantidad de los componentes
          },
        },
      });
    }

    // Actualizar el estado de la solicitud a finalizada
    const updatedRequest = await prisma.request.update({
      where: { requestId: Number(id) },
      data: { status: 'finalizada' },
    });

    return updatedRequest;
  } catch (error) {
    throw new Error('Error al finalizar la solicitud');
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  finalizeRequest,
};