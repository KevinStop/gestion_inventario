const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const componentMovementModel = require('../models/componentMovementModel'); 

const createComponentWithMovement = async (data) => {
  try {
    // Crear una única transacción que maneje todo
    return await prisma.$transaction(async (tx) => {
      // Validar el período académico activo
      let activeAcademicPeriodId = data.academicPeriodId;
      if (!activeAcademicPeriodId) {
        const activePeriod = await tx.academicPeriod.findFirst({
          where: { isActive: true },
        });
        if (!activePeriod) {
          throw new Error('PERIODO_ACTIVO_NO_ENCONTRADO');
        }
        activeAcademicPeriodId = activePeriod.id;
      }

      // Crear el componente
      const component = await tx.component.create({
        data: {
          name: data.name,
          quantity: 0, 
          description: data.description || null,
          isActive: data.isActive === 'true',
          imageUrl: data.imageUrl || null,
          category: {
            connect: { id: parseInt(data.categoryId) },
          },
        },
      });

      // Crear el movimiento directamente aquí
      const movementQuantity = parseInt(data.quantity);
      if (isNaN(movementQuantity) || movementQuantity <= 0) {
        throw new Error('La cantidad debe ser un número positivo');
      }

      const componentMovement = await tx.componentMovement.create({
        data: {
          componentId: component.id,
          quantity: movementQuantity,
          reason: data.reason || 'Sin razón especificada',
          movementType: 'ingreso',
          academicPeriodId: activeAcademicPeriodId,
        },
      });

      // Actualizar la cantidad del componente
      await tx.component.update({
        where: { id: component.id },
        data: { 
          quantity: movementQuantity,
        },
      });

      return { component, componentMovement };
    });
  } catch (error) {
    console.error('Error al crear el componente con movimiento:', error.message);
    throw new Error('Error al crear el componente con movimiento');
  }
};

// Obtener todos los componentes con cantidad disponible
const getAllComponents = async (status, includeAvailable = true) => {
  try {
    const whereCondition = {};
    if (status) {
      whereCondition.isActive = status === 'activo';
    }

    let components = await prisma.component.findMany({
      where: whereCondition,
      include: {
        category: true,
        requestDetails: {
          where: {
            request: {
              status: 'prestamo',
              isActive: true
            }
          },
          include: {
            request: true
          }
        },
        loanHistories: {
          where: {
            status: 'no_devuelto'
          }
        }
      }
    });

    if (includeAvailable) {
      components = await Promise.all(components.map(async (component) => {
        const availableQuantity = await calculateAvailableQuantity(component.id);
        return {
          ...component,
          availableQuantity,
          loanedQuantity: component.quantity - availableQuantity,
          activeLoans: component.loanHistories.length
        };
      }));
    }

    return components;
  } catch (error) {
    console.error('Error al obtener componentes:', error);
    throw new Error('Error al obtener los componentes');
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
      description: data.description || null,
      isActive: data.isActive === 'true',
      imageUrl: data.imageUrl || null,
      category: {
        connect: { id: parseInt(data.categoryId) }
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
    return await prisma.$transaction(async (tx) => {
      // Verificar si hay préstamos activos
      const activeLoans = await tx.loanHistory.findMany({
        where: { 
          componentId: Number(id),
          status: 'no_devuelto'
        }
      });

      if (activeLoans.length > 0) {
        throw new Error('No se puede eliminar un componente con préstamos activos');
      }

      // Primero finalizar cualquier préstamo pendiente
      await tx.loanHistory.updateMany({
        where: { 
          componentId: Number(id),
          endDate: null
        },
        data: {
          status: 'devuelto',
          endDate: new Date()
        }
      });

      // Ahora sí, eliminar en orden correcto
      await tx.requestDetail.deleteMany({
        where: { componentId: Number(id) }
      });

      await tx.loanHistory.deleteMany({
        where: { componentId: Number(id) }
      });

      await tx.componentMovement.deleteMany({
        where: { componentId: Number(id) }
      });

      const deletedComponent = await tx.component.delete({
        where: { id: Number(id) }
      });

      return deletedComponent;
    });
  } catch (error) {
    throw new Error(`Error al eliminar el componente: ${error.message}`);
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

// Función auxiliar para calcular la cantidad disponible de un componente
const calculateAvailableQuantity = async (componentId) => {
  try {
    // Obtener la cantidad total del componente
    const component = await prisma.component.findUnique({
      where: { id: componentId }
    });

    if (!component) {
      throw new Error('Componente no encontrado');
    }

    // Obtener la cantidad en préstamo activo
    const activeLoans = await prisma.loanHistory.findMany({
      where: {
        componentId,
        status: 'no_devuelto'
      }
    });

    // Sumar manualmente las cantidades de los préstamos activos
    const totalLoaned = activeLoans.reduce((sum, loan) => sum + 1, 0);

    // Calcular cantidad disponible
    const availableQuantity = component.quantity - totalLoaned;

    return availableQuantity;
  } catch (error) {
    console.error('Error calculando cantidad disponible:', error);
    throw new Error('Error al calcular cantidad disponible');
  }
};

// Verificar disponibilidad antes de crear una solicitud
const checkComponentAvailability = async (componentId, requestedQuantity) => {
  try {
    const availableQuantity = await calculateAvailableQuantity(componentId);
    
    // Verificar también en LoanHistory por préstamos pendientes
    const pendingLoans = await prisma.loanHistory.findMany({
      where: {
        componentId,
        status: 'no_devuelto'
      }
    });
    
    if (availableQuantity < requestedQuantity) {
      throw new Error(`Cantidad insuficiente disponible. Disponible: ${availableQuantity}`);
    }
    
    return {
      isAvailable: true,
      availableQuantity,
      pendingLoans: pendingLoans.length
    };
  } catch (error) {
    console.error('Error verificando disponibilidad:', error);
    throw error;
  }
};

module.exports = {
  createComponentWithMovement,
  getAllComponents,
  getComponentById,
  updateComponent,
  deleteComponent,
  searchComponentsByName,
  filterComponentsByCategories,
  getComponentCount,
  checkComponentAvailability,
  calculateAvailableQuantity
};