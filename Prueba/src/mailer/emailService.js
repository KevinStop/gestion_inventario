const MailService = require('./mailService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const templates = require('./templates/emailTemplates');

class EmailService {
  static async sendNewRequestNotification(requestId) {
    try {
      const request = await prisma.request.findUnique({
        where: { requestId },
        include: {
          user: true,
          requestDetails: {
            include: {
              component: true
            }
          }
        }
      });

      const adminUsers = await prisma.user.findMany({
        where: { role: 'admin', isActive: true }
      });

      const adminEmails = adminUsers.map(admin => admin.email);
      
      await MailService.enviarCorreo(
        adminEmails,
        'Nueva Solicitud de Componentes',
        templates.newRequestTemplate({
          userName: request.user.name,
          createdAt: request.createdAt,
          typeRequest: request.typeRequest,
          description: request.description
        })
      );
    } catch (error) {
      console.error('Error sending new request notification:', error);
      throw error;
    }
  }

  static async sendRequestApprovalNotification(requestId) {
    try {
      const request = await prisma.request.findUnique({
        where: { requestId },
        include: { user: true }
      });

      await MailService.enviarCorreo(
        request.user.email,
        'Solicitud Aprobada',
        templates.approvedRequestTemplate(request)
      );
    } catch (error) {
      console.error('Error sending approval notification:', error);
      throw error;
    }
  }

  static async sendRequestRejectionNotification(requestId) {
    try {
      const request = await prisma.request.findUnique({
        where: { requestId },
        include: { user: true }
      });

      await MailService.enviarCorreo(
        request.user.email,
        'Solicitud Rechazada',
        templates.rejectedRequestTemplate(request)
      );
    } catch (error) {
      console.error('Error sending rejection notification:', error);
      throw error;
    }
  }

  static async sendReturnReminder(loanId) {
    try {
      const loan = await prisma.loanHistory.findUnique({
        where: { loanId },
        include: {
          user: true,
          component: true,
          request: true
        }
      });

      await MailService.enviarCorreo(
        loan.user.email,
        'Recordatorio de Devolución de Componentes',
        templates.returnReminderTemplate({
          returnDate: loan.request.returnDate,
          components: [{
            name: loan.component.name,
            quantity: 1 // Ajusta según tu lógica de negocio
          }]
        })
      );
    } catch (error) {
      console.error('Error sending return reminder:', error);
      throw error;
    }
  }

  static async sendNotReturnedAlert(loanId) {
    try {
      const loan = await prisma.loanHistory.findUnique({
        where: { loanId },
        include: {
          user: true,
          component: true,
          request: true
        }
      });

      await MailService.enviarCorreo(
        loan.user.email,
        'Alerta: Componentes No Devueltos',
        templates.notReturnedAlertTemplate({
          returnDate: loan.request.returnDate,
          components: [{
            name: loan.component.name,
            quantity: 1 // Ajusta según tu lógica de negocio
          }]
        })
      );
    } catch (error) {
      console.error('Error sending not returned alert:', error);
      throw error;
    }
  }
}

module.exports = EmailService;