const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear un usuario
const createUser = async (data) => {
  try {
    const user = await prisma.user.create({
      data: data,
    });
    return user;
  } catch (error) {
    throw new Error('Error al crear el usuario');
  }
};

// Obtener todos los usuarios
const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    throw new Error('Error al obtener los usuarios');
  }
};

// Obtener un usuario por su ID
const getUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { userId: Number(id) },
    });
    return user;
  } catch (error) {
    throw new Error('Error al obtener el usuario');
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

// Eliminar un usuario por su ID
const deleteUser = async (id) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: { userId: Number(id) },
    });
    return deletedUser;
  } catch (error) {
    throw new Error('Error al eliminar el usuario');
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
