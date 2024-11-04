const express = require('express');
const router = express.Router();
const getConnection = require('../conexion');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('TU_CLIENT_ID_DE_GOOGLE');



module.exports = router;
