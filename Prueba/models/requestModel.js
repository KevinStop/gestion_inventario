const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear una solicitud 
const createRequest = async (data, requestDetails) => {
  if (!data.userId) {
    throw new Error('El campo userId es obligatorio para crear una solicitud.');
  }

  try {
    const request = await prisma.$transaction(async (prisma) => {
      return await prisma.request.create({
        data: {
          user: { connect: { userId: data.userId } },
          typeRequest: data.typeRequest,
          status: data.status || 'pendiente',
          description: data.description || null,
          fileUrl: data.fileUrl || null,
          returnDate: data.returnDate,
          requestDetails: {
            create: requestDetails.map((detail) => ({
              component: { connect: { id: detail.componentId } },
              quantity: detail.quantity,
            })),
          },
        },
      });
    });

    return request;
  } catch (error) {
    console.error('Error en createRequest:', error.message);
    throw new Error('Error al crear la solicitud: ' + error.message);
  }
};

// Obtener todas las solicitudes activas
const getFilteredRequests = async (filters = {}) => {
  try {
    const { userId, status, isActive } = filters;

    const requests = await prisma.request.findMany({
      where: {
        ...(userId && { userId }), // Filtrar por usuario, si se proporciona
        ...(status && { status }), // Filtrar por estado, si se proporciona
        ...(isActive !== undefined && { isActive }), // Filtrar por actividad, si se proporciona
      },
      include: {
        user: true, // Incluye los datos del usuario
        requestDetails: {
          include: {
            component: true, // Incluye los detalles de los componentes solicitados
          },
        },
      },
    });

    return requests;
  } catch (error) {
    console.error('Error en getFilteredRequests:', error.message);
    throw new Error('Error al obtener las solicitudes con filtros.');
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

// Actualizar una solicitud por ID (aceptar solicitud)
const acceptRequest = async (requestId) => {
  try {
    return await prisma.$transaction(async (prisma) => {
      // Verificar si la solicitud existe y está en estado pendiente
      const existingRequest = await prisma.request.findUnique({
        where: { requestId },
      });

      if (!existingRequest) {
        throw new Error(`No se encontró la solicitud con el ID ${requestId}.`);
      }

      if (existingRequest.status !== 'pendiente') {
        throw new Error('Solo las solicitudes en estado pendiente pueden ser aceptadas.');
      }

      // Verificar el periodo académico activo
      const activePeriod = await prisma.academicPeriod.findFirst({
        where: { isActive: true },
      });

      if (!activePeriod) {
        throw new Error('No hay un periodo académico activo. No se puede aceptar la solicitud.');
      }

      // Actualizar el estado de la solicitud a "prestamo"
      const updatedRequest = await prisma.request.update({
        where: { requestId },
        data: {
          status: 'prestamo',
        },
      });

      // Crear el registro en requestPeriod
      await prisma.requestPeriod.create({
        data: {
          request: { connect: { requestId } },
          academicPeriod: { connect: { id: activePeriod.id } },
          typeDate: 'inicio',
          requestPeriodDate: new Date(),
        },
      });

      return updatedRequest;
    });
  } catch (error) {
    console.error('Error en acceptRequest:', error.message);
    throw new Error('Error al aceptar la solicitud: ' + error.message);
  }
};

// Eliminar una solicitud por ID
const deleteRequest = async (requestId, userId, role) => {
  try {
    // Verificar permisos y obtener la solicitud
    const request = await checkRequestPermissions(requestId, userId, role);

    if (role === 'user' && request.status !== 'pendiente') {
      throw new Error('Solo puedes eliminar solicitudes en estado "pendiente".');
    }

    // Eliminar la solicitud
    const deletedRequest = await prisma.request.delete({
      where: { requestId },
    });

    return deletedRequest;
  } catch (error) {
    console.error('Error en deleteRequest:', error.message);
    throw new Error('Error al eliminar la solicitud: ' + error.message);
  }
};

// Finalizar una solicitud y reponer los componentes
const finalizeRequest = async (requestId) => {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Verificar si la solicitud existe y está activa
      const existingRequest = await prisma.request.findUnique({
        where: { requestId },
      });

      if (!existingRequest) {
        throw new Error(`No se encontró la solicitud con el ID ${requestId}.`);
      }

      if (existingRequest.status === 'finalizado') {
        throw new Error('La solicitud ya está finalizada.');
      }

      // Obtener el periodo académico activo
      const activePeriod = await prisma.academicPeriod.findFirst({
        where: { isActive: true },
      });

      if (!activePeriod) {
        throw new Error('No hay un periodo académico activo. No se puede finalizar la solicitud.');
      }

      // Actualizar la solicitud a finalizado
      const updatedRequest = await prisma.request.update({
        where: { requestId },
        data: {
          status: 'finalizado',
          isActive: false,
        },
      });

      // Crear un nuevo registro en requestPeriod con el tipo "fin"
      const requestPeriod = await prisma.requestPeriod.create({
        data: {
          request: { connect: { requestId: updatedRequest.requestId } },
          academicPeriod: { connect: { id: activePeriod.id } },
          typeDate: 'fin',
          requestPeriodDate: new Date(),
        },
      });

      return { updatedRequest, requestPeriod };
    });

    return result;
  } catch (error) {
    console.error('Error en finalizeRequest:', error.message);
    throw new Error('Error al finalizar la solicitud: ' + error.message);
  }
};

const updateReturnDate = async (requestId, userId, role, newReturnDate) => {
  try {
    // Verificar permisos y obtener la solicitud
    const request = await checkRequestPermissions(requestId, userId, role);

    if (request.status !== 'prestamo') {
      throw new Error('Solo se puede actualizar la fecha de retorno para solicitudes en estado "prestamo".');
    }

    // Actualizar la fecha de retorno
    const updatedRequest = await prisma.request.update({
      where: { requestId },
      data: {
        returnDate: new Date(newReturnDate),
      },
    });

    return updatedRequest;
  } catch (error) {
    console.error('Error en updateReturnDate:', error.message);
    throw new Error('Error al actualizar la fecha de retorno: ' + error.message);
  }
};

const checkRequestPermissions = async (requestId, userId, role) => {
  try {
    const request = await prisma.request.findUnique({
      where: { requestId },
    });

    if (!request) {
      throw new Error(`No se encontró la solicitud con el ID ${requestId}.`);
    }

    // Validar permisos
    if (role === 'user' && request.userId !== userId) {
      throw new Error('No tienes permiso para modificar esta solicitud.');
    }

    if (role === 'admin' && !request.isActive) {
      throw new Error('Solo se pueden modificar solicitudes activas.');
    }

    return request; // Devuelve la solicitud si pasa las validaciones
  } catch (error) {
    console.error('Error en checkRequestPermissions:', error.message);
    throw new Error('Permiso denegado: ' + error.message);
  }
};

module.exports = {
  createRequest,
  getFilteredRequests,
  getRequestById,
  acceptRequest,
  deleteRequest,
  finalizeRequest,
  updateReturnDate,
  checkRequestPermissions,
};