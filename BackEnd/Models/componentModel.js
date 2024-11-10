const getConnection = require('../conexion');

const ComponentModel = {
  // Obtener todos los componentes
  getAll: (callback) => {
    getConnection((err, connection) => {
      if (err) return callback(err);
      const sql = 'select * from components';
      connection.query(sql, (err, results) => {
        connection.release();
        if (err) return callback(err);
        callback(null, results);
      });
    });
  },

  // Obtener un componente por ID
  getById: (id, callback) => {
    getConnection((err, connection) => {
      if (err) return callback(err);
      const sql = 'SELECT * FROM components WHERE component_id = ?';
      connection.query(sql, [id], (err, results) => {
        connection.release();
        if (err) return callback(err);
        callback(null, results[0]);
      });
    });
  },

  // Crear un nuevo componente
  create: (componentData, callback) => {
    getConnection((err, connection) => {
      if (err) return callback(err);
      const sql = 'INSERT INTO components (name, category, quantity, description, is_active) VALUES (?, ?, ?, ?, ?)';
      const values = [
        componentData.name,
        componentData.category,
        componentData.quantity,
        componentData.description,
        componentData.is_active || false,
      ];
      connection.query(sql, values, (err, results) => {
        connection.release();
        if (err) return callback(err);
        callback(null, results.insertId);
      });
    });
  },

  // Actualizar un componente existente
  update: (id, componentData, callback) => {
    getConnection((err, connection) => {
      if (err) return callback(err);
      const sql = `
        UPDATE components SET 
          name = ?, 
          category = ?, 
          quantity = ?, 
          description = ?, 
          is_active = ? 
        WHERE component_id = ?`;
      const values = [
        componentData.name,
        componentData.category,
        componentData.quantity,
        componentData.description,
        componentData.is_active,
        id,
      ];
      connection.query(sql, values, (err, results) => {
        connection.release();
        if (err) return callback(err);
        callback(null, results);
      });
    });
  },

  // Eliminar un componente (cambio de estado a inactivo)
  delete: (id, callback) => {
    getConnection((err, connection) => {
      if (err) return callback(err);
      const sql = 'UPDATE components SET is_active = FALSE WHERE component_id = ?';
      connection.query(sql, [id], (err, results) => {
        connection.release();
        if (err) return callback(err);
        callback(null, results);
      });
    });
  }
};

// Eliminar un componente de la base de datos definitivamente
deletePermanently: (id, callback) => {
  getConnection((err, connection) => {
    if (err) return callback(err);
    const sql = 'DELETE FROM components WHERE component_id = ?';
    connection.query(sql, [id], (err, results) => {
      connection.release();
      if (err) return callback(err);
      callback(null, results);
    });
  });
}


module.exports = ComponentModel;
