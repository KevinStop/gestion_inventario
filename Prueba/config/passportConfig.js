const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

// Configuración de Passport con la estrategia de Google OAuth 2.0
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Aquí podemos buscar si el usuario existe en la base de datos
        // Si no existe, lo creamos
        let user = await prisma.user.findUnique({
          where: { google_id: profile.id },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              google_id: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              role: 'user', // Por defecto, asignamos el rol 'user'
            },
          });
        }

        // Pasamos el usuario a la función done (pasamos la sesión)
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize and deserialize user (guardar el usuario en la sesión)
passport.serializeUser((user, done) => {
  done(null, user.user_id); // Guardamos el ID del usuario en la sesión
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: id },
    });
    done(null, user); // Recuperamos el usuario desde el ID guardado en la sesión
  } catch (error) {
    done(error, null);
  }
});
