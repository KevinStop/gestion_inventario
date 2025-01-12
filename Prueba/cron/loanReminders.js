// src/cron/loanReminders.js
const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const emailService = require('../services/emailService');
const prisma = new PrismaClient();

// Ejecutar cada día a las 9:00 AM
cron.schedule('0 9 * * *', async () => {
  try {
    // Buscar préstamos próximos a vencer (3 días antes)
    const upcomingReturns = await prisma.request.findMany({
      where: {
        status: 'prestamo',
        returnDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        }
      },
      include: {
        user: true,
        requestDetails: {
          include: {
            component: true
          }
        }
      }
    });

    // Enviar recordatorios
    for (const request of upcomingReturns) {
      const daysRemaining = Math.ceil((request.returnDate - new Date()) / (1000 * 60 * 60 * 24));
      await emailService.sendReturnReminderEmail(
        request.user,
        request,
        request.requestDetails,
        daysRemaining
      );
    }

    // Buscar préstamos no devueltos
    const overdueLoans = await prisma.request.findMany({
      where: {
        status: 'prestamo',
        returnDate: {
          lt: new Date()
        }
      },
      include: {
        user: true,
        requestDetails: {
          include: {
            component: true
          }
        }
      }
    });

    // Enviar alertas de no devolución
    for (const request of overdueLoans) {
      await emailService.sendOverdueNotificationEmail(
        request.user,
        request,
        request.requestDetails
      );
    }
  } catch (error) {
    console.error('Error en las tareas programadas de préstamos:', error);
  }
});