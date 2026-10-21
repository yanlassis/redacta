const path = require('path');
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const { construirIndice, recomendar, ranquearPorSimilaridade } = require('./recomendacao');

const app = express();
const port = process.env.PORT || 3000;

// cfg middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Teste de conexão ao iniciar o servidor
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar ao Supabase:', err.stack);
  } else {
    console.log('Conectado ao banco de dados Supabase com sucesso!');
  }
  if (release) release();
});

// ============================================================================
// MOTOR DE RECOMENDAÇÃO (ver recomendacao.js) + cache da base em memória
// ============================================================================

const TTL_INDICE_MS = 10 * 60 * 1000;
let cacheIndice = null;

// Carrega eixos, temas, teses, repertórios e relações uma vez e reaproveita por alguns minutos
async function obterIndice() {
  if (cacheIndice && Date.now() - cacheIndice.criadoEm < TTL_INDICE_MS) {
    return cacheIndice.promessa;
  }
  const promessa = Promise.all([
    pool.query('SELECT id, nome FROM eixos ORDER BY id ASC'),
    pool.query('SELECT id, titulo, eixo_id FROM temas ORDER BY id ASC'),
    pool.query('SELECT id, descricao FROM argumentos ORDER BY id ASC'),
    pool.query('SELECT id, categoria, conteudo FROM repertorios ORDER BY id ASC'),
    pool.query('SELECT tema_id, argumento_id FROM tema_argumento'),
    pool.query('SELECT argumento_id, repertorio_id FROM argumento_repertorio')
  ]).then(([eixos, temas, argumentos, repertorios, temaArgumento, argumentoRepertorio]) => construirIndice({
    eixos: eixos.rows.map(e => ({ ...e, nome: e.nome.trim() })),
    temas: temas.rows,
    argumentos: argumentos.rows,
    repertorios: repertorios.rows,
    temaArgumento: temaArgumento.rows,
    argumentoRepertorio: argumentoRepertorio.rows
  }));
  cacheIndice = { criadoEm: Date.now(), promessa };
  promessa.catch(() => { cacheIndice = null; });
  return promessa;
}


// ============================================================================
// ROTAS DA API
// ============================================================================

// 1. Rota Inteligente: Recomenda Eixo, Argumentos e Repertórios do banco para QUALQUER tema digitado pelo usuário
app.get('/api/temas/recomendar', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.status(400).json({ erro: 'Informe um tema na query ?q=' });
    }

    const indice = await obterIndice();
    res.json(recomendar(q, indice));
  } catch (error) {
    console.error('Erro na recomendação inteligente:', error);
    res.status(500).json({ erro: 'Erro ao processar recomendação para o tema' });
  }
});

// 2. Rota de busca de temas (suporta match direto e aproximado por palavras-chave)
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

// 3. Rota para listar todos os temas com seus argumentos e repertórios (próprios + relacionados por afinidade no eixo)
app.get('/api/temas', async (req, res) => {
  try {
    const [temasRes, argsRes, repsRes] = await Promise.all([
      pool.query(`
        SELECT t.id, t.titulo, t.eixo_id, e.nome AS eixo
        FROM temas t
        LEFT JOIN eixos e ON t.eixo_id = e.id
        ORDER BY t.id ASC
      `),
      pool.query(`
        SELECT ta.tema_id, a.id, a.descricao, t.titulo AS tema_origem, t.eixo_id
        FROM argumentos a
        JOIN tema_argumento ta ON ta.argumento_id = a.id
        JOIN temas t ON t.id = ta.tema_id
        ORDER BY a.id ASC
      `),
      pool.query(`
        SELECT DISTINCT ta.tema_id, r.id, r.categoria, r.conteudo, t.titulo AS tema_origem, t.eixo_id
        FROM repertorios r
        JOIN argumento_repertorio ar ON ar.repertorio_id = r.id
        JOIN tema_argumento ta ON ta.argumento_id = ar.argumento_id
        JOIN temas t ON t.id = ta.tema_id
        ORDER BY r.id ASC
      `)
    ]);

    const temasCompletos = temasRes.rows.map(tema => {
      const argsDiretos = argsRes.rows
        .filter(a => a.tema_id === tema.id)
        .map(({ id, descricao }) => ({ id, descricao, direto: true }));

      const idsArgsDiretos = new Set(argsDiretos.map(a => a.id));

      // Busca +4 teses relacionadas do mesmo eixo ordenadas por afinidade vocabular com o tema
      const argsCandidatos = argsRes.rows
        .filter(a => a.eixo_id === tema.eixo_id && !idsArgsDiretos.has(a.id));
      const argsRelacionados = ranquearPorSimilaridade(tema.titulo, argsCandidatos, a => [[a.descricao, 1], [a.tema_origem, 1.5]])
        .slice(0, 4)
        .map(({ item: { id, descricao, tema_origem } }) => ({ id, descricao, tema_origem, direto: false }));

      const repsDiretos = repsRes.rows
        .filter(r => r.tema_id === tema.id)
        .map(({ id, categoria, conteudo }) => ({ id, categoria, conteudo, direto: true }));

      const idsRepsDiretos = new Set(repsDiretos.map(r => r.id));

      // Busca +4 repertórios relacionados do mesmo eixo ordenados por afinidade vocabular
      const repsCandidatos = repsRes.rows
        .filter(r => r.eixo_id === tema.eixo_id && !idsRepsDiretos.has(r.id));
      const repsRelacionados = ranquearPorSimilaridade(tema.titulo, repsCandidatos, r => [[r.conteudo, 1], [r.tema_origem, 1.5]])
        .slice(0, 4)
        .map(({ item: { id, categoria, conteudo, tema_origem } }) => ({ id, categoria, conteudo, tema_origem, direto: false }));

      return {
        ...tema,
        argumentos: [...argsDiretos, ...argsRelacionados],
        repertorios: [...repsDiretos, ...repsRelacionados]
      };
    });

    res.json(temasCompletos);
  } catch (erro) {
    console.error('Erro ao buscar temas:', erro);
    res.status(500).json({ erro: 'Falha ao buscar temas' });
  }
});

