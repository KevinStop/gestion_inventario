const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken'); // Importamos JWT
require('dotenv').config();

const prisma = new PrismaClient();

// Configuración de Passport con la estrategia de Google OAuth 2.0
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      if (!profile.id) {
        return done(new Error('No se pudo obtener el ID de Google'), null);
      }
      try {
        // Buscar si el usuario existe en la base de datos
        let user = await prisma.user.findUnique({
          where: { google_id: profile.id },
        });

        if (!user) {
          // Si el usuario no existe, lo creamos
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              role: 'user',
              imageUrl: profile.photos ? profile.photos[0].value : null,
            },
          });
        }

        // Generar JWT después de la autenticación exitosa
        const token = jwt.sign(
          { userId: user.userId, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        // Añadir el token al perfil del usuario
        user.token = token;

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize and deserialize user (guardar el usuario en la sesión)
passport.serializeUser((user, done) => {
  done(null, user.userId); // Guardamos el ID del usuario en la sesión
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { userId: id },
    });
    done(null, user); // Recuperamos el usuario desde el ID guardado en la sesión
  } catch (error) {
    done(error, null);
  }
});
