const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Crear un movimiento (ingreso o egreso)
const createComponentMovement = async (data) => {
  const { componentId, quantity, reason, movementType, academicPeriodId } = data;

  try {
    // Validar la cantidad (excepto cuando el movimiento inicial tiene cantidad 0 o null)
    const movementQuantity = parseInt(quantity);
    if (isNaN(movementQuantity) || (movementQuantity <= 0 && movementQuantity !== 0)) {
      throw new Error("La cantidad debe ser un número positivo o nula en el caso inicial");
    }

    // Obtener el componente actual
    const component = await prisma.component.findUnique({
      where: { id: parseInt(componentId) },
    });

    if (!component) {
      throw new Error("El componente no existe");
    }

    // Validar egreso
    if (movementType === "egreso" && component.quantity < movementQuantity) {
      throw new Error(
        "No hay suficientes componentes disponibles para este egreso"
      );
    }

    // Obtener el periodo académico activo si no se proporciona `academicPeriodId`
    let activeAcademicPeriodId = academicPeriodId;
    if (!activeAcademicPeriodId) {
      const activePeriod = await prisma.academicPeriod.findFirst({
        where: { isActive: true },
      });

      if (!activePeriod) {
        throw new Error(
          "No hay un periodo académico activo. No se puede realizar el movimiento."
        );
      }

      activeAcademicPeriodId = activePeriod.id;
    }

    // Calcular nueva cantidad
    const newQuantity =
      movementType === "ingreso"
        ? component.quantity + movementQuantity
        : component.quantity - movementQuantity;

    // Crear el movimiento
    const componentMovement = await prisma.componentMovement.create({
      data: {
        componentId: parseInt(componentId),
        quantity: movementType === "ingreso" ? movementQuantity : -movementQuantity,
        reason: reason || "Sin razón especificada",
        movementType,
        academicPeriodId: activeAcademicPeriodId,
      },
    });

    // Actualizar la cantidad del componente
    await prisma.component.update({
      where: { id: parseInt(componentId) },
      data: { quantity: newQuantity },
    });

    return componentMovement;
  } catch (error) {
    console.error(
      "Error al crear el movimiento del componente:",
      error.message
    );
    throw new Error("Error al crear el movimiento del componente");
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