// 4. Rota para buscar detalhes completos de um tema específico (incluindo teses e repertórios relacionados do eixo)
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

    const [argsDiretosRes, argsEixoRes, repsDiretosRes, repsEixoRes] = await Promise.all([
      pool.query(
        `SELECT a.id, a.descricao
         FROM argumentos a
         JOIN tema_argumento ta ON ta.argumento_id = a.id
         WHERE ta.tema_id = $1
         ORDER BY a.id ASC`,
        [temaId]
      ),
      pool.query(
        `SELECT DISTINCT a.id, a.descricao, t.titulo AS tema_origem
         FROM argumentos a
         JOIN tema_argumento ta ON ta.argumento_id = a.id
         JOIN temas t ON t.id = ta.tema_id
         WHERE t.eixo_id = $1 AND t.id <> $2
         ORDER BY a.id ASC`,
        [tema.eixo_id, temaId]
      ),
      pool.query(
        `SELECT DISTINCT r.id, r.categoria, r.conteudo
         FROM repertorios r
         JOIN argumento_repertorio ar ON ar.repertorio_id = r.id
         JOIN tema_argumento ta ON ta.argumento_id = ar.argumento_id
         WHERE ta.tema_id = $1
         ORDER BY r.id ASC`,
        [temaId]
      ),
      pool.query(
        `SELECT DISTINCT r.id, r.categoria, r.conteudo, t.titulo AS tema_origem
         FROM repertorios r
         JOIN argumento_repertorio ar ON ar.repertorio_id = r.id
         JOIN tema_argumento ta ON ta.argumento_id = ar.argumento_id
         JOIN temas t ON t.id = ta.tema_id
         WHERE t.eixo_id = $1 AND t.id <> $2
         ORDER BY r.id ASC`,
        [tema.eixo_id, temaId]
      )
    ]);

    const idsArgsDiretos = new Set(argsDiretosRes.rows.map(a => a.id));
    const argsRelacionados = ranquearPorSimilaridade(
      tema.titulo,
      argsEixoRes.rows.filter(a => !idsArgsDiretos.has(a.id)).map(a => ({ ...a, direto: false })),
      a => [[a.descricao, 1], [a.tema_origem, 1.5]]
    )
      .map(({ item }) => item)
      .slice(0, 6)
      .map(({ id, descricao, tema_origem, direto }) => ({ id, descricao, tema_origem, direto }));

    const idsRepsDiretos = new Set(repsDiretosRes.rows.map(r => r.id));
    const repsRelacionados = ranquearPorSimilaridade(
      tema.titulo,
      repsEixoRes.rows.filter(r => !idsRepsDiretos.has(r.id)).map(r => ({ ...r, direto: false })),
      r => [[r.conteudo, 1], [r.tema_origem, 1.5]]
    )
      .map(({ item }) => item)
      .slice(0, 6)
      .map(({ id, categoria, conteudo, tema_origem, direto }) => ({ id, categoria, conteudo, tema_origem, direto }));

    res.json({
      ...tema,
      argumentos: [
        ...argsDiretosRes.rows.map(a => ({ ...a, direto: true })),
        ...argsRelacionados
      ],
      repertorios: [
        ...repsDiretosRes.rows.map(r => ({ ...r, direto: true })),
        ...repsRelacionados
      ]
    });
  } catch (erro) {
    console.error('Erro ao buscar detalhes do tema:', erro);
    res.status(500).json({ erro: 'Falha ao buscar detalhes do tema' });
  }
});

