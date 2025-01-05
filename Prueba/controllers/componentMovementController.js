const componentMovementModel = require('../models/componentMovementModel');

// Crear un movimiento (ingreso o egreso)
const createComponentMovement = async (req, res) => {
  try {
    const data = req.body;

    if (!['ingreso', 'egreso'].includes(data.movementType)) {
      return res.status(400).json({ error: 'El tipo de movimiento debe ser "ingreso" o "egreso"' });
    }

    const componentMovement = await componentMovementModel.createComponentMovement(data);

    res.status(201).json(componentMovement);
  } catch (error) {
    console.error('Error en el controlador createComponentMovement:', error.message);

    if (error.message === 'PERIODO_ACTIVO_NO_ENCONTRADO') {
      return res.status(400).json({ error: 'No hay un periodo académico activo disponible.' });
    }

    res.status(500).json({ error: 'Error al crear el movimiento del componente.' });
  }
};

// Obtener movimientos de componentes con filtros opcionales
const getComponentMovements = async (req, res) => {
  const { componentId, movementType, startDate, endDate } = req.query;

  try {
    const filters = {
      componentId,
      movementType,
      startDate,
      endDate,
    };

    const movements = await componentMovementModel.getComponentMovements(filters);

    res.status(200).json({ movements });
  } catch (error) {
    console.error('Error al obtener los movimientos de componentes:', error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createComponentMovement,
  getComponentMovements,
};
