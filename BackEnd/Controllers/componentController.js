const ComponentModel = require('../Models/componentModel');

// Obtener todos los componentes
exports.getAllComponents = (req, res) => {
  ComponentModel.getAll((err, components) => {
    if (err) return res.status(500).json({ error: 'Error al obtener componentes' });
    res.json(components);
  });
};

// Obtener un componente por ID
exports.getComponentById = (req, res) => {
  const id = req.params.id;
  ComponentModel.getById(id, (err, component) => {
    if (err) return res.status(500).json({ error: 'Error al obtener el componente' });
    if (!component) return res.status(404).json({ error: 'Componente no encontrado' });
    res.json(component);
  });
};

// Crear un nuevo componente
exports.createComponent = (req, res) => {
  const newComponent = req.body;
  ComponentModel.create(newComponent, (err, insertId) => {
    if (err) return res.status(500).json({ error: 'Error al crear el componente' });
    res.status(201).json({ message: 'Componente creado', componentId: insertId });
  });
};

// Actualizar un componente existente
exports.updateComponent = (req, res) => {
  const id = req.params.id;
  const updatedComponent = req.body;
  ComponentModel.update(id, updatedComponent, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar el componente' });
    res.json({ message: 'Componente actualizado' });
  });
};

// Eliminar un componente (cambiar a inactivo)
exports.deleteComponent = (req, res) => {
  const id = req.params.id;
  ComponentModel.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar el componente' });
    res.json({ message: 'Componente marcado como inactivo' });
  });
};

// Eliminar un componente de la base de datos definitivamente
exports.deleteComponentPermanently = (req, res) => {
  const id = req.params.id;
  ComponentModel.deletePermanently(id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar el componente definitivamente' });
    res.json({ message: 'Componente eliminado permanentemente' });
  });
};
