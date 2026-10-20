// ============================================================================
// MOTOR DE RECOMENDAÇÃO DE TEMAS LIVRES (Baseado 100% no Banco de Dados)
// Tokenização + radicais em português + BM25 + limiares de relevância
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
    'homofobia', 'transfobia', 'intolerancia', 'dignidade', 'vulnerabilidade', 'exclusao'
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

// Palavras genéricas de propostas de redação que não ajudam a identificar o assunto
const STOPWORDS_EXTRAS = [
  'uso', 'usos', 'relacao', 'relacoes', 'necessidade', 'necessidades', 'pessoa', 'pessoas',
  'populacao', 'social', 'sociais', 'publico', 'publica', 'publicos', 'publicas', 'maneira',
  'modo', 'aspecto', 'aspectos', 'fator', 'fatores', 'tema', 'debate', 'discussao', 'atualidade',
  'hoje', 'dia', 'dias', 'ano', 'anos', 'vez', 'vezes', 'cada', 'tal', 'tais', 'pelo', 'cerca',
  'estao', 'esta', 'sendo', 'feito', 'feita', 'gera', 'geram', 'causa', 'causas', 'dentro',
  'diante', 'frente', 'partir', 'atraves', 'durante', 'demais', 'qualquer', 'nosso', 'nossa',
  'grande', 'grandes', 'novo', 'nova', 'novos', 'novas', 'alguns', 'algumas', 'formacao'
];
STOPWORDS_EXTRAS.forEach(p => STOPWORDS.add(p));

