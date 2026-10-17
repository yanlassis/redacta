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

// ============================================================================
// MOTOR DE AFINIDADE E ANÁLISE DE TEMAS LIVRES (Baseado 100% no Banco de Dados)
// ============================================================================

const STOPWORDS = new Set([
  'a', 'as', 'o', 'os', 'um', 'uma', 'uns', 'umas', 'de', 'do', 'da', 'dos', 'das',
  'em', 'no', 'na', 'nos', 'nas', 'por', 'pelo', 'pela', 'pelos', 'pelas', 'para',
  'com', 'sem', 'sob', 'sobre', 'entre', 'ate', 'após', 'apos', 'ante', 'contra',
  'e', 'ou', 'mas', 'nem', 'que', 'se', 'como', 'quando', 'onde', 'quem', 'qual',
  'quais', 'cujo', 'cuja', 'cujos', 'cujas', 'seu', 'sua', 'seus', 'suas', 'meu',
  'minha', 'este', 'esta', 'estes', 'estas', 'esse', 'essa', 'esses', 'essas',
  'aquele', 'aquela', 'isto', 'isso', 'aquilo', 'ele', 'ela', 'eles', 'elas',
  'ser', 'estar', 'ter', 'haver', 'fazer', 'ir', 'vir', 'poder', 'dever', 'foi',
  'sao', 'era', 'seria', 'tem', 'mais', 'menos', 'muito', 'muita', 'muitos',
  'muitas', 'pouco', 'pouca', 'todo', 'toda', 'todos', 'todas', 'outro', 'outra',
  'outros', 'outras', 'mesmo', 'mesma', 'ja', 'ainda', 'tambem', 'so', 'nao', 'sim',
  'brasil', 'brasileiro', 'brasileira', 'brasileiros', 'brasileiras', 'pais',
  'nacional', 'contemporaneo', 'contemporanea', 'seculo', 'xxi', 'atual', 'atuais',
  'desafio', 'desafios', 'caminho', 'caminhos', 'combate', 'combater', 'enfrentamento',
  'enfrentar', 'impacto', 'impactos', 'efeito', 'efeitos', 'consequencia', 'consequencias',
  'importancia', 'papel', 'questao', 'problema', 'problemas', 'perspectiva', 'perspectivas',
  'entrave', 'entraves', 'obstaculo', 'obstaculos', 'avanco', 'avancos', 'aumento',
  'crescimento', 'persistencia', 'valorizacao', 'promocao', 'garantia', 'acesso',
  'meio', 'meios', 'forma', 'formas', 'contexto', 'cenario', 'sociedade'
]);

