const blacklistedTokens = new Set(); 

// Agregar token a la lista negra
const blacklistToken = (token) => {
  blacklistedTokens.add(token);
};

// Verificar si un token está en la lista negra
const isTokenBlacklisted = (token) => {
  return blacklistedTokens.has(token);
};

module.exports = { blacklistToken, isTokenBlacklisted };
