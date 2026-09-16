require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

async function checkData() {
  try {
    const res = await pool.query('SELECT * FROM eixos');
    console.log("Eixos:", res.rows);
  } catch (err) {
    console.error(err.message);
  } finally {
    pool.end();
  }
}
checkData();
