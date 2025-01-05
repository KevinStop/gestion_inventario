const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { blacklistToken } = require('../middleware/blacklistedTokens');
const { generateToken, setTokenCookie } = require('../Utils/tokenUtils');

// Crear un usuario (manual)
const registerUser = async (req, res) => {
  try {
    const data = req.body;

    // Validar y eliminar campos innecesarios
    delete data.confirmPassword;

    // Crear el usuario en la base de datos
    const user = await userModel.createUser(data);

    // Generar el token y configurar la cookie
    const token = generateToken({ userId: user.userId, email: user.email, role: user.role });
    setTokenCookie(res, token);

    // Responder con el usuario creado
    res.status(201).json({ user });
  } catch (error) {
    console.error('Error en registro de usuario:', error);
    res.status(500).json({ error: error.message });
  }
};

// Iniciar sesión (manual)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar las credenciales del usuario
    const user = await userModel.verifyUserCredentials(email, password);

    // Generar el token y configurar la cookie
    const token = generateToken({ userId: user.userId, email: user.email, role: user.role });
    setTokenCookie(res, token);

    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ error: error.message });
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

const logoutUser = (req, res) => {
  const token = req.cookies?.authToken;
  if (!token) {
    return res.status(400).json({ message: 'No se proporcionó un token para cerrar sesión' });
  }

  blacklistToken(token); // Agregar token a la lista negra
  res.clearCookie('authToken'); // Eliminar la cookie
  res.status(200).json({ message: 'Sesión cerrada correctamente' });
};

const extendSession = (req, res) => {
  try {
    const token = req.cookies?.authToken;
    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    // Verificar el token actual
    const user = jwt.verify(token, process.env.JWT_SECRET);

    // Generar un nuevo token y actualizar la cookie
    const newToken = generateToken({ userId: user.userId, email: user.email, role: user.role });
    setTokenCookie(res, newToken);

    res.status(200).json({ message: 'Sesión extendida exitosamente' });
  } catch (error) {
    console.error('Error al extender la sesión:', error);
    res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

const getAuthenticatedUser = async (req, res) => {
  try {
    const { userId } = req.user; // `req.user` es llenado por el middleware `authenticateToken`

    // Obtener los datos del usuario desde el modelo
    const user = await userModel.getUserById(userId);

    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener el usuario autenticado:', error);
    res.status(500).json({ message: error.message || 'Error al obtener la información del usuario' });
  }
};

const getSessionTime = (req, res) => {
  try {
    const token = req.cookies?.authToken;
    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado.' });
    }

    // Decodificar el token sin verificar la firma
    const decodedToken = jwt.decode(token);

    if (!decodedToken || !decodedToken.exp) {
      return res.status(400).json({ message: 'Token inválido.' });
    }

    const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
    const remainingTime = (decodedToken.exp - currentTime) * 1000; // Convertir a milisegundos

    if (remainingTime <= 0) {
      return res.status(401).json({ message: 'La sesión ha expirado.' });
    }

    res.status(200).json({ remainingTime });
  } catch (error) {
    console.error('Error al obtener el tiempo restante de la sesión:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  deactivateUser,
  logoutUser,
  extendSession,
  getAuthenticatedUser,
  getSessionTime,
};