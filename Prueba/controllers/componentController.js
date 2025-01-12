const componentModel = require('../models/componentModel');
const loanHistoryService = require('../models/loanModel');
const upload = require('../config/uploadConfig');
const path = require('path');
const fs = require('fs');

// Crear un componente
const createComponentWithMovement = async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.imageUrl = `/uploads/componentes/${req.file.filename}`;
    }

    // Validar los datos requeridos
    if (!data.name || !data.quantity || !data.categoryId || !data.reason) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios (name, quantity, categoryId, reason).',
      });
    }

    // Llamar al método transaccional
    const result = await componentModel.createComponentWithMovement(data);

    res.status(201).json(result);
  } catch (error) {
    console.error('Error al crear el componente con movimiento:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los componentes con filtro por estado
const getAllComponents = async (req, res) => {
  const { name, status, includeAvailable } = req.query;
  const shouldIncludeAvailable = includeAvailable !== 'false'; // Por defecto true

  try {
    let components;
    if (name) {
      components = await componentModel.searchComponentsByName(name);
    } else {
      components = await componentModel.getAllComponents(status, shouldIncludeAvailable);
    }

    // Si es un usuario normal, solo enviar componentes activos y con cantidad disponible
    if (req.user?.role === 'user') {
      components = components.filter(comp => comp.isActive && comp.availableQuantity > 0);
      
      // Simplificar la respuesta para usuarios
      components = components.map(comp => ({
        id: comp.id,
        name: comp.name,
        description: comp.description,
        imageUrl: comp.imageUrl,
        category: comp.category,
        quantity: comp.availableQuantity, // Mostrar solo la cantidad disponible
        categoryId: comp.categoryId
      }));
    }

    res.status(200).json({ components });
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
    const currentComponent = await componentModel.getComponentById(id);
    if (!currentComponent) {
      return res.status(404).json({ error: 'Componente no encontrado' });
    }
    if (req.file) {
      const oldImagePath = path.join(__dirname, '..', 'uploads/componentes', path.basename(currentComponent.imageUrl));
      data.imageUrl = `/uploads/componentes/${req.file.filename}`;
      if (currentComponent.imageUrl && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    } else {
      data.imageUrl = currentComponent.imageUrl;
    }
    const updatedComponent = await componentModel.updateComponent(id, data);
    res.status(200).json(updatedComponent);
  } catch (error) {
    console.error('Error al actualizar el componente:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un componente por ID
const deleteComponent = async (req, res) => {
  const { id } = req.params;
  try {
    // Obtener el componente
    const component = await componentModel.getComponentById(id);
    if (!component) {
      return res.status(404).json({ error: 'Componente no encontrado' });
    }

    // Verificar si hay préstamos activos
    const activeLoans = await loanHistoryService.getCurrentLoans();
    const hasActiveLoans = activeLoans.some(loan => loan.componentId === parseInt(id));

    if (hasActiveLoans) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el componente porque tiene préstamos activos'
      });
    }

    // Eliminar la imagen si existe
    if (component.imageUrl) {
      const imagePath = path.join(__dirname, '../uploads/componentes', path.basename(component.imageUrl));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Llamar al método del modelo que maneja la eliminación en cascada
    const deletedComponent = await componentModel.deleteComponent(id);
    res.status(200).json({
      message: 'Componente y registros relacionados eliminados exitosamente',
      deletedComponent
    });
  } catch (error) {
    console.error('Error al eliminar el componente:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const filterComponentsByCategories = async (req, res) => {
  const { categoryIds } = req.query; 
  try {
    if (!categoryIds) {
      return res.status(400).json({ error: 'Se deben proporcionar IDs de categorías' });
    }
    const components = await componentModel.filterComponentsByCategories(categoryIds);
    // Envolver los componentes en un objeto con la propiedad 'components'
    res.status(200).json({ components });
  } catch (error) {
    console.error('Error al filtrar los componentes:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener el conteo total de componentes
const getComponentCount = async (req, res) => {
  try {
    const count = await componentModel.getComponentCount();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  createComponentWithMovement,
  getAllComponents,
  getComponentById,
  updateComponent,
  deleteComponent,
  filterComponentsByCategories,
  getComponentCount,
};