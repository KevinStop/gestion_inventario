const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Crear un movimiento (ingreso o egreso)
const createComponentMovement = async (data) => {
  const {
    componentId,
    quantity,
    reason,
    movementType,
    academicPeriodId,
    prisma: transactionPrisma,
  } = data;

  const prismaClient = transactionPrisma || prisma;

  try {
    // Validar la cantidad
    const movementQuantity = parseInt(quantity);
    if (isNaN(movementQuantity) || movementQuantity <= 0) {
      throw new Error('La cantidad debe ser un número positivo');
    }

    // Validar la razón
    if (!reason || reason.trim() === '') {
      throw new Error('La razón del movimiento es obligatoria');
    }

    // Validar el componente
    const component = await prismaClient.component.findUnique({
      where: { id: parseInt(componentId) },
    });

    if (!component) {
      throw new Error('El componente no existe');
    }

    // Validar egreso
    if (movementType === 'egreso' && component.quantity < movementQuantity) {
      throw new Error('No hay suficientes componentes disponibles para este egreso');
    }

    // Obtener el periodo académico activo
    let activeAcademicPeriodId = academicPeriodId;
    if (!activeAcademicPeriodId) {
      const activePeriod = await prismaClient.academicPeriod.findFirst({
        where: { isActive: true },
      });
      if (!activePeriod) {
        throw new Error('PERIODO_ACTIVO_NO_ENCONTRADO');
      }
      activeAcademicPeriodId = activePeriod.id;
    }

    // Calcular la nueva cantidad
    const newQuantity =
      movementType === 'ingreso'
        ? component.quantity + movementQuantity
        : component.quantity - movementQuantity;

    // Crear el movimiento
    const componentMovement = await prismaClient.componentMovement.create({
      data: {
        componentId: parseInt(componentId),
        quantity: movementType === 'ingreso' ? movementQuantity : -movementQuantity,
        reason: reason.trim(),
        movementType,
        academicPeriodId: activeAcademicPeriodId,
      },
    });

    // Actualizar la cantidad del componente
    await prismaClient.component.update({
      where: { id: parseInt(componentId) },
      data: { quantity: newQuantity },
    });

    return componentMovement;
  } catch (error) {
    console.error('Error en createComponentMovement:', error.message);
    throw error;
  }
};

// Obtener movimientos de componentes con filtros opcionales
const getComponentMovements = async (filters) => {
  try {
    const { componentId, movementType, startDate, endDate } = filters;

    const whereCondition = {};

    if (componentId) {
      whereCondition.componentId = parseInt(componentId);
    }

    if (movementType) {
      whereCondition.movementType = movementType;
    }

    if (startDate || endDate) {
      whereCondition.movementDate = {};
      if (startDate) {
        whereCondition.movementDate.gte = new Date(startDate);
      }
      if (endDate) {
        whereCondition.movementDate.lte = new Date(endDate);
      }
    }

    const movements = await prisma.componentMovement.findMany({
      where: whereCondition,
      include: { component: true, academicPeriod: true },
    });

    return movements;
  } catch (error) {
    console.error(
      "Error al obtener los movimientos de componentes:",
      error.message
    );
    throw new Error("Error al obtener los movimientos de componentes");
  }
};

module.exports = {
  createComponentMovement,
  getComponentMovements,
};
