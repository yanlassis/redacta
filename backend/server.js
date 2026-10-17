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
    const { q, eixo_id, limit = 20 } = req.query;

    let query = `
      SELECT DISTINCT t.id, t.titulo, t.eixo_id, e.nome AS eixo
      FROM temas t
      LEFT JOIN eixos e ON t.eixo_id = e.id
      LEFT JOIN tema_argumento ta ON ta.tema_id = t.id
      LEFT JOIN argumentos a ON a.id = ta.argumento_id
      LEFT JOIN argumento_repertorio ar ON ar.argumento_id = a.id
      LEFT JOIN repertorios r ON r.id = ar.repertorio_id
    `;
    const conditions = [];
    const values = [];

    // Filtro de busca por texto
    if (q && q.trim() !== '') {
      values.push(`%${q.trim()}%`);
      const idx = values.length;
      conditions.push(`(
        t.titulo ILIKE $${idx}
        OR e.nome ILIKE $${idx}
        OR a.descricao ILIKE $${idx}
        OR r.conteudo ILIKE $${idx}
        OR r.categoria ILIKE $${idx}
      )`);
    }

    // Filtro opcional por eixo_id
    if (eixo_id && !isNaN(parseInt(eixo_id, 10))) {
      values.push(parseInt(eixo_id, 10));
      conditions.push(`t.eixo_id = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
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

// Rota para listar todos os temas com seus argumentos e repertórios diretamente do banco
app.get('/api/temas', async (req, res) => {
  try {
    const temasRes = await pool.query(`
      SELECT t.id, t.titulo, t.eixo_id, e.nome AS eixo
      FROM temas t
      LEFT JOIN eixos e ON t.eixo_id = e.id
      ORDER BY t.id ASC
    `);

    const argsRes = await pool.query(`
      SELECT ta.tema_id, a.id, a.descricao
      FROM argumentos a
      JOIN tema_argumento ta ON ta.argumento_id = a.id
      ORDER BY a.id ASC
    `);

    const repsRes = await pool.query(`
      SELECT DISTINCT ta.tema_id, r.id, r.categoria, r.conteudo
      FROM repertorios r
      JOIN argumento_repertorio ar ON ar.repertorio_id = r.id
      JOIN tema_argumento ta ON ta.argumento_id = ar.argumento_id
      ORDER BY r.id ASC
    `);

    const temasCompletos = temasRes.rows.map(tema => ({
      ...tema,
      argumentos: argsRes.rows
        .filter(a => a.tema_id === tema.id)
        .map(({ id, descricao }) => ({ id, descricao })),
      repertorios: repsRes.rows
        .filter(r => r.tema_id === tema.id)
        .map(({ id, categoria, conteudo }) => ({ id, categoria, conteudo }))
    }));

    res.json(temasCompletos);
  } catch (erro) {
    console.error('Erro ao buscar temas:', erro);
    res.status(500).json({ erro: 'Falha ao buscar temas' });
  }
});

// Rota para buscar detalhes completos de um tema específico (Eixo, Argumentos e Repertórios)
app.get('/api/temas/:id', async (req, res) => {
  try {
    const temaId = parseInt(req.params.id, 10);
    if (isNaN(temaId)) {
      return res.status(400).json({ erro: 'ID do tema inválido' });
    }

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

    const argsRes = await pool.query(
      `SELECT a.id, a.descricao
       FROM argumentos a
       JOIN tema_argumento ta ON ta.argumento_id = a.id
       WHERE ta.tema_id = $1
       ORDER BY a.id ASC`,
      [temaId]
    );

    const repsRes = await pool.query(
      `SELECT DISTINCT r.id, r.categoria, r.conteudo
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

// Rota para listar todos os eixos com contagem real de temas, argumentos e repertórios no banco
app.get('/api/eixos', async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT
        e.id,
        e.nome,
        COUNT(DISTINCT t.id)::int AS total_temas,
        COUNT(DISTINCT a.id)::int AS total_argumentos,
        COUNT(DISTINCT r.id)::int AS total_repertorios
      FROM eixos e
      LEFT JOIN temas t ON t.eixo_id = e.id
      LEFT JOIN tema_argumento ta ON ta.tema_id = t.id
      LEFT JOIN argumentos a ON a.id = ta.argumento_id
      LEFT JOIN argumento_repertorio ar ON ar.argumento_id = a.id
      LEFT JOIN repertorios r ON r.id = ar.repertorio_id
      GROUP BY e.id, e.nome
      ORDER BY e.id ASC
    `);
    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao buscar eixos:', erro);
    res.status(500).json({ erro: 'Falha ao buscar eixos' });
  }
});

// Rota para listar categorias reais de repertórios existentes no banco
app.get('/api/categorias', async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT DISTINCT categoria
      FROM repertorios
      WHERE categoria IS NOT NULL AND TRIM(categoria) <> ''
      ORDER BY categoria ASC
    `);
    res.json(resultado.rows.map(r => r.categoria));
  } catch (erro) {
    console.error('Erro ao buscar categorias:', erro);
    res.status(500).json({ erro: 'Falha ao buscar categorias' });
  }
});

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
