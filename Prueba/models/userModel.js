const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear un usuario
const createUser = async (data) => {
  try {
    if (!data.email || !data.password) {
      throw new Error('El email y la contraseña son obligatorios');
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    delete data.confirmPassword;

    const user = await prisma.user.create({
      data: data,
    });

    return user;
  } catch (error) {
    if (error.code === 'P2002') {
      throw new Error('El email ya está registrado');
    }
    console.error('Error al crear el usuario:', error);
    throw new Error(error.message || 'Hubo un problema al crear el usuario');
  }
};

// Verificar credenciales (inicio de sesión manual)
const verifyUserCredentials = async (email, password) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    return user;
  } catch (error) {
    throw new Error('Error en la verificación de credenciales');
  }
};

// Actualizar un usuario por su ID
const updateUser = async (id, data) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { userId: Number(id) },
      data: data,
    });
    return updatedUser;
  } catch (error) {
    throw new Error('Error al actualizar el usuario');
  }
};

// Desactivar un usuario por su ID
const deactivateUser = async (id) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { userId: Number(id) },
      data: { isActive: false },
    });
    return updatedUser;
  } catch (error) {
    throw new Error('Error al desactivar el usuario');
  }
};

const getUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { userId: id },
      select: { userId: true, email: true, name: true, role: true }, // Seleccionar solo los campos necesarios
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  } catch (error) {
    console.error('Error al obtener el usuario por ID:', error);
    throw new Error(error.message || 'Hubo un problema al obtener el usuario');
  }
};

module.exports = {
  createUser,
  updateUser,
  deactivateUser,
  verifyUserCredentials,
  getUserById,
};
