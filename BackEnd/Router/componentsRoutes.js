const express = require('express');
const router = express.Router();
const getConnection = require('../conexion');

// Crear un nuevo componente
router.post('/components', (req, res) => {
    const { name, quantity, description, status, category } = req.body;
    const query = 'INSERT INTO components (name, quantity, description, status, category) VALUES (?, ?, ?, ?, ?)';
    
    getConnection((err, connection) => {
        if (err) throw err;
        connection.query(query, [name, quantity, description, status, category], (error, results) => {
            connection.release();
            if (error) return res.status(500).json({ error: error.message });
            res.status(201).json({ message: 'Componente creado', componentId: results.insertId });
        });
    });
});

// Obtener todos los componentes
router.get('/components', (req, res) => {
    const query = 'SELECT * FROM components';
    
    getConnection((err, connection) => {
        if (err) throw err;
        connection.query(query, (error, results) => {
            connection.release();
            if (error) return res.status(500).json({ error: error.message });
            res.json(results);
        });
    });
});

// Obtener un componente por ID
router.get('/components/:id', (req, res) => {
    const componentId = req.params.id;
    const query = 'SELECT * FROM components WHERE component_id = ?';
    
    getConnection((err, connection) => {
        if (err) throw err;
        connection.query(query, [componentId], (error, results) => {
            connection.release();
            if (error) return res.status(500).json({ error: error.message });
            if (results.length === 0) return res.status(404).json({ message: 'Componente no encontrado' });
            res.json(results[0]);
        });
    });
});

// Actualizar un componente por ID
router.put('/components/:id', (req, res) => {
    const componentId = req.params.id;
    const { name, quantity, description, status, category } = req.body;
    const query = 'UPDATE components SET name = ?, quantity = ?, description = ?, status = ?, category = ? WHERE component_id = ?';
    
    getConnection((err, connection) => {
        if (err) throw err;
        connection.query(query, [name, quantity, description, status, category, componentId], (error, results) => {
            connection.release();
            if (error) return res.status(500).json({ error: error.message });
            if (results.affectedRows === 0) return res.status(404).json({ message: 'Componente no encontrado' });
            res.json({ message: 'Componente actualizado' });
        });
    });
});

// Eliminar un componente por ID
router.delete('/components/:id', (req, res) => {
    const componentId = req.params.id;
    const query = 'DELETE FROM components WHERE component_id = ?';
    
    getConnection((err, connection) => {
        if (err) throw err;
        connection.query(query, [componentId], (error, results) => {
            connection.release();
            if (error) return res.status(500).json({ error: error.message });
            if (results.affectedRows === 0) return res.status(404).json({ message: 'Componente no encontrado' });
            res.json({ message: 'Componente eliminado' });
        });
    });
});

module.exports = router;
