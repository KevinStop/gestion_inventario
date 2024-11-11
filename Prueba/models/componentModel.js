const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear un componente
const createComponent = async (data) => {
  try {
    const component = await prisma.component.create({
      data: data,
    });
    return component;
  } catch (error) {
    throw new Error('Error al crear el componente');
  }
};

// Obtener todos los componentes
const getAllComponents = async () => {
  try {
    const components = await prisma.component.findMany();
    return components;
  } catch (error) {
    throw new Error('Error al obtener los componentes');
  }
};

// Obtener un componente por su ID
const getComponentById = async (id) => {
  try {
    const component = await prisma.component.findUnique({
      where: { id: Number(id) },
    });
    return component;
  } catch (error) {
    throw new Error('Error al obtener el componente');
  }
};

// Actualizar un componente por su ID
const updateComponent = async (id, data) => {
  try {
    const updatedComponent = await prisma.component.update({
      where: { id: Number(id) },
      data: data,
    });
    return updatedComponent;
  } catch (error) {
    throw new Error('Error al actualizar el componente');
  }
};

// Eliminar un componente por su ID
const deleteComponent = async (id) => {
  try {
    const deletedComponent = await prisma.component.delete({
      where: { id: Number(id) },
    });
    return deletedComponent;
  } catch (error) {
    throw new Error('Error al eliminar el componente');
  }
};

module.exports = {
  createComponent,
  getAllComponents,
  getComponentById,
  updateComponent,
  deleteComponent,
};
