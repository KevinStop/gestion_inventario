const requestModel = require('../models/requestModel');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createRequest = async (req, res) => {
  const { userId, requestDetails, description } = req.body;

  console.log('Datos recibidos en el controlador:', req.body);

  if (!userId) {
    return res.status(400).json({ error: 'Usuario no autenticado' });
  }

  if (!Array.isArray(requestDetails) || requestDetails.length === 0) {
    return res.status(400).json({ error: 'Detalles de la solicitud no válidos o vacíos.' });
  }

  try {
    const data = {
      userId,
      description: description || null, // Descripción opcional
    };

    const newRequest = await requestModel.createRequest(data, requestDetails);

    return res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error al crear la solicitud:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener todas las solicitudes
const getAllRequests = async (req, res) => {
  try {
    const requests = await requestModel.getAllRequests();
    return res.status(200).json(requests);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Obtener una solicitud por ID
const getRequestById = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await requestModel.getRequestById(id);
    if (!request) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    return res.status(200).json(request);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Actualizar una solicitud (aceptar/rechazar)
const updateRequest = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedRequest = await requestModel.updateRequest(id, data);
    return res.status(200).json(updatedRequest);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Eliminar una solicitud
const deleteRequest = async (req, res) => {
  const { id } = req.params; // Obtenemos el ID de la solicitud desde los parámetros de la URL

  try {
    // Eliminamos los detalles de la solicitud asociados
    await prisma.requestDetail.deleteMany({
      where: {
        requestId: parseInt(id),
      },
    });

    // Eliminamos los préstamos asociados
    await prisma.loan.deleteMany({
      where: {
        requestId: parseInt(id),
      },
    });

    // Intentamos eliminar la solicitud
    const deletedRequest = await prisma.request.delete({
      where: {
        requestId: parseInt(id), // Aquí usamos requestId, no request_id
      },
    });

    if (deletedRequest) {
      res.status(200).json(deletedRequest);
    } else {
      res.status(404).json({ error: "Solicitud no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la solicitud" });
  }
};

// Finalizar una solicitud y reponer los componentes
const finalizeRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const finalizedRequest = await requestModel.finalizeRequest(id);
    return res.status(200).json(finalizedRequest);
  } catch (error) {
    return res.status(500).json({ error: error.message });
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