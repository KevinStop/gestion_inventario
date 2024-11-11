// controllers/requestDetailController.js
const requestDetailModel = require('../models/requestDetailModel');

// Crear un detalle de solicitud
const createRequestDetail = async (req, res) => {
  try {
    const data = req.body;
    const requestDetail = await requestDetailModel.createRequestDetail(data);
    res.status(201).json(requestDetail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los detalles de solicitud
const getAllRequestDetails = async (req, res) => {
  try {
    const requestDetails = await requestDetailModel.getAllRequestDetails();
    res.status(200).json(requestDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un detalle de solicitud por ID
const getRequestDetailById = async (req, res) => {
  const { id } = req.params;
  try {
    const requestDetail = await requestDetailModel.getRequestDetailById(id);
    if (!requestDetail) {
      return res.status(404).json({ error: 'Detalle de solicitud no encontrado' });
    }
    res.status(200).json(requestDetail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un detalle de solicitud por ID
const updateRequestDetail = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updatedRequestDetail = await requestDetailModel.updateRequestDetail(id, data);
    res.status(200).json(updatedRequestDetail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un detalle de solicitud por ID
const deleteRequestDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRequestDetail = await requestDetailModel.deleteRequestDetail(id);
    res.status(200).json(deletedRequestDetail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRequestDetail,
  getAllRequestDetails,
  getRequestDetailById,
  updateRequestDetail,
  deleteRequestDetail,
};
