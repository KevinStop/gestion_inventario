const requestModel = require("../models/requestModel");
const componentModel = require("../models/componentModel");
const loanHistoryService = require("../models/loanModel");
const EmailService = require("../src/mailer/emailService");

// Crear una solicitud con verificación de disponibilidad
const createRequest = async (req, res) => {
  let { userId, requestDetails, description, typeRequest, returnDate } =
    req.body;

  if (
    !userId ||
    !Array.isArray(requestDetails) ||
    requestDetails.length === 0 ||
    !typeRequest
  ) {
    return res.status(400).json({
      error: "Faltan campos obligatorios o el formato es incorrecto.",
    });
  }

  try {
    // Verificar disponibilidad de todos los componentes
    for (const detail of requestDetails) {
      try {
        await componentModel.calculateAvailableQuantity(
          detail.componentId,
          detail.quantity
        );
      } catch (error) {
        return res.status(400).json({
          error: `Error de disponibilidad: ${error.message}`,
          componentId: detail.componentId,
        });
      }
    }

    const data = {
      userId: parseInt(userId),
      description: description || null,
      typeRequest,
      returnDate: returnDate ? new Date(returnDate) : null,
      fileUrl: req.file ? `/uploads/comprobantes/${req.file.filename}` : null,
    };

    const newRequest = await requestModel.createRequest(data, requestDetails);
    await EmailService.sendNewRequestNotification(newRequest.requestId);
    return res.status(201).json(newRequest);
  } catch (error) {
    console.error("Error al crear la solicitud:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener todas las solicitudes activas
const getFilteredRequests = async (req, res) => {
  try {
    // Leer filtros desde la consulta
    const { userId, status, isActive } = req.query;

    // Convertir a tipos adecuados (userId e isActive)
    const filters = {
      userId: userId ? parseInt(userId) : undefined,
      status: status || undefined,
      isActive: isActive !== undefined ? isActive === "true" : undefined,
    };

    // Llamar al modelo con los filtros
    const requests = await requestModel.getFilteredRequests(filters);

    return res.status(200).json(requests);
  } catch (error) {
    console.error("Error en getFilteredRequests:", error.message);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

// Obtener una solicitud por ID
const getRequestById = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await requestModel.getRequestById(id);
    if (!request) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }
    return res.status(200).json(request); // Responde con la solicitud completa incluyendo detalles del componente
  } catch (error) {
    console.error("Error en getRequestById del controlador:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// Aceptar solicitud con verificación adicional de disponibilidad
const acceptRequest = async (req, res) => {
  const { id } = req.params;
  const requestId = parseInt(id);

  if (isNaN(requestId)) {
    return res.status(400).json({ error: "ID de solicitud inválido" });
  }

  try {
    // Obtener la solicitud con sus detalles
    const request = await requestModel.getRequestById(requestId);

    if (!request) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    // Verificar disponibilidad actual de todos los componentes
    for (const detail of request.requestDetails) {
      try {
        await componentModel.checkComponentAvailability(
          detail.componentId,
          detail.quantity
        );
      } catch (error) {
        return res.status(400).json({
          error: `No hay suficiente cantidad disponible del componente: ${detail.component.name}`,
          componentId: detail.componentId,
        });
      }
    }

    // Aceptar la solicitud (la creación de LoanHistory ya está incluida en acceptRequest)
    const updatedRequest = await requestModel.acceptRequest(requestId);
    await EmailService.sendRequestApprovalNotification(
      updatedRequest.requestId
    );

    return res.status(200).json({
      message: "Solicitud aceptada con éxito.",
      updatedRequest,
    });
  } catch (error) {
    console.error("Error al aceptar la solicitud:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// Eliminar una solicitud
const deleteRequest = async (req, res) => {
  const { id } = req.params;
  const requestId = parseInt(id);
  const userId = req.user?.userId;
  const role = req.user?.role;

  if (isNaN(requestId)) {
    return res
      .status(400)
      .json({ error: "El ID de la solicitud debe ser un número válido." });
  }

  try {
    // Verificar si hay préstamos activos antes de eliminar
    const activeLoans = await loanHistoryService.getCurrentLoans();
    const hasActiveLoans = activeLoans.some(
      (loan) => loan.requestId === requestId
    );

    if (hasActiveLoans) {
      return res.status(400).json({
        error: "No se puede eliminar una solicitud con préstamos activos.",
      });
    }

    const deletedRequest = await requestModel.deleteRequest(
      requestId,
      userId,
      role
    );

    return res.status(200).json({
      message: "Solicitud y registros relacionados eliminados con éxito.",
      deletedRequest,
    });
  } catch (error) {
    console.error("Error en deleteRequest:", error.message);
    const statusCode = error.message.includes("permisos") ? 403 : 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

const rejectRequest = async (req, res) => {
  const { id } = req.params;
  const { rejectionNotes } = req.body;
  const requestId = parseInt(id);
  const adminId = req.user?.userId;

  if (isNaN(requestId)) {
    return res
      .status(400)
      .json({ error: "El ID de la solicitud debe ser un número válido." });
  }

  if (!rejectionNotes) {
    return res
      .status(400)
      .json({ error: "Debe proporcionar un motivo para el rechazo." });
  }

  try {
    const result = await requestModel.rejectRequest(
      requestId,
      adminId,
      rejectionNotes
    );

    // Enviar correo de notificación
    await EmailService.sendRequestRejectionNotification(requestId);

    return res.status(200).json({
      message: "Solicitud rechazada exitosamente.",
      result,
    });
  } catch (error) {
    console.error("Error en rejectRequest:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// Finalizar una solicitud y reponer los componentes
const finalizeRequest = async (req, res) => {
  handleRequestAction(
    req,
    res,
    async (requestId, adminNotes) => {
      return await requestModel.finalizeRequest(requestId, adminNotes);
    },
    "finalizar la solicitud"
  );
};

// Controlador para marcar una solicitud como no devuelta
const markAsNotReturned = async (req, res) => {
  handleRequestAction(
    req,
    res,
    async (requestId, adminNotes) => {
      return await requestModel.markAsNotReturned(requestId, adminNotes);
    },
    "marcar como no devuelto"
  );
};

// Función auxiliar para manejar acciones comunes
const handleRequestAction = async (req, res, action, actionDescription) => {
  const { id } = req.params;
  const { adminNotes } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ error: "El ID de la solicitud no fue proporcionado." });
  }

  const requestId = parseInt(id, 10);

  if (isNaN(requestId)) {
    return res
      .status(400)
      .json({ error: "El ID de la solicitud debe ser un número válido." });
  }

  try {
    const result = await action(requestId, adminNotes);

    return res.status(200).json({
      message: `Solicitud ${actionDescription} con éxito.`,
      updatedRequest: result.updatedRequest,
      requestPeriod: result.requestPeriod,
    });
  } catch (error) {
    console.error(`Error al ${actionDescription}:`, error.message);
    return res
      .status(500)
      .json({ error: `Error al ${actionDescription}: ${error.message}` });
  }
};

const updateReturnDate = async (req, res) => {
  const { id } = req.params; // ID de la solicitud
  const { newReturnDate } = req.body; // Nueva fecha proporcionada por el usuario

  if (!newReturnDate) {
    return res
      .status(400)
      .json({ error: "La nueva fecha de retorno es obligatoria." });
  }

  const requestId = parseInt(id);
  const userId = req.user?.userId; // ID del usuario autenticado
  const role = req.user?.role; // Rol del usuario autenticado

  if (isNaN(requestId)) {
    return res
      .status(400)
      .json({ error: "El ID de la solicitud debe ser un número válido." });
  }

  try {
    const updatedRequest = await requestModel.updateReturnDate(
      requestId,
      userId,
      role,
      newReturnDate
    );

    return res.status(200).json({
      message: "Fecha de retorno actualizada con éxito.",
      updatedRequest,
    });
  } catch (error) {
    console.error("Error en updateReturnDate:", error.message);
    if (error.message.includes("ya ha sido modificada")) {
      return res
        .status(403)
        .json({
          error:
            "La fecha de retorno ya ha sido modificada y no puede actualizarse nuevamente.",
        });
    }
    return res.status(403).json({ error: error.message });
  }
};

const getNotReturnedLoans = async (req, res) => {
  try {
    const notReturnedLoans = await loanHistoryService.getNotReturnedLoans();
    res.status(200).json({ notReturnedLoans });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRequest,
  getFilteredRequests,
  getRequestById,
  acceptRequest,
  deleteRequest,
  finalizeRequest,
  updateReturnDate,
  markAsNotReturned,
  getNotReturnedLoans,
  rejectRequest,
};
