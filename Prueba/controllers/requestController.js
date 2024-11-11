const requestModel = require('../models/requestModel');

// Crear una solicitud
const createRequest = async (req, res) => {
  try {
    const data = req.body;
    const request = await requestModel.createRequest(data);
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las solicitudes
const getAllRequests = async (req, res) => {
  try {
    const requests = await requestModel.getAllRequests();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una solicitud por ID
const updateRequest = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updatedRequest = await requestModel.updateRequest(id, data);
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una solicitud por ID
const deleteRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRequest = await requestModel.deleteRequest(id);
    res.status(200).json(deletedRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
};