// Mapa de campos semânticos por ID de Eixo do banco para capturar sinônimos do universo do tema
const MAPA_SEMANTICO_EIXOS = {
  1: [ // Saúde Pública e Bioética
    'saude', 'doenca', 'doencas', 'epidemia', 'epidemias', 'pandemia', 'vacina', 'vacinacao',
    'imunizacao', 'hospital', 'hospitais', 'sus', 'medico', 'medica', 'medicos', 'medicina',
    'mental', 'mentais', 'psiquiatria', 'psicologia', 'depressao', 'ansiedade', 'suicidio',
    'manicomio', 'obstetrica', 'parto', 'gestante', 'maternidade', 'nutricao', 'obesidade',
    'saneamento', 'esgoto', 'higienizacao', 'enfermagem', 'paciente', 'pacientes', 'tratamento',
    'terapia', 'farmaco', 'medicamento', 'medicamentos', 'remedio', 'bioetica', 'vida'
  ],
  2: [ // Tecnologia, Ciência e Sociedade Digital
    'tecnologia', 'tecnologico', 'digital', 'digitais', 'internet', 'rede', 'redes', 'sociais',
    'algoritmo', 'algoritmos', 'algoritmica', 'inteligencia', 'artificial', 'ia', 'dados',
    'privacidade', 'vigilancia', 'cibernetico', 'cibernetica', 'virtual', 'virtuais', 'online',
    'aposta', 'apostas', 'bets', 'jogos', 'azar', 'vicio', 'tela', 'telas', 'smartphone',
    'celular', 'computador', 'automacao', 'robos', 'desinformacao', 'fake', 'news', 'deepfake',
    'ciencia', 'cientifico', 'plataforma', 'plataformas', 'big', 'tech', 'techs', 'ciberespaco'
  ],
  3: [ // Educação e Formação Cidadã
    'educacao', 'educacional', 'escola', 'escolas', 'escolar', 'ensino', 'aprendizagem',
    'aluno', 'alunos', 'estudante', 'estudantes', 'professor', 'professores', 'docente',
    'docentes', 'magisterio', 'pedagogia', 'pedagogico', 'aula', 'aulas', 'curriculo',
    'universidade', 'faculdade', 'alfabetizacao', 'letramento', 'evasao', 'abandono',
    'creche', 'infantil', 'fundamental', 'medio', 'neurodivergente', 'neurodivergentes',
    'autismo', 'autista', 'tdah', 'inclusao', 'inclusiva', 'didatico', 'formacao', 'leitura'
  ],
  4: [ // Meio Ambiente, Clima e Território
    'ambiente', 'ambiental', 'ambientais', 'meio', 'natureza', 'ecologia', 'ecologico',
    'clima', 'climatico', 'climaticos', 'climatica', 'aquecimento', 'global', 'efeito', 'estufa',
    'amazonia', 'floresta', 'florestas', 'bioma', 'biomas', 'pantanal', 'cerrado', 'caatinga',
    'mata', 'atlantica', 'queimada', 'queimadas', 'incendio', 'incendios', 'fogo', 'desmatamento',
    'desflorestamento', 'garimpo', 'mineracao', 'mercurio', 'poluicao', 'plastico', 'lixo',
    'residuo', 'residuos', 'reciclagem', 'agua', 'hidrica', 'hidrico', 'seca', 'estiagem',
    'enchente', 'enchentes', 'inundacao', 'desastre', 'desastres', 'sustentavel', 'sustentabilidade',
    'energia', 'renovavel', 'transicao', 'energetica', 'fauna', 'flora', 'biodiversidade',
    'indigena', 'indigenas', 'originarios', 'terra', 'terras', 'demarcacao', 'agrotoxico', 'rios'
  ],
  5: [ // Cidadania, Direitos Humanos e Minorias
    'cidadania', 'cidadao', 'direito', 'direitos', 'humanos', 'minoria', 'minorias', 'mulher',
    'mulheres', 'feminino', 'feminina', 'genero', 'machismo', 'patriarcado', 'cuidado',
    'materno', 'idoso', 'idosos', 'velhice', 'envelhecimento', 'etarismo', 'terceira', 'idade',
    'rua', 'morador', 'moradores', 'arquitetura', 'hostil', 'invisibilidade', 'registro',
    'civil', 'documento', 'certidao', 'deficiencia', 'pcd', 'acessibilidade', 'capacitismo',
    'racismo', 'racial', 'negro', 'negra', 'negros', 'negras', 'preto', 'lgbt', 'lgbtqia',
    'homofobia', 'transfobia', ' intolerancia', 'dignidade', 'vulnerabilidade', 'exclusao'
  ],
  6: [ // Cultura, Memória e Identidade Nacional
    'cultura', 'cultural', 'culturais', 'arte', 'artistico', 'artistica', 'patrimonio',
    'historico', 'memoria', 'museu', 'museus', 'acervo', 'monumento', 'identidade',
    'lingua', 'linguagem', 'linguistico', 'sotaque', 'gramatica', 'idioma', 'falar',
    'quilombola', 'quilombolas', 'quilombo', 'ribeirinho', 'ribeirinhas', 'tradicional',
    'tradicionais', 'ancestral', 'ancestralidade', 'folclore', 'cinema', 'teatro', 'musica',
    'literatura', 'livro', 'livros', 'biblioteca', 'iphan', 'imaterial', 'material', 'colonial'
  ],
  7: [ // Trabalho, Economia e Desigualdade
    'trabalho', 'trabalhador', 'trabalhadores', 'laboral', 'emprego', 'desemprego', 'renda',
    'salario', 'economia', 'economico', 'economica', 'desigualdade', 'pobreza', 'miseria',
    'fome', 'alimentar', 'alimento', 'alimentos', 'inseguranca', 'nutricional', 'agronegocio',
    'agricultura', 'familiar', 'latifundio', 'campo', 'rural', 'escravo', 'escravidao',
    'analogo', 'servidao', 'precarizacao', 'uberizacao', 'aplicativo', 'aplicativos',
    'entregador', 'entregadores', 'motorista', 'informal', 'informalidade', 'previdencia',
    'aposentadoria', 'clt', 'terceirizacao', 'exploracao', 'consumo', 'endividamento', 'inflacao'
  ],
  8: [ // Segurança Pública, Justiça e Democracia
    'seguranca', 'publica', 'violencia', 'crime', 'criminalidade', 'policia', 'policial',
    'policiais', 'letalidade', 'camera', 'cameras', 'corporais', 'farda', 'armas',
    'prisao', 'prisoes', 'presidio', 'presidios', 'penitenciario', 'carcerario', 'encarceramento',
    'detento', 'detentos', 'preso', 'presos', 'ressocializacao', 'reincidencia', 'penal',
    'justica', 'judiciario', 'lei', 'leis', 'impunidade', 'democracia', 'democratico',
    'politica', 'politico', 'parlamento', 'eleicao', 'eleicoes', 'voto', 'representatividade',
    'corrupcao', 'estado', 'direito', 'constitucional', 'stf', 'direitos', 'milicia', 'faccao',
    'desaparecido', 'desaparecidos', 'jornalismo', 'imprensa', 'restaurativa'
  ],
  9: [ // Infância, Juventude e Relações Familiares
    'infancia', 'infantil', 'crianca', 'criancas', 'adolescente', 'adolescentes', 'adolescencia',
    'juventude', 'jovem', 'jovens', 'familia', 'familiar', 'familiares', 'paterno', 'paternidade',
    'pai', 'mae', 'maes', 'solo', 'maternidade', 'gravidez', 'precoce', 'orfandade', 'orfao',
    'orfaos', 'adocao', 'abrigo', 'acolhimento', 'parental', 'isolamento', 'hikikomori', 'brincar',
    'eca', 'estatuto', 'menor', 'menores'
  ],
  10: [ // Mobilidade Urbana, Habitação e Direito à Cidade
    'mobilidade', 'urbana', 'urbano', 'urbanas', 'urbanos', 'cidade', 'cidades', 'metropole',
    'metropoles', 'transporte', 'onibus', 'metro', 'tarifa', 'zero', 'transito', 'motociclista',
    'motociclistas', 'moto', 'acidente', 'sinistro', 'habitacao', 'habitacional', 'moradia',
    'teto', 'aluguel', 'gentrificacao', 'imobiliaria', 'especulacao', 'imovel', 'imoveis',
    'calor', 'arborizacao', 'arvore', 'arvores', 'iluminacao', 'calcada', 'espaco', 'publico'
  ]
};

