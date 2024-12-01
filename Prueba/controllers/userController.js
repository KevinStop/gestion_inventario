const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Crear un usuario (manual)
const registerUser = async (req, res) => {
  try {
    const data = req.body;

    delete data.confirmPassword;

    const user = await userModel.createUser(data);

    const token = jwt.sign(
      { userId: user.userId, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Error en registro de usuario:', error); // Log detallado
    res.status(500).json({ error: error.message });
  }
};

// Iniciar sesión (manual)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.verifyUserCredentials(email, password);

    const token = jwt.sign(
      { userId: user.userId, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Obtener todos los usuarios (solo admins)
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un usuario por ID (solo el propio usuario o un admin)
const getUserById = async (req, res) => {
  const { id } = req.params;

  // Validar que sea el propio usuario o un admin
  if (req.user.userId !== Number(id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'No tienes permisos para acceder a esta información' });
  }

  try {
    const user = await userModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un usuario (solo el propio usuario o un admin)
const updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  // Validar que sea el propio usuario o un admin
  if (req.user.userId !== Number(id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
  }

  try {
    const updatedUser = await userModel.updateUser(id, data);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Desactivar un usuario (solo el propio usuario o un admin)
const deactivateUser = async (req, res) => {
  const { id } = req.params;

  // Validar que sea el propio usuario o un admin
  if (req.user.userId !== Number(id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
  }

  try {
    const user = await userModel.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const deactivatedUser = await userModel.deactivateUser(id);
    res.status(200).json({ message: 'Usuario desactivado exitosamente', user: deactivatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deactivateUser,
};