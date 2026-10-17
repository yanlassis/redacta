const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const port = process.env.PORT || 3000;

// cfg middlewares
app.use(cors());
app.use(express.json());

// Teste de conexão ao iniciar o servidor
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar ao Supabase:', err.stack);
  } else {
    console.log('Conectado ao banco de dados Supabase com sucesso!');
  }
  if (release) release();
});

// Rota de busca de temas (com filtro por título, eixo, argumentos ou repertórios e paginação/limite)
app.get('/api/temas/busca', async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;

    let query = `
      SELECT DISTINCT t.id, t.titulo, t.eixo_id, e.nome AS eixo
      FROM temas t
      JOIN eixos e ON t.eixo_id = e.id
      LEFT JOIN tema_argumento ta ON ta.tema_id = t.id
      LEFT JOIN argumentos a ON a.id = ta.argumento_id
      LEFT JOIN argumento_repertorio ar ON ar.argumento_id = a.id
      LEFT JOIN repertorios r ON r.id = ar.repertorio_id
    `;
    const values = [];

    // Filtro de busca pelo título do tema, nome do eixo, argumento ou repertório
    if (q && q.trim() !== '') {
      query += `
        WHERE t.titulo ILIKE $1
           OR e.nome ILIKE $1
           OR a.descricao ILIKE $1
           OR r.conteudo ILIKE $1
      `;
      values.push(`%${q.trim()}%`);
    }

    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    values.push(parsedLimit);
    query += ` ORDER BY t.id ASC LIMIT $${values.length}`;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro na rota de busca:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// Rota para listar todos os temas
app.get('/api/temas', async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT t.id, t.titulo, t.eixo_id, e.nome AS eixo
      FROM temas t
      LEFT JOIN eixos e ON t.eixo_id = e.id
      ORDER BY t.id ASC
    `);
    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao buscar temas:', erro);
    res.status(500).json({ erro: 'Falha ao buscar temas' });
  }
});

// Rota para buscar detalhes completos de um tema (Eixo, Argumentos e Repertórios)
app.get('/api/temas/:id', async (req, res) => {
  try {
    const temaId = parseInt(req.params.id, 10);
    if (isNaN(temaId)) {
      return res.status(400).json({ erro: 'ID do tema inválido' });
    }

    // 1. Busca o tema e seu eixo
    const temaRes = await pool.query(
      `SELECT t.id, t.titulo, t.eixo_id, e.nome AS eixo
       FROM temas t
       LEFT JOIN eixos e ON t.eixo_id = e.id
       WHERE t.id = $1`,
      [temaId]
    );

    if (temaRes.rows.length === 0) {
      return res.status(404).json({ erro: 'Tema não encontrado' });
    }

    const tema = temaRes.rows[0];

    // 2. Busca os argumentos vinculados ao tema
    const argsRes = await pool.query(
      `SELECT a.id, a.descricao
       FROM argumentos a
       JOIN tema_argumento ta ON ta.argumento_id = a.id
       WHERE ta.tema_id = $1
       ORDER BY a.id ASC`,
      [temaId]
    );

    // 3. Busca os repertórios vinculados aos argumentos deste tema
    const repsRes = await pool.query(
      `SELECT DISTINCT r.id, r.categoria, r.conteudo, ar.argumento_id
       FROM repertorios r
       JOIN argumento_repertorio ar ON ar.repertorio_id = r.id
       JOIN tema_argumento ta ON ta.argumento_id = ar.argumento_id
       WHERE ta.tema_id = $1
       ORDER BY r.id ASC`,
      [temaId]
    );

    res.json({
      ...tema,
      argumentos: argsRes.rows,
      repertorios: repsRes.rows
    });
  } catch (erro) {
    console.error('Erro ao buscar detalhes do tema:', erro);
    res.status(500).json({ erro: 'Falha ao buscar detalhes do tema' });
  }
});

// Rota para listar todos os eixos
app.get('/api/eixos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM eixos ORDER BY id ASC');
    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao buscar eixos:', erro);
    res.status(500).json({ erro: 'Falha ao buscar eixos' });
  }
});

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
