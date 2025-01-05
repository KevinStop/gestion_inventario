const express = require('express');
const session = require('express-session');
require('dotenv').config();
const path = require('path');
const cookieParser = require('cookie-parser');
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

app.use(cookieParser());
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

// Rutas de la API
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
