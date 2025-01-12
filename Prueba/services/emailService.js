// src/services/emailService.js
const transporter = require('../config/emailConfig');

class EmailService {
  // Correo al admin cuando se crea una nueva solicitud
  async sendNewRequestNotification(adminEmail, request, user, components) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: adminEmail,
      subject: 'Nueva Solicitud de Préstamo',
      html: `
        <h1>Nueva Solicitud de Préstamo</h1>
        <p>El usuario ${user.name} ha realizado una nueva solicitud.</p>
        <h2>Detalles de la solicitud:</h2>
        <p>ID de solicitud: ${request.requestId}</p>
        <p>Tipo de solicitud: ${request.typeRequest}</p>
        <p>Descripción: ${request.description || 'No especificada'}</p>
        <h3>Componentes solicitados:</h3>
        <ul>
          ${components.map(comp => `
            <li>${comp.component.name} - Cantidad: ${comp.quantity}</li>
          `).join('')}
        </ul>
        <p>Fecha de solicitud: ${new Date(request.createdAt).toLocaleDateString()}</p>
      `
    };

    return await transporter.sendMail(mailOptions);
  }

  // Correo al usuario cuando se aprueba su solicitud
  async sendLoanApprovalEmail(user, request, components) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: 'Solicitud de Préstamo Aprobada',
      html: `
        <h1>Tu solicitud de préstamo ha sido aprobada</h1>
        <p>Hola ${user.name},</p>
        <p>Nos complace informarte que tu solicitud #${request.requestId} ha sido aprobada.</p>
        <h2>Componentes aprobados:</h2>
        <ul>
          ${components.map(comp => `
            <li>${comp.component.name} - Cantidad: ${comp.quantity}</li>
          `).join('')}
        </ul>
        <p>Fecha de devolución: ${request.returnDate ? new Date(request.returnDate).toLocaleDateString() : 'No especificada'}</p>
        <p>Por favor, asegúrate de devolver los componentes en buen estado y en la fecha indicada.</p>
      `
    };

    return await transporter.sendMail(mailOptions);
  }

  // Correo al usuario cuando se rechaza su solicitud
  async sendLoanRejectionEmail(user, request, adminNotes) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: 'Solicitud de Préstamo Rechazada',
      html: `
        <h1>Actualización de tu solicitud de préstamo</h1>
        <p>Hola ${user.name},</p>
        <p>Lamentamos informarte que tu solicitud #${request.requestId} ha sido rechazada.</p>
        ${adminNotes ? `<p>Motivo: ${adminNotes}</p>` : ''}
        <p>Si tienes alguna duda, por favor contacta con el administrador.</p>
      `
    };

    return await transporter.sendMail(mailOptions);
  }

  // Correo de recordatorio de devolución próxima
  async sendReturnReminderEmail(user, request, components, daysRemaining) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: 'Recordatorio de Devolución Próxima',
      html: `
        <h1>Recordatorio de Devolución</h1>
        <p>Hola ${user.name},</p>
        <p>Te recordamos que los siguientes componentes deben ser devueltos en ${daysRemaining} días:</p>
        <ul>
          ${components.map(comp => `
            <li>${comp.component.name} - Cantidad: ${comp.quantity}</li>
          `).join('')}
        </ul>
        <p>Fecha de devolución: ${request.returnDate ? new Date(request.returnDate).toLocaleDateString() : 'No especificada'}</p>
      `
    };

    return await transporter.sendMail(mailOptions);
  }

  // Correo de alerta de componentes no devueltos
  async sendOverdueNotificationEmail(user, request, components) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: '¡IMPORTANTE! Componentes No Devueltos',
      html: `
        <h1>Componentes Pendientes de Devolución</h1>
        <p>Hola ${user.name},</p>
        <p>Los siguientes componentes de la solicitud #${request.requestId} están pendientes de devolución:</p>
        <ul>
          ${components.map(comp => `
            <li>${comp.component.name} - Cantidad: ${comp.quantity}</li>
          `).join('')}
        </ul>
        <p>La fecha de devolución era: ${request.returnDate ? new Date(request.returnDate).toLocaleDateString() : 'No especificada'}</p>
        <p>Por favor, realiza la devolución lo antes posible para evitar sanciones.</p>
      `
    };

    return await transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailService();