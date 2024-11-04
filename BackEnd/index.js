const express = require('express');
const app = express();
let cors = require('cors');
const bodyParser = require('body-parser');

app.disable('x-powered-by');
// Configuración de CORS
const corsOptions = {
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Habilita CORS con las opciones configuradas
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(require('./Router/userRoutes'));
app.use(require('./Router/componentsRoutes'));
/* app.use(require('./Router/loansRoutes'));
app.use(require('./Router/requestComponentsRoutes'));
app.use(require('./Router/requestRoutes')); */

app.listen('3000', () => {
    console.log('Server started on port 3000');
});