function normalizarTexto(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extrairTokens(texto) {
  const norm = normalizarTexto(texto);
  if (!norm) return [];
  return norm.split(' ').filter(w => w.length > 2 && !STOPWORDS.has(w) && !/^\d+$/.test(w));
}

// ----------------------------------------------------------------------------
// Stemmer leve para português (inspirado no RSLP): reduz flexões e derivações
// comuns ao mesmo radical, ex.: desmatamento/desmatar -> "desmat", idosos -> "idos"
// ----------------------------------------------------------------------------
const REGRAS_PLURAL = [
  ['oes', 'ao'], ['aes', 'ao'], ['ais', 'al'], ['eis', 'el'], ['ois', 'ol'],
  ['res', 'r'], ['zes', 'z'], ['ses', 's'], ['ns', 'm']
];

const SUFIXOS_DERIVACAO = [
  'acional', 'izacao', 'amento', 'imento', 'idade', 'mente', 'acao', 'icao', 'ucao', 'encia', 'ancia',
  'mento', 'ismo', 'ista', 'avel', 'ivel', 'ador', 'edor', 'idor', 'ante', 'ente', 'inte',
  'oso', 'osa', 'ico', 'ica', 'izar', 'ecer', 'cao', 'ar', 'er', 'ir'
];

const TAMANHO_MIN_RADICAL = 4;
const cacheRadicais = new Map();

function radical(palavra) {
  if (cacheRadicais.has(palavra)) return cacheRadicais.get(palavra);
  let r = palavra;

  if (r.length > 4) {
    let trocou = false;
    for (const [suf, troca] of REGRAS_PLURAL) {
      if (r.endsWith(suf) && r.length - suf.length + troca.length >= TAMANHO_MIN_RADICAL) {
        r = r.slice(0, -suf.length) + troca;
        trocou = true;
        break;
      }
    }
    if (!trocou && r.endsWith('s') && !r.endsWith('ss')) r = r.slice(0, -1);
  }

  for (const suf of SUFIXOS_DERIVACAO) {
    // "-mento" só sai de radicais longos, para não juntar medicamento com médico
    const minimo = suf === 'mento' ? 7 : suf.endsWith('mento') ? 6 : TAMANHO_MIN_RADICAL;
    if (r.endsWith(suf) && r.length - suf.length >= minimo) {
      r = r.slice(0, -suf.length);
      break;
    }
  }

  if (r.length > TAMANHO_MIN_RADICAL && /[aeo]$/.test(r)) r = r.slice(0, -1);

  cacheRadicais.set(palavra, r);
  return r;
}

function extrairRadicais(texto) {
  return extrairTokens(texto).map(radical);
}

// ----------------------------------------------------------------------------
// BM25: pontua documentos pela raridade dos termos em comum com a consulta
// ----------------------------------------------------------------------------
const BM25_K1 = 1.2;
const BM25_B = 0.75;

// campos: [[texto, peso], ...] -> Map(radical -> frequência ponderada)
function criarDocumento(campos) {
  const termos = new Map();
  let tamanho = 0;
  campos.forEach(([texto, peso]) => {
    extrairRadicais(texto).forEach(r => {
      termos.set(r, (termos.get(r) || 0) + peso);
      tamanho += peso;
    });
  });
  return { termos, tamanho };
}

function criarColecao(documentos) {
  const df = new Map();
  let somaTamanhos = 0;
  documentos.forEach(doc => {
    somaTamanhos += doc.tamanho;
    doc.termos.forEach((_, termo) => df.set(termo, (df.get(termo) || 0) + 1));
  });
  const n = documentos.length;
  const idf = new Map();
  df.forEach((freq, termo) => idf.set(termo, Math.log(1 + (n - freq + 0.5) / (freq + 0.5))));
  return { documentos, idf, tamanhoMedio: n ? somaTamanhos / n : 1 };
}

// Sinônimos e termos vizinhos para palavras comuns em propostas que a base escreve de outro jeito.
// A expansão vale menos que o termo original (PESO_SINONIMO).
const SINONIMOS = {
  fakenews: ['desinformacao', 'boato', 'noticia'],
  redessociais: ['plataforma', 'digital', 'algoritmo', 'algoritmica', 'online', 'virtual'],
  boato: ['desinformacao'],
  mentira: ['desinformacao'],
  eleicao: ['eleitoral', 'voto', 'democracia'],
  eleicoes: ['eleitoral', 'voto', 'democracia'],
  eleitor: ['eleitoral', 'voto'],
  gordofobia: ['obesidade', 'corpo', 'emagrecimento', 'estetica'],
  obesidade: ['alimentar', 'nutricao'],
  anabolizante: ['medicamento', 'estetica', 'esteroide'],
  anabolizantes: ['medicamento', 'estetica', 'esteroide'],
  academia: ['corpo', 'exercicio'],
  academias: ['corpo', 'exercicio'],
  racismo: ['racial', 'racista', 'negro', 'negra'],
  esporte: ['lazer', 'exercicio'],
  emagrecer: ['medicamento', 'corpo', 'obesidade'],
  solidao: ['isolamento', 'abandono'],
  isolamento: ['solidao'],
  drogas: ['dependencia', 'vicio', 'entorpecente'],
  alcool: ['dependencia', 'vicio'],
  alcoolismo: ['dependencia', 'vicio'],
  celular: ['smartphone', 'tela', 'digital'],
  bullying: ['violencia', 'escolar', 'intimidacao'],
  cyberbullying: ['violencia', 'digital', 'intimidacao'],
  feminicidio: ['violencia', 'mulher', 'genero'],
  machismo: ['genero', 'mulher', 'patriarcado'],
  homofobia: ['lgbt', 'lgbtqia', 'preconceito'],
  transfobia: ['lgbt', 'lgbtqia', 'preconceito'],
  preconceito: ['discriminacao', 'estigma'],
  discriminacao: ['preconceito', 'estigma'],
  favela: ['periferia', 'periferico', 'comunidade'],
  periferia: ['periferico', 'favela'],
  idosos: ['envelhecimento', 'velhice', 'etarismo'],
  idoso: ['envelhecimento', 'velhice', 'etarismo'],
  velhice: ['envelhecimento', 'idoso'],
  imigrantes: ['refugiado', 'migracao', 'xenofobia'],
  imigracao: ['refugiado', 'migracao', 'xenofobia'],
  refugiados: ['migracao', 'xenofobia'],
  lixo: ['residuo', 'reciclagem'],
  agua: ['hidrica', 'saneamento'],
  queimadas: ['incendio', 'fogo', 'desmatamento'],
  aquecimento: ['clima', 'climatica'],
  ansiedade: ['saude', 'mental', 'psiquico'],
  depressao: ['saude', 'mental', 'psiquico'],
  suicidio: ['saude', 'mental'],
  fome: ['inseguranca', 'alimentar'],
  miseria: ['pobreza', 'desigualdade'],
  pobreza: ['desigualdade', 'renda'],
  desemprego: ['trabalho', 'renda', 'informalidade'],
  armas: ['violencia', 'letalidade'],
  presos: ['carcerario', 'prisional', 'encarceramento'],
  cadeia: ['carcerario', 'prisional', 'encarceramento'],
  leitura: ['letramento', 'leitor', 'livro'],
  analfabetismo: ['alfabetizacao', 'letramento'],
  internet: ['digital', 'conectividade'],
  ia: ['inteligencia', 'artificial', 'algoritmo'],
  jogos: ['apostas', 'bets', 'vicio']
};
const PESO_SINONIMO = 0.6;

// Expressões de duas palavras tratadas como um termo só antes da tokenização
const EXPRESSOES = [
  [/\bfake news\b/g, 'fakenews'],
  [/\bredes sociais\b/g, 'redessociais'],
  [/\bmidias sociais\b/g, 'redessociais']
];

function juntarExpressoes(textoNormalizado) {
  return EXPRESSOES.reduce((t, [re, junto]) => t.replace(re, junto), textoNormalizado);
}

// Consulta = lista de termos; cada termo tem o radical original e radicais alternativos (sinônimos)
function prepararConsulta(texto) {
  const vistos = new Set();
  const termos = [];
  extrairTokens(juntarExpressoes(normalizarTexto(texto))).forEach(token => {
    const principal = radical(token);
    if (vistos.has(principal)) return;
    vistos.add(principal);
    const alternativas = [...new Set((SINONIMOS[token] || []).map(radical))].filter(r => r !== principal);
    termos.push({ principal, alternativas });
  });
  return termos;
}

function pontuarTermo(colecao, doc, termo) {
  const tf = doc.termos.get(termo);
  if (!tf) return 0;
  const idf = colecao.idf.get(termo) || 0;
  const normalizacao = 1 - BM25_B + BM25_B * (doc.tamanho / colecao.tamanhoMedio);
  return idf * (tf * (BM25_K1 + 1)) / (tf + BM25_K1 * normalizacao);
}

// Retorna { score, cobertura } de um documento para os termos da consulta
function pontuarDocumento(colecao, doc, termosConsulta) {
  let score = 0;
  let cobertos = 0;
  termosConsulta.forEach(({ principal, alternativas }) => {
    const direto = pontuarTermo(colecao, doc, principal);
    const viaSinonimo = alternativas.reduce((m, alt) => Math.max(m, pontuarTermo(colecao, doc, alt)), 0) * PESO_SINONIMO;
    const melhor = Math.max(direto, viaSinonimo);
    if (melhor > 0) {
      score += melhor;
      // Termo achado só por sinônimo conta parcialmente na cobertura
      cobertos += direto >= viaSinonimo ? 1 : PESO_SINONIMO;
    }
  });
  const cobertura = termosConsulta.length ? cobertos / termosConsulta.length : 0;
  // Favorece documentos que cobrem mais palavras distintas do tema pesquisado
  return { score: score * (0.4 + 0.6 * cobertura), cobertura };
}

// Ordena itens arbitrários por similaridade com uma consulta (usado nos correlatos do catálogo)
function ranquearPorSimilaridade(consulta, itens, camposDe) {
  const termosConsulta = prepararConsulta(consulta);
  const docs = itens.map(item => criarDocumento(camposDe(item)));
  const colecao = criarColecao(docs);
  return itens
    .map((item, i) => ({ item, score: pontuarDocumento(colecao, docs[i], termosConsulta).score }))
    .sort((a, b) => b.score - a.score || a.item.id - b.item.id);
}

// ----------------------------------------------------------------------------
// Índice da base (eixos, temas, teses e repertórios) para recomendação de temas livres
// dados = { eixos, temas, argumentos, repertorios, temaArgumento, argumentoRepertorio }
// ----------------------------------------------------------------------------
function construirIndice(dados) {
  const eixosPorId = new Map(dados.eixos.map(e => [e.id, e]));
  const temasPorId = new Map(dados.temas.map(t => [t.id, t]));
  const argsPorId = new Map(dados.argumentos.map(a => [a.id, a]));
  const repsPorId = new Map(dados.repertorios.map(r => [r.id, r]));

  const temasDoArg = new Map();
  const argsDoTema = new Map();
  dados.temaArgumento.forEach(({ tema_id, argumento_id }) => {
    if (!temasPorId.has(tema_id) || !argsPorId.has(argumento_id)) return;
    if (!temasDoArg.has(argumento_id)) temasDoArg.set(argumento_id, []);
    temasDoArg.get(argumento_id).push(tema_id);
    if (!argsDoTema.has(tema_id)) argsDoTema.set(tema_id, []);
    argsDoTema.get(tema_id).push(argumento_id);
  });

  const repsDoArg = new Map();
  const argsDoRep = new Map();
  dados.argumentoRepertorio.forEach(({ argumento_id, repertorio_id }) => {
    if (!argsPorId.has(argumento_id) || !repsPorId.has(repertorio_id)) return;
    if (!repsDoArg.has(argumento_id)) repsDoArg.set(argumento_id, []);
    repsDoArg.get(argumento_id).push(repertorio_id);
    if (!argsDoRep.has(repertorio_id)) argsDoRep.set(repertorio_id, []);
    argsDoRep.get(repertorio_id).push(argumento_id);
  });

  // Só entram na recomendação teses ligadas a algum tema (como na consulta original)
  const argumentos = dados.argumentos.filter(a => temasDoArg.has(a.id));
  const repertorios = dados.repertorios.filter(r => (argsDoRep.get(r.id) || []).some(id => temasDoArg.has(id)));

  const docsTemas = dados.temas.map(t => criarDocumento([
    [t.titulo, 1],
    ...(argsDoTema.get(t.id) || []).map(id => [argsPorId.get(id).descricao, 0.3])
  ]));

  const docsArgs = argumentos.map(a => criarDocumento([
    [a.descricao, 1],
    ...(temasDoArg.get(a.id) || []).map(id => [temasPorId.get(id).titulo, 1.5]),
    ...(repsDoArg.get(a.id) || []).map(id => [repsPorId.get(id).conteudo, 0.5])
  ]));

  const docsReps = repertorios.map(r => {
    const argsLigados = argsDoRep.get(r.id) || [];
    const temasLigados = [...new Set(argsLigados.flatMap(id => temasDoArg.get(id) || []))];
    return criarDocumento([
      [r.conteudo, 1],
      [r.categoria, 0.5],
      ...argsLigados.map(id => [argsPorId.get(id).descricao, 0.5]),
      ...temasLigados.map(id => [temasPorId.get(id).titulo, 0.5])
    ]);
  });

  const radicaisEixos = new Map();
  dados.eixos.forEach(e => {
    const palavras = [...(MAPA_SEMANTICO_EIXOS[e.id] || []), e.nome].join(' ');
    radicaisEixos.set(e.id, new Set(extrairRadicais(palavras)));
  });

  return {
    eixos: dados.eixos,
    temas: dados.temas,
    argumentos,
    repertorios,
    eixosPorId,
    temasPorId,
    temasDoArg,
    repsDoArg,
    argsDoRep,
    radicaisEixos,
    colecaoTemas: criarColecao(docsTemas),
    colecaoArgs: criarColecao(docsArgs),
    colecaoReps: criarColecao(docsReps)
  };
}

// Limiares de relevância (calibrados com a base atual)
const SCORE_MINIMO = 1.5;        // nota mínima absoluta para um item ser recomendado
const FRACAO_DO_MELHOR = 0.5;    // item precisa ter ao menos 50% da nota do melhor
const BONUS_EIXO = 1.15;         // desempate a favor do eixo identificado
const PESO_MAPA_EIXO = 2;        // peso de cada termo encontrado no campo semântico do eixo
const LIMITE_ITENS = 6;
const COBERTURA_ALTA = 0.65;     // cobertura para considerar a recomendação de alta confiança
const COBERTURA_MINIMA = 0.3;    // fração mínima das palavras do tema encontradas na melhor tese

const FRACAO_COBERTURA = 0.9;    // item precisa cobrir ao menos 90% do que a melhor tese cobre

function filtrarRelevantes(lista) {
  if (!lista.length) return [];
  const melhor = lista[0].score;
  const relevantes = lista.filter(x => x.score >= SCORE_MINIMO && x.score >= melhor * FRACAO_DO_MELHOR);
  // Descarta itens que só casam com uma parte menor do tema (ex.: um sinônimo solto)
  const coberturas = relevantes.map(x => x.cobertura).filter(c => c !== undefined);
  if (!coberturas.length) return relevantes;
  const melhorCobertura = Math.max(...coberturas);
  return relevantes.filter(x => x.cobertura === undefined || x.cobertura >= melhorCobertura * FRACAO_COBERTURA);
}

function recomendar(textoUsuario, indice) {
  const temaUsuario = String(textoUsuario || '').trim();
  const tokensUsuario = extrairTokens(juntarExpressoes(normalizarTexto(temaUsuario)));
  const termosConsulta = prepararConsulta(temaUsuario);

  const matchExato = indice.temas.find(t => normalizarTexto(t.titulo) === normalizarTexto(temaUsuario));

  // 1. Temas do catálogo mais próximos
  const temasPontuados = indice.temas
    .map((t, i) => ({ tema: t, ...pontuarDocumento(indice.colecaoTemas, indice.colecaoTemas.documentos[i], termosConsulta) }))
    .sort((a, b) => b.score - a.score || a.tema.id - b.tema.id);

  // 2. Eixo: força dos melhores temas do eixo + vocabulário do campo semântico
  const pontuacaoEixos = new Map();
  indice.eixos.forEach(e => {
    const melhoresTemas = temasPontuados.filter(t => t.tema.eixo_id === e.id).slice(0, 3);
    const somaTemas = melhoresTemas.reduce((s, t) => s + t.score, 0);
    const campo = indice.radicaisEixos.get(e.id);
    const hitsCampo = termosConsulta.reduce((s, t) => s + (campo.has(t.principal) ? 1 : t.alternativas.some(a => campo.has(a)) ? PESO_SINONIMO : 0), 0);
    pontuacaoEixos.set(e.id, somaTemas + hitsCampo * PESO_MAPA_EIXO);
  });
  const [eixoTopId, eixoTopScore] = [...pontuacaoEixos.entries()].sort((a, b) => b[1] - a[1])[0] || [null, 0];
  const eixoPrincipalId = matchExato ? matchExato.eixo_id : (eixoTopScore >= SCORE_MINIMO ? eixoTopId : null);
  const eixoPrincipal = eixoPrincipalId ? indice.eixosPorId.get(eixoPrincipalId) : null;

  const ajustarPorEixo = (score, eixoId) => (score > 0 && eixoId === eixoPrincipalId ? score * BONUS_EIXO : score);

  // 3. Teses
  const argsPontuados = indice.argumentos.map((a, i) => {
    const temaIds = indice.temasDoArg.get(a.id) || [];
    const tema = indice.temasPorId.get(temaIds.find(id => indice.temasPorId.get(id).eixo_id === eixoPrincipalId) || temaIds[0]);
    const r = pontuarDocumento(indice.colecaoArgs, indice.colecaoArgs.documentos[i], termosConsulta);
    const proprio = Boolean(matchExato && temaIds.includes(matchExato.id));
    return { arg: a, tema: proprio ? matchExato : tema, score: ajustarPorEixo(r.score, tema.eixo_id), cobertura: r.cobertura, proprio };
  }).sort((a, b) => b.score - a.score || a.arg.id - b.arg.id);

  // Tema idêntico ao do catálogo: as teses dele vêm primeiro, seguidas das mais próximas
  const argsProprios = argsPontuados.filter(x => x.proprio);
  // Temas do catálogo muito próximos do pesquisado trazem todas as teses deles junto
  const temasFortes = new Set(temasPontuados
    .filter(t => t.cobertura >= COBERTURA_ALTA && t.score >= SCORE_MINIMO * 2 && t.score >= temasPontuados[0].score * 0.6)
    .map(t => t.tema.id));
  const relevantes = filtrarRelevantes(argsPontuados);
  const idsRelevantes = new Set(relevantes.map(x => x.arg.id));
  const companheiras = argsPontuados.filter(x => !idsRelevantes.has(x.arg.id) && temasFortes.has(x.tema.id) && x.score >= SCORE_MINIMO);
  let argsSelecionados = [
    ...argsProprios,
    ...[...relevantes, ...companheiras].filter(x => !x.proprio).sort((a, b) => b.score - a.score)
  ].slice(0, LIMITE_ITENS);
  const melhorCobertura = argsSelecionados.length ? Math.max(...argsSelecionados.map(x => x.cobertura)) : 0;
  // Se nem metade das palavras do tema aparece na base, as teses encontradas tratam de outro assunto
  const coberturaInsuficiente = !matchExato && melhorCobertura < COBERTURA_MINIMA;
  if (coberturaInsuficiente) argsSelecionados = [];

  // 4. Repertórios: casamento direto + coerência com as teses escolhidas
  const notaPorArgSelecionado = new Map(argsSelecionados.map(x => [x.arg.id, x.score]));
  const repsPontuados = indice.repertorios.map((rep, i) => {
    const argsLigados = indice.argsDoRep.get(rep.id) || [];
    const temaIds = [...new Set(argsLigados.flatMap(id => indice.temasDoArg.get(id) || []))];
    const tema = indice.temasPorId.get(temaIds.find(id => indice.temasPorId.get(id).eixo_id === eixoPrincipalId) || temaIds[0]);
    const direto = pontuarDocumento(indice.colecaoReps, indice.colecaoReps.documentos[i], termosConsulta).score;
    const notaTeseLigada = Math.max(0, ...argsLigados.map(id => notaPorArgSelecionado.get(id) || 0));
    // Repertório que sustenta uma tese recomendada herda parte da nota dela
    const score = Math.max(ajustarPorEixo(direto, tema.eixo_id), notaTeseLigada * 0.8) + (notaTeseLigada > 0 ? 0.5 : 0);
    return { rep, tema, score };
  }).sort((a, b) => b.score - a.score || a.rep.id - b.rep.id);

  const repsSelecionados = coberturaInsuficiente ? [] : filtrarRelevantes(repsPontuados).slice(0, LIMITE_ITENS);

  // 5. Confiança da recomendação
  let confianca;
  if (matchExato) confianca = 'alta';
  else if (!argsSelecionados.length) confianca = 'baixa';
  else if (melhorCobertura >= COBERTURA_ALTA && argsSelecionados[0].score >= SCORE_MINIMO * 2) confianca = 'alta';
  else confianca = 'media';

  const temasCorrelatos = filtrarRelevantes(temasPontuados.map(t => ({ ...t, score: ajustarPorEixo(t.score, t.tema.eixo_id) })))
    .filter(t => !matchExato || t.tema.id !== matchExato.id)
    .slice(0, 4)
    .map(({ tema }) => ({
      id: tema.id,
      titulo: tema.titulo,
      eixo_id: tema.eixo_id,
      eixo: (indice.eixosPorId.get(tema.eixo_id) || {}).nome || null
    }));

  return {
    tema_pesquisado: temaUsuario,
    existe_exato: Boolean(matchExato),
    tema_exato_id: matchExato ? matchExato.id : null,
    eixo_id: eixoPrincipal ? eixoPrincipal.id : null,
    eixo_sugerido: eixoPrincipal ? eixoPrincipal.nome : null,
    confianca,
    palavras_chave_identificadas: tokensUsuario,
    argumentos: argsSelecionados.map(({ arg, tema, score }) => ({
      id: arg.id,
      descricao: arg.descricao,
      tema_origem_id: tema.id,
      tema_origem: tema.titulo,
      eixo: (indice.eixosPorId.get(tema.eixo_id) || {}).nome || null,
      score: Math.round(score * 100) / 100
    })),
    repertorios: repsSelecionados.map(({ rep, tema, score }) => ({
      id: rep.id,
      categoria: rep.categoria,
      conteudo: rep.conteudo,
      tema_origem_id: tema.id,
      tema_origem: tema.titulo,
      eixo: (indice.eixosPorId.get(tema.eixo_id) || {}).nome || null,
      score: Math.round(score * 100) / 100
    })),
    temas_correlatos: temasCorrelatos
  };
}

module.exports = {
  STOPWORDS,
  MAPA_SEMANTICO_EIXOS,
  normalizarTexto,
  extrairTokens,
  radical,
  extrairRadicais,
  ranquearPorSimilaridade,
  construirIndice,
  recomendar
};
