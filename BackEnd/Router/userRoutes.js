// Router/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../Models/User');

// Obtener todos los usuarios
router.get('/', (req, res) => {
  User.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Obtener un usuario por ID
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  User.getById(userId, (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(user);
  });
});

// Crear un nuevo usuario
router.post('/', (req, res) => {
  const userData = req.body;
  User.create(userData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User created successfully', userId: result.insertId });
  });
});

// Actualizar un usuario por ID
router.put('/:id', (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;
  User.update(userId, updatedData, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User updated successfully' });
  });
});

// Eliminar lógicamente (desactivar) un usuario por ID
router.delete('/:id', (req, res) => {
  const userId = req.params.id;
  User.deactivate(userId, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User deactivated successfully' });
  });
});

module.exports = router;
