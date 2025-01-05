const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('./blacklistedTokens');

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const token = req.cookies?.authToken; // Leer token desde la cookie
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  // Verificar si el token está en la lista negra
  if (isTokenBlacklisted(token)) {
    return res.status(403).json({ message: 'Token inválido o revocado' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

// Middleware de autorización basado en roles
const authorizeRoles = (allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user?.role)) {
    return res.status(403).json({ message: 'No tienes permisos suficientes para realizar esta acción' });
  }
  next(); // Continuar si el rol está autorizado
};

module.exports = { authenticateToken, authorizeRoles };