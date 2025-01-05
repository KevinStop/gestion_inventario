const requestModel = require('../models/requestModel');
const fs = require('fs');
const path = require('path');

// Crear una solicitud
const createRequest = async (req, res) => {
  let { userId, requestDetails, description, typeRequest, returnDate } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Usuario no autenticado' });
  }

  userId = parseInt(userId);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'userId debe ser un número válido' });
  }

  if (!Array.isArray(requestDetails) || requestDetails.length === 0) {
    return res.status(400).json({ error: 'Detalles de la solicitud no válidos o vacíos.' });
  }

  if (!typeRequest) {
    return res.status(400).json({ error: 'El campo typeRequest es obligatorio.' });
  }

  try {
    const data = {
      userId,
      description: description || null,
      typeRequest, 
      returnDate: returnDate ? new Date(returnDate) : null,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
    };

    const newRequest = await requestModel.createRequest(data, requestDetails);

    return res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error al crear la solicitud:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener todas las solicitudes activas
const getFilteredRequests = async (req, res) => {
  try {
    // Leer filtros desde la consulta
    const { userId, status, isActive } = req.query;

    // Convertir a tipos adecuados (userId e isActive)
    const filters = {
      userId: userId ? parseInt(userId) : undefined,
      status: status || undefined,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    };

    // Llamar al modelo con los filtros
    const requests = await requestModel.getFilteredRequests(filters);

    return res.status(200).json(requests);
  } catch (error) {
    console.error('Error en getFilteredRequests:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor.' });
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

// Actualizar una solicitud (aceptar)
const acceptRequest = async (req, res) => {
  const { id } = req.params; // ID de la solicitud a aceptar

  if (!id) {
    return res.status(400).json({ error: 'ID de la solicitud no proporcionado.' });
  }

  const requestId = parseInt(id);

  if (isNaN(requestId)) {
    return res.status(400).json({ error: 'El ID de la solicitud debe ser un número válido.' });
  }

  try {
    const updatedRequest = await requestModel.acceptRequest(requestId);

    return res.status(200).json({
      message: 'Solicitud aceptada con éxito.',
      updatedRequest,
    });
  } catch (error) {
    console.error('Error al aceptar la solicitud:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Eliminar una solicitud
const deleteRequest = async (req, res) => {
  const { id } = req.params; // ID de la solicitud

  const requestId = parseInt(id);
  const userId = req.user?.userId; // ID del usuario autenticado
  const role = req.user?.role; // Rol del usuario autenticado

  if (isNaN(requestId)) {
    return res.status(400).json({ error: 'El ID de la solicitud debe ser un número válido.' });
  }

  try {
    const deletedRequest = await requestModel.deleteRequest(requestId, userId, role);

    return res.status(200).json({
      message: 'Solicitud eliminada con éxito.',
      deletedRequest,
    });
  } catch (error) {
    console.error('Error en deleteRequest:', error.message);
    return res.status(403).json({ error: error.message });
  }
};

// Finalizar una solicitud y reponer los componentes
const finalizeRequest = async (req, res) => {
  const { id } = req.params; // ID de la solicitud a finalizar

  if (!id) {
    return res.status(400).json({ error: 'ID de la solicitud no proporcionado.' });
  }

  const requestId = parseInt(id);

  if (isNaN(requestId)) {
    return res.status(400).json({ error: 'El ID de la solicitud debe ser un número válido.' });
  }

  try {
    const result = await requestModel.finalizeRequest(requestId);

    return res.status(200).json({
      message: 'Solicitud finalizada con éxito.',
      updatedRequest: result.updatedRequest,
      requestPeriod: result.requestPeriod,
    });
  } catch (error) {
    console.error('Error al finalizar la solicitud:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const updateReturnDate = async (req, res) => {
  const { id } = req.params; // ID de la solicitud
  const { newReturnDate } = req.body; // Nueva fecha proporcionada por el usuario

  if (!newReturnDate) {
    return res.status(400).json({ error: 'La nueva fecha de retorno es obligatoria.' });
  }

  const requestId = parseInt(id);
  const userId = req.user?.userId; // ID del usuario autenticado
  const role = req.user?.role; // Rol del usuario autenticado

  if (isNaN(requestId)) {
    return res.status(400).json({ error: 'El ID de la solicitud debe ser un número válido.' });
  }

  try {
    const updatedRequest = await requestModel.updateReturnDate(requestId, userId, role, newReturnDate);

    return res.status(200).json({
      message: 'Fecha de retorno actualizada con éxito.',
      updatedRequest,
    });
  } catch (error) {
    console.error('Error en updateReturnDate:', error.message);
    return res.status(403).json({ error: error.message });
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
};