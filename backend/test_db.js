const pool = require('./db');

async function checkData() {
  try {
    const res = await pool.query('SELECT * FROM eixos');
    console.log("Eixos:", res.rows);
  } catch (err) {
    console.error("Erro ao consultar o banco:", err.message);
  } finally {
    await pool.end();
  }
}

checkData();
