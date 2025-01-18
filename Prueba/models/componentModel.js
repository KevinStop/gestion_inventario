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
        const availability = await calculateAvailableQuantity(component.id);
        return {
          ...component,
          ...availability,
          loanedQuantity: component.quantity - availability.availableQuantity
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
    // 1. Obtener el componente con sus relaciones
    const component = await prisma.component.findUnique({
      where: { id: componentId },
      include: {
        // Solo incluimos requestDetails ya que es lo que usaremos para el cálculo
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
        }
      }
    });

    if (!component) {
      throw new Error('Componente no encontrado');
    }

    // 2. Calcular cantidad en préstamo desde requestDetails
    const totalInRequests = component.requestDetails.reduce((sum, detail) => {
      if (detail.request.status === 'prestamo') {
        return sum + detail.quantity;
      }
      return sum;
    }, 0);

    // 3. Calcular cantidad disponible
    const availableQuantity = Math.max(0, component.quantity - totalInRequests);

    return {
      totalQuantity: component.quantity,
      availableQuantity: availableQuantity,
      inRequests: totalInRequests
    };
  } catch (error) {
    console.error('Error calculando cantidad disponible:', error);
    throw new Error('Error al calcular cantidad disponible');
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
  calculateAvailableQuantity
};