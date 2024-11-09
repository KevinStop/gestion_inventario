const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./config/passport'); // configuración de Passport para Google OAuth

const app = express();

app.disable('x-powered-by');

// Configuración de CORS
const corsOptions = {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configuración de sesiones
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Inicializa Passport y sesiones de autenticación
app.use(passport.initialize());
app.use(passport.session());

// Rutas de autenticación
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/'); // Redireccionar al frontend
  }
);

// Rutas de la API
/* app.use('/api/users', require('./Router/userRoutes'));
app.use('/api/components', require('./Router/componentsRoutes')); */
app.use(require('./Router/userRoutes'));
/* app.use(require('./Router/componentsRoutes'));
app.use(require('./Router/loansRoutes'));
app.use(require('./Router/requestComponentsRoutes'));
app.use(require('./Router/requestRoutes')); */

// Puerto de escucha
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
