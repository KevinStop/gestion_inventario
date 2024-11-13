const componentModel = require('../models/componentModel');
const upload = require('../config/uploadConfig');
const path = require('path');
const fs = require('fs');

// Crear un componente
const createComponent = async (req, res) => {
  try {
    const data = req.body;
    
    if (req.file) {
      data.imageUrl = `/uploads/${req.file.filename}`;
    }
    const component = await componentModel.createComponent(data);
    res.status(201).json(component);
  } catch (error) {
    console.error('Error al crear el componente:', error);
    res.status(500).json({ error: error.message });
  }
};


// Obtener todos los componentes
const getAllComponents = async (req, res) => {
  const { name, page = 1, limit = 10 } = req.query;  // Obtener los parámetros de paginación

  try {
    let components;
    if (name) {
      components = await componentModel.searchComponentsByName(name);
    } else {
      components = await componentModel.getAllComponents(parseInt(page), parseInt(limit));
    }

    const totalComponents = await componentModel.getComponentCount();
    const totalPages = Math.ceil(totalComponents / limit);

    res.status(200).json({
      components,
      totalComponents,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    });
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
      const oldImagePath = path.join(__dirname, '..', 'uploads', path.basename(currentComponent.imageUrl));
      data.imageUrl = `/uploads/${req.file.filename}`;
      if (currentComponent.imageUrl && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
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
    // Obtén el componente a eliminar
    const component = await componentModel.getComponentById(id);
    if (!component) {
      return res.status(404).json({ error: 'Componente no encontrado' });
    }

    // Elimina la imagen si existe
    if (component.imageUrl) {
      const imagePath = path.join(__dirname, '../uploads', path.basename(component.imageUrl));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Elimina el componente
    const deletedComponent = await componentModel.deleteComponent(id);
    res.status(200).json(deletedComponent);
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
    res.status(200).json(components);
  } catch (error) {
    console.error('Error al filtrar los componentes:', error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  createComponent,
  getAllComponents,
  getComponentById,
  updateComponent,
  deleteComponent,
  filterComponentsByCategories,
};
