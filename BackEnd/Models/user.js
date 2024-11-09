// models/User.js
const getConnection = require('../conexion');

const User = {
  // Obtener todos los usuarios activos
  getAll: (callback) => {
    getConnection((err, connection) => {
      if (err) return callback(err);
      connection.query('SELECT * FROM users WHERE is_active = 1', (error, results) => {
        connection.release();
        if (error) return callback(error);
        callback(null, results);
      });
    });
  },

  // Obtener un usuario por ID
  getById: (id, callback) => {
    getConnection((err, connection) => {
      if (err) return callback(err);
      connection.query('SELECT * FROM users WHERE id = ?', [id], (error, results) => {
        connection.release();
        if (error) return callback(error);
        callback(null, results[0]);
      });
    });
  },

  // Crear un nuevo usuario
  create: (data, callback) => {
    const { google_id, name, email, role, is_active } = data;
    getConnection((err, connection) => {
      if (err) return callback(err);
      connection.query(
        'INSERT INTO users (google_id, name, email, role, is_active) VALUES (?, ?, ?, ?, ?)',
        [google_id, name, email, role, is_active],
        (error, results) => {
          connection.release();
          if (error) return callback(error);
          callback(null, results);
        }
      );
    });
  },

  // Actualizar un usuario por ID
  update: (id, data, callback) => {
    const { name, email, role } = data;
    getConnection((err, connection) => {
      if (err) return callback(err);
      connection.query(
        'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
        [name, email, role, id],
        (error, results) => {
          connection.release();
          if (error) return callback(error);
          callback(null, results);
        }
      );
    });
  },

  // Desactivar (eliminar lógicamente) un usuario por ID
  deactivate: (id, callback) => {
    getConnection((err, connection) => {
      if (err) return callback(err);
      connection.query('UPDATE users SET is_active = 0 WHERE id = ?', [id], (error, results) => {
        connection.release();
        if (error) return callback(error);
        callback(null, results);
      });
    });
  },
};

module.exports = User;