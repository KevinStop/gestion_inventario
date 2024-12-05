const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET); // Verificamos y decodificamos el token
    req.user = user; // Asignamos al usuario autenticado
    next(); // Continuamos con la ejecución de la siguiente función middleware
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

const authorizeRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return res.status(403).json({ message: 'No tienes permisos suficientes' });
  }
  next();
};

module.exports = { authenticateToken, authorizeRole };