// 5. Rota para listar todos os eixos
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

// 6. Rota para listar categorias reais de repertórios existentes no banco
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

// Favoritos: o usuário é um identificador anônimo gerado por navegador (não há autenticação)
const USER_ID_REGEX = /^[A-Za-z0-9_-]{8,100}$/;

function obterUsuarioFavoritos(req) {
  const user = req.query.user || (req.body && req.body.user);
  return typeof user === 'string' && USER_ID_REGEX.test(user) ? user : null;
}

function idInteiro(valor) {
  const n = Number(valor);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// 7. Rota para listar favoritos do usuário
app.get('/api/favoritos', async (req, res) => {
  const user = obterUsuarioFavoritos(req);
  if (!user) return res.status(400).json({ erro: 'Informe um identificador de usuário válido (user)' });
  try {
    const resultado = await pool.query(`
      SELECT f.id as favorito_id, f.tema_id, f.repertorio_id, f.created_at,
             t.titulo as tema_titulo, e.nome as eixo_nome,
             r.categoria as rep_categoria, r.conteudo as rep_conteudo
      FROM favoritos f
      LEFT JOIN temas t ON t.id = f.tema_id
      LEFT JOIN eixos e ON e.id = t.eixo_id
      LEFT JOIN repertorios r ON r.id = f.repertorio_id
      WHERE f.user_identifier = $1
      ORDER BY f.created_at DESC
    `, [user]);
    res.json(resultado.rows);
  } catch (erro) {
    // 42P01: tabela ainda não criada no banco; qualquer outro erro é falha real
    if (erro.code === '42P01') return res.json([]);
    console.error('Erro ao buscar favoritos:', erro);
    res.status(500).json({ erro: 'Falha ao buscar favoritos' });
  }
});

// 8. Rota para adicionar favorito (idempotente: repetir o mesmo favorito não duplica)
app.post('/api/favoritos', async (req, res) => {
  const user = obterUsuarioFavoritos(req);
  if (!user) return res.status(400).json({ erro: 'Informe um identificador de usuário válido (user)' });
  const temaId = idInteiro(req.body.tema_id);
  const repertorioId = idInteiro(req.body.repertorio_id);
  if (!temaId === !repertorioId) {
    return res.status(400).json({ erro: 'Informe exatamente um entre tema_id e repertorio_id' });
  }
  try {
    const inserido = await pool.query(`
      INSERT INTO favoritos (tema_id, repertorio_id, user_identifier)
      VALUES ($1, $2, $3)
      ON CONFLICT DO NOTHING
      RETURNING *
    `, [temaId, repertorioId, user]);
    if (inserido.rows[0]) return res.status(201).json(inserido.rows[0]);
    const existente = await pool.query(`
      SELECT * FROM favoritos
      WHERE user_identifier = $1 AND tema_id IS NOT DISTINCT FROM $2 AND repertorio_id IS NOT DISTINCT FROM $3
    `, [user, temaId, repertorioId]);
    res.status(200).json(existente.rows[0]);
  } catch (erro) {
    if (erro.code === '23503') return res.status(404).json({ erro: 'Tema ou repertório não encontrado' });
    console.error('Erro ao salvar favorito:', erro);
    res.status(500).json({ erro: 'Falha ao salvar favorito' });
  }
});

// 9. Rota para remover favorito: por id do favorito, ou por tema_id/repertorio_id via query. Sempre restrito ao usuário
async function removerFavoritos(res, user, coluna, valor) {
  try {
    const resultado = await pool.query(
      `DELETE FROM favoritos WHERE user_identifier = $1 AND ${coluna} = $2 RETURNING *`,
      [user, valor]
    );
    res.json({ mensagem: 'Favorito removido com sucesso', removidos: resultado.rows });
  } catch (erro) {
    console.error('Erro ao remover favorito:', erro);
    res.status(500).json({ erro: 'Falha ao remover favorito' });
  }
}

app.delete('/api/favoritos/:id', async (req, res) => {
  const user = obterUsuarioFavoritos(req);
  const id = idInteiro(req.params.id);
  if (!user || !id) return res.status(400).json({ erro: 'Parâmetros inválidos' });
  await removerFavoritos(res, user, 'id', id);
});

app.delete('/api/favoritos', async (req, res) => {
  const user = obterUsuarioFavoritos(req);
  const temaId = idInteiro(req.query.tema_id);
  const repertorioId = idInteiro(req.query.repertorio_id);
  if (!user || !temaId === !repertorioId) {
    return res.status(400).json({ erro: 'Informe user e exatamente um entre tema_id e repertorio_id' });
  }
  await removerFavoritos(res, user, temaId ? 'tema_id' : 'repertorio_id', temaId || repertorioId);
});

// Inicialização do servidor (apenas se executado diretamente, permitindo uso como Serverless na Vercel)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}

module.exports = app;
