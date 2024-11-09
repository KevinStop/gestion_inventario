const mysql = require('mysql');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

const getConnection = (cb) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return cb(err);
        }
        cb(null, connection);
    });
};

module.exports = getConnection;
