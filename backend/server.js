require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

//cfg middlewares
app.use(cors());
app.use(express.json());

//conexao supabase
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

// Teste de conexão ao iniciar o servidor
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar ao Supabase:', err.stack);
  } else {
    console.log('Conectado ao banco de dados Supabase com sucesso!');
  }
  if(release) release();
});


app.get('/api/temas/busca', async (req, res) => {
  try {
    const { q } = req.query;
    
    let query = `
      SELECT t.id, t.titulo, e.nome as eixo
      FROM temas t
      JOIN eixos e ON t.eixo_id = e.id
    `;
    let values = [];

    //filtro de busca pelo titulo
    if (q) {
      query += ` WHERE t.titulo ILIKE $1`;
      values.push(`%${q}%`);
    }

    const result = await pool.query(query, values);
    res.json(result.rows);

  } catch (error) {
    console.error('Erro na rota de busca:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

//inicializacao do server
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