function normalizarTexto(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extrairTokens(texto) {
  const norm = normalizarTexto(texto);
  if (!norm) return [];
  return norm.split(' ').filter(w => w.length > 2 && !STOPWORDS.has(w));
}

function extrairRadicais(tokens) {
  return tokens.map(t => (t.length >= 6 ? t.slice(0, 5) : t));
}

// Calcula pontuação de afinidade entre os tokens do usuário e um texto do banco
function pontuarTexto(textoAlvo, tokensUsuario, radicaisUsuario) {
  const normAlvo = normalizarTexto(textoAlvo);
  const palavrasAlvo = normAlvo.split(' ');
  let pontos = 0;
  const termosEncontrados = new Set();

  tokensUsuario.forEach((token, idx) => {
    const radical = radicaisUsuario[idx];
    if (palavrasAlvo.includes(token)) {
      pontos += 12; // Match exato de palavra
      termosEncontrados.add(token);
    } else if (radical.length >= 4 && palavrasAlvo.some(p => p.startsWith(radical) || radical.startsWith(p.slice(0, 5)))) {
      pontos += 7; // Match de radical morfológico (ex: queimadas <-> queima, ambiental <-> ambiente, ilegal <-> ilegalmente)
      termosEncontrados.add(token);
    }
  });

  return { pontos, termosEncontrados: Array.from(termosEncontrados) };
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

    const temaUsuario = q.trim();
    const tokensUsuario = extrairTokens(temaUsuario);
    const radicaisUsuario = extrairRadicais(tokensUsuario);

    // Carrega todos os dados reais do banco
    const [eixosRes, temasRes, argsRes, repsRes] = await Promise.all([
      pool.query('SELECT id, nome FROM eixos ORDER BY id ASC'),
      pool.query(`
        SELECT t.id, t.titulo, t.eixo_id, e.nome AS eixo
        FROM temas t
        LEFT JOIN eixos e ON t.eixo_id = e.id
        ORDER BY t.id ASC
      `),
      pool.query(`
        SELECT a.id, a.descricao, t.id AS tema_id, t.titulo AS tema_titulo, t.eixo_id, e.nome AS eixo_nome
        FROM argumentos a
        JOIN tema_argumento ta ON ta.argumento_id = a.id
        JOIN temas t ON t.id = ta.tema_id
        LEFT JOIN eixos e ON e.id = t.eixo_id
      `),
      pool.query(`
        SELECT DISTINCT r.id, r.categoria, r.conteudo, t.id AS tema_id, t.titulo AS tema_titulo, t.eixo_id, e.nome AS eixo_nome
        FROM repertorios r
        JOIN argumento_repertorio ar ON ar.repertorio_id = r.id
        JOIN tema_argumento ta ON ta.argumento_id = ar.argumento_id
        JOIN temas t ON t.id = ta.tema_id
        LEFT JOIN eixos e ON e.id = t.eixo_id
      `)
    ]);

    // 1.1 Pontua os Eixos Temáticos (combinando nome do eixo + mapa semântico)
    const pontuacaoEixos = {};
    eixosRes.rows.forEach(eixo => {
      const { pontos: ptsNome } = pontuarTexto(eixo.nome, tokensUsuario, radicaisUsuario);
      const palavrasCampo = (MAPA_SEMANTICO_EIXOS[eixo.id] || []).join(' ');
      const { pontos: ptsCampo } = pontuarTexto(palavrasCampo, tokensUsuario, radicaisUsuario);
      pontuacaoEixos[eixo.id] = ptsNome * 2 + ptsCampo;
    });

    // 1.2 Pontua todos os Temas do banco para achar os temas-irmãos mais próximos
    const temasPontuados = temasRes.rows.map(t => {
      const { pontos: ptsTitulo, termosEncontrados } = pontuarTexto(t.titulo, tokensUsuario, radicaisUsuario);
      const bonusEixo = (pontuacaoEixos[t.eixo_id] || 0) * 0.6;
      return {
        ...t,
        score: ptsTitulo * 2.5 + bonusEixo,
        termosEncontrados
      };
    }).sort((a, b) => b.score - a.score);

    // Identifica o Eixo Principal mais compatível
    const melhorTema = temasPontuados[0];
    const eixoPrincipalId = melhorTema && melhorTema.score > 0 ? melhorTema.eixo_id : 1;
    const eixoPrincipalNome = (eixosRes.rows.find(e => e.id === eixoPrincipalId) || {}).nome || 'Geral';

    // Verifica se o tema digitado já existe exatamente no banco
    const matchExato = temasRes.rows.find(
      t => normalizarTexto(t.titulo) === normalizarTexto(temaUsuario)
    );

    // 1.3 Pontua todos os Argumentos do banco para selecionar os mais adequados ao tema do usuário
    const argumentosUnicos = new Map();
    argsRes.rows.forEach(arg => {
      const { pontos: ptsDesc } = pontuarTexto(arg.descricao, tokensUsuario, radicaisUsuario);
      const { pontos: ptsTema } = pontuarTexto(arg.tema_titulo, tokensUsuario, radicaisUsuario);
      const bonusEixo = arg.eixo_id === eixoPrincipalId ? 15 : (pontuacaoEixos[arg.eixo_id] || 0) * 0.4;
      const scoreTotal = ptsDesc * 2 + ptsTema * 1.5 + bonusEixo;

      if (!argumentosUnicos.has(arg.id) || argumentosUnicos.get(arg.id).score < scoreTotal) {
        argumentosUnicos.set(arg.id, {
          id: arg.id,
          descricao: arg.descricao,
          tema_origem_id: arg.tema_id,
          tema_origem: arg.tema_titulo,
          eixo: arg.eixo_nome,
          score: scoreTotal
        });
      }
    });

    const argumentosRecomendados = Array.from(argumentosUnicos.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    // 1.4 Pontua todos os Repertórios do banco para selecionar os mais pertinentes
    const repertoriosUnicos = new Map();
    repsRes.rows.forEach(rep => {
      const { pontos: ptsConteudo } = pontuarTexto(rep.conteudo, tokensUsuario, radicaisUsuario);
      const { pontos: ptsTema } = pontuarTexto(rep.tema_titulo, tokensUsuario, radicaisUsuario);
      const bonusEixo = rep.eixo_id === eixoPrincipalId ? 15 : (pontuacaoEixos[rep.eixo_id] || 0) * 0.4;
      const scoreTotal = ptsConteudo * 2 + ptsTema * 1.5 + bonusEixo;

      if (!repertoriosUnicos.has(rep.id) || repertoriosUnicos.get(rep.id).score < scoreTotal) {
        repertoriosUnicos.set(rep.id, {
          id: rep.id,
          categoria: rep.categoria,
          conteudo: rep.conteudo,
          tema_origem_id: rep.tema_id,
          tema_origem: rep.tema_titulo,
          eixo: rep.eixo_nome,
          score: scoreTotal
        });
      }
    });

    const repertoriosRecomendados = Array.from(repertoriosUnicos.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    // Temas correlatos do banco que ajudam o aluno
    const temasCorrelatos = temasPontuados
      .filter(t => t.score > 0 || t.eixo_id === eixoPrincipalId)
      .slice(0, 3)
      .map(({ id, titulo, eixo_id, eixo }) => ({ id, titulo, eixo_id, eixo }));

    res.json({
      tema_pesquisado: temaUsuario,
      existe_exato: Boolean(matchExato),
      tema_exato_id: matchExato ? matchExato.id : null,
      eixo_id: eixoPrincipalId,
      eixo_sugerido: eixoPrincipalNome,
      palavras_chave_identificadas: tokensUsuario,
      argumentos: argumentosRecomendados,
      repertorios: repertoriosRecomendados,
      temas_correlatos: temasCorrelatos
    });
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

// 3. Rota para listar todos os temas com seus argumentos e repertórios diretamente do banco
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

// 4. Rota para buscar detalhes completos de um tema específico
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

// Inicialização do servidor (apenas se executado diretamente, permitindo uso como Serverless na Vercel)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}

module.exports = app;
