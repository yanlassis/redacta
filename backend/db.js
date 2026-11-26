const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { Pool } = require('pg');
const { configurarSsl } = require('./ssl');

const ssl = configurarSsl();
if (!ssl.rejectUnauthorized) {
  console.warn('DB_SSL_CA não definido: conexão com o banco criptografada, mas sem verificar o certificado do servidor.');
}

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl
});

module.exports = pool;
