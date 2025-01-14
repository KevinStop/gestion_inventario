const newRequestTemplate = (requestData) => {
  return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Nueva Solicitud de Componentes</h2>
        <p>Se ha recibido una nueva solicitud con los siguientes detalles:</p>
        <ul>
          <li>Usuario: ${requestData.userName}</li>
          <li>Fecha de solicitud: ${new Date(
            requestData.createdAt
          ).toLocaleDateString()}</li>
          <li>Tipo de solicitud: ${requestData.typeRequest}</li>
          <li>Descripción: ${requestData.description || "No especificada"}</li>
        </ul>
        <p>Por favor, revise la solicitud en el sistema para su aprobación o rechazo.</p>
      </div>
    `;
};

const approvedRequestTemplate = (requestData) => {
  return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Solicitud Aprobada</h2>
        <p>Su solicitud ha sido aprobada con los siguientes detalles:</p>
        <ul>
          <li>Número de solicitud: ${requestData.requestId}</li>
          <li>Fecha de aprobación: ${new Date().toLocaleDateString()}</li>
          <li>Notas del administrador: ${
            requestData.adminNotes || "No hay notas adicionales"
          }</li>
        </ul>
        <p>Puede proceder a retirar los componentes solicitados.</p>
      </div>
    `;
};

const rejectedRequestTemplate = (requestData) => {
  return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Solicitud Rechazada</h2>
        <p>Lamentamos informarle que su solicitud ha sido rechazada.</p>
        <ul>
          <li>Número de solicitud: ${requestData.requestId}</li>
          <li>Fecha de rechazo: ${new Date().toLocaleDateString()}</li>
          <li>Motivo: ${requestData.adminNotes || "No especificado"}</li>
        </ul>
        <p>Si tiene alguna pregunta, por favor contacte al administrador del sistema.</p>
      </div>
    `;
};

const returnReminderTemplate = (loanData) => {
  return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Recordatorio de Devolución</h2>
        <p>Le recordamos que tiene componentes pendientes por devolver:</p>
        <ul>
          <li>Fecha de devolución: ${new Date(
            loanData.returnDate
          ).toLocaleDateString()}</li>
          <li>Componentes: ${loanData.components
            .map((c) => `${c.name} (${c.quantity})`)
            .join(", ")}</li>
        </ul>
        <p>Por favor, asegúrese de realizar la devolución en la fecha indicada.</p>
      </div>
    `;
};

const notReturnedAlertTemplate = (loanData) => {
  return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Alerta de Componentes No Devueltos</h2>
        <p>Tiene componentes que no han sido devueltos en la fecha acordada:</p>
        <ul>
          <li>Fecha límite de devolución: ${new Date(
            loanData.returnDate
          ).toLocaleDateString()}</li>
          <li>Componentes: ${loanData.components
            .map((c) => `${c.name} (${c.quantity})`)
            .join(", ")}</li>
        </ul>
        <p>Por favor, realice la devolución lo antes posible para evitar sanciones.</p>
      </div>
    `;
};

module.exports = {
  newRequestTemplate,
  approvedRequestTemplate,
  rejectedRequestTemplate,
  returnReminderTemplate,
  notReturnedAlertTemplate,
};
