const componentModel = require('../models/componentModel');

// Crear un componente
const createComponent = async (req, res) => {
  try {
    const data = req.body;
    const component = await componentModel.createComponent(data);
    res.status(201).json(component);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los componentes
const getAllComponents = async (req, res) => {
  try {
    const components = await componentModel.getAllComponents();
    res.status(200).json(components);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un componente por ID
const getComponentById = async (req, res) => {
  const { id } = req.params;
  try {
    const component = await componentModel.getComponentById(id);
    if (!component) {
      return res.status(404).json({ error: 'Componente no encontrado' });
    }
    res.status(200).json(component);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un componente por ID
const updateComponent = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updatedComponent = await componentModel.updateComponent(id, data);
    res.status(200).json(updatedComponent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un componente por ID
const deleteComponent = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedComponent = await componentModel.deleteComponent(id);
    res.status(200).json(deletedComponent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createComponent,
  getAllComponents,
  getComponentById,
  updateComponent,
  deleteComponent,
};
