const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear un componente con una categoría existente
const createComponent = async (data) => {
  try {
    const componentData = {
      name: data.name,
      quantity: parseInt(data.quantity),
      description: data.description || null,
      isActive: data.isActive === 'true',
      imageUrl: data.imageUrl || null,
      category: {
        connect: { id: parseInt(data.categoryId) }  // Conectamos con la categoría existente
      }
    };
    const component = await prisma.component.create({
      data: componentData,
    });
    return component;
  } catch (error) {
    console.error('Error al crear el componente:', error.message);
    throw new Error('Error al crear el componente');
  }
};

// Obtener todos los componentes con paginación
const getAllComponents = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const components = await prisma.component.findMany({
      include: { category: true },
      skip: skip,
      take: limit,
    });
    return components;
  } catch (error) {
    throw new Error('Error al obtener los componentes con paginación');
  }
};


// Obtener un componente por su ID y su categoría
const getComponentById = async (id) => {
  try {
    const component = await prisma.component.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });
    return component;
  } catch (error) {
    throw new Error('Error al obtener el componente');
  }
};

// Actualizar un componente por su ID
const updateComponent = async (id, data) => {
  try {
    const componentData = {
      name: data.name,
      quantity: parseInt(data.quantity),
      description: data.description || null,
      isActive: data.isActive === 'true',
      imageUrl: data.imageUrl || null,
      category: {
        connect: { id: parseInt(data.categoryId) }  // Conectamos con la categoría existente
      }
    };
    
    const updatedComponent = await prisma.component.update({
      where: { id: Number(id) },
      data: componentData,
    });
    return updatedComponent;
  } catch (error) {
    console.error('Error al actualizar el componente:', error.message);
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

// Buscar componentes por nombre y su categoría
const searchComponentsByName = async (name) => {
  try {
    if (!name || typeof name !== 'string') {
      throw new Error('El parámetro de búsqueda "name" no es válido');
    }

    const components = await prisma.component.findMany({
      where: {
        name: {
          contains: name.trim(),
        },
      },
      include: { category: true },
    });
    return components;
  } catch (error) {
    console.error('Error en searchComponentsByName:', error.message);
    throw new Error('Error al buscar los componentes');
  }
};

// Filtrar componentes por categorías
const filterComponentsByCategories = async (categoryIds) => {
  try {
    const categories = categoryIds.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));

    if (categories.length === 0) {
      throw new Error('Al menos un ID de categoría válido debe ser proporcionado');
    }

    const components = await prisma.component.findMany({
      where: {
        categoryId: {
          in: categories,
        },
      },
      include: {
        category: true,
      },
    });

    return components;
  } catch (error) {
    console.error('Error al filtrar los componentes:', error);
    throw new Error('Error al filtrar los componentes');
  }
};

// Obtener el conteo total de componentes
const getComponentCount = async () => {
  try {
    const count = await prisma.component.count();
    return count;
  } catch (error) {
    console.error('Error al obtener el conteo de componentes:', error.message);
    throw new Error('Error al obtener el conteo de componentes');
  }
};


module.exports = {
  createComponent,
  getAllComponents,
  getComponentById,
  updateComponent,
  deleteComponent,
  searchComponentsByName,
  filterComponentsByCategories,
  getComponentCount
};