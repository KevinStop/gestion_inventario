const express = require('express');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();
require('./config/passportConfig');
const path = require('path');

const app = express();

const componentRoutes = require('./routes/componentRoutes');
const requestRoutes = require('./routes/requestRoutes');
const requestDetailRoutes = require('./routes/requestDetailRoutes');
const userRoutes = require('./routes/userRoutes');
const loanRoutes = require('./routes/loanRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const componentMovementRoutes = require('./routes/componentMovementRoutes');
const academicPeriodRoutes = require('./routes/academicPeriodRoutes');

// Configuración de archivos estáticos para la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3000;

app.use(express.json());
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Configuración de la sesión
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Inicializamos Passport
app.use(passport.initialize());
app.use(passport.session());

// Ruta para iniciar el login con Google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Ruta de callback después de que Google nos redirija
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Autenticación fallida' });
    }

    // Redirigir con el token
    res.redirect(`http://localhost:4200/login-success?token=${req.user.token}`);
  }
);

// Ruta para obtener la información del usuario logueado
app.get('/profile', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No estás autenticado' });
  }
  res.json(req.user);
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error al cerrar sesión' });
    }
    res.redirect('/');
  });
});

app.use('/components', componentRoutes);
app.use('/users', userRoutes);
app.use('/requests', requestRoutes);
app.use('/request-details', requestDetailRoutes);
app.use('/loans', loanRoutes);
app.use('/categories', categoryRoutes);
app.use('/component-movements', componentMovementRoutes);
app.use('/academic-periods', academicPeriodRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
