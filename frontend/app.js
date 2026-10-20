// Seletores do DOM
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const suggestList = document.querySelector('.suggest');
const resultsContainer = document.getElementById('resultsContainer');
const eixosNavList = document.getElementById('eixosNavList');
const categoriasChips = document.getElementById('categoriasChips');
const brandHome = document.getElementById('brandHome');
const btnVerTodos = document.getElementById('btnVerTodos');
const btnLimparCategoria = document.getElementById('btnLimparCategoria');
const themeToggle = document.getElementById('themeToggle');

// Inicializa o tema (claro / escuro) com base na preferência salva ou do sistema
function inicializarTema() {
  const salvo = localStorage.getItem('redacta-theme');
  if (salvo === 'light' || salvo === 'dark') {
    document.documentElement.setAttribute('data-theme', salvo);
  }
}
inicializarTema();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const atual = document.documentElement.getAttribute('data-theme');
    const prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isEscuroAtualmente = atual === 'dark' || (!atual && prefereEscuro);
    const proximo = isEscuroAtualmente ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', proximo);
    localStorage.setItem('redacta-theme', proximo);
  });
}

// Configuração e resolução dinâmica da API
const VERCEL_API_BASE = 'https://redacta-phi.vercel.app/api';
const LOCAL_API_BASE = 'http://localhost:3000/api';

// Identifica se está rodando localmente (Live Server em 127.0.0.1, localhost ou file:)
const isLocalEnv = ['localhost', '127.0.0.1', ''].includes(window.location.hostname) || window.location.protocol === 'file:';

// Em produção (Vercel), utiliza rota relativa '/api'. Em local, tenta o backend na porta 3000 e faz fallback para a Vercel
let currentApiBase = isLocalEnv ? LOCAL_API_BASE : '/api';
let apiResolved = !isLocalEnv;

async function resolverApiBase() {
  if (apiResolved) return currentApiBase;

  // Se o frontend estiver rodando na mesma porta do Express (porta 3000)
  if (window.location.port === '3000') {
    currentApiBase = '/api';
    apiResolved = true;
    return currentApiBase;
  }

  // Testa se o backend local na porta 3000 está respondendo com timeout rápido de 800ms
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 800);
    const testRes = await fetch(`${LOCAL_API_BASE}/categorias`, { signal: controller.signal });
    clearTimeout(timer);
    if (testRes.ok) {
      currentApiBase = LOCAL_API_BASE;
      apiResolved = true;
      console.log('⚡ Conectado ao backend local na porta 3000');
      return currentApiBase;
    }
  } catch (e) {
    // Backend local indisponível, faz fallback
  }

  currentApiBase = VERCEL_API_BASE;
  apiResolved = true;
  console.log('🌐 Backend local (porta 3000) indisponível. Usando API de produção na Vercel:', VERCEL_API_BASE);
  return currentApiBase;
}

// Wrapper para requisições à API com suporte a fallback
async function apiFetch(endpoint, options = {}) {
  const base = await resolverApiBase();
  try {
    return await fetch(`${base}${endpoint}`, options);
  } catch (err) {
    // Se o backend local falhar durante a navegação, tenta a Vercel
    if (base !== VERCEL_API_BASE && isLocalEnv) {
      console.warn('Falha na requisição local. Alternando para a API da Vercel...', err);
      currentApiBase = VERCEL_API_BASE;
      return await fetch(`${VERCEL_API_BASE}${endpoint}`, options);
    }
    throw err;
  }
}

// Mantido para compatibilidade
const API_BASE = currentApiBase;

// Estado da aplicação carregado do banco
let todosTemas = [];
let todosEixos = [];
let temasExibidosAtualmente = [];
let eixoSelecionadoId = null;
let categoriaSelecionada = 'todas';
let timeoutId = null;

// Ícones SVG de Cópia e Confirmação
const COPY_ICON_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
const CHECK_ICON_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;

// Ícones SVG para os Eixos (menu lateral e cards de temas)
function obterIconeEixo(eixoOuNome = '') {
  let nome = '';
  if (typeof eixoOuNome === 'string') {
    nome = eixoOuNome;
  } else if (eixoOuNome && typeof eixoOuNome === 'object') {
    nome = eixoOuNome.eixo || eixoOuNome.eixo_sugerido || eixoOuNome.nome || '';
    if (!nome && eixoOuNome.eixo_id && Array.isArray(todosEixos)) {
      const achado = todosEixos.find(e => e.id === Number(eixoOuNome.eixo_id));
      if (achado) nome = achado.nome;
    }
  }

  const n = normalizarTipo(nome);
  if (n.includes('educacao')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;
  }
  if (n.includes('cidadania') || n.includes('direito')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18"/><path d="M3 10h18"/><polygon points="12 3 20 7 4 7"/><path d="M5 10v11M9 10v11M15 10v11M19 10v11"/></svg>`;
  }
  if (n.includes('tecnologia') || n.includes('comunicacao') || n.includes('digital') || n.includes('ciencia')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`;
  }
  if (n.includes('ambiente') || n.includes('sustentabilidade') || n.includes('clima') || n.includes('territorio')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`;
  }
  if (n.includes('saude') || n.includes('bioetica')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
  }
  if (n.includes('cultura') || n.includes('identidade') || n.includes('memoria')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
  }
  if (n.includes('trabalho') || n.includes('economia') || n.includes('desigualdade')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
  }
  if (n.includes('seguranca') || n.includes('violencia') || n.includes('justica') || n.includes('democracia')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
  }
  if (n.includes('infancia') || n.includes('juventude') || n.includes('familia')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
  }
  if (n.includes('mobilidade') || n.includes('habitacao') || n.includes('cidade')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>`;
  }
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
}

// Ícones SVG ilustrados para os cards de Categorias (seguindo a referência visual)
function obterIconeCategoria(categoria = '') {
  const c = normalizarTipo(categoria);
  if (c.includes('filosofia') || c.includes('psiquiatria')) {
    // Cabeça pensante / mente
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 2A6.5 6.5 0 0 0 3 8.5c0 2.3 1.2 4.3 3 5.5v4a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-2h1.5a2.5 2.5 0 0 0 2.5-2.5V11l1.5-1.5L18 6.5A6.5 6.5 0 0 0 9.5 2Z"/><circle cx="10" cy="8" r="1.5"/></svg>`;
  }
  if (c.includes('sociologia') || c.includes('antropologia') || c.includes('saude')) {
    // Grupo de pessoas / sociedade
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
  }
  if (c.includes('historia') || c.includes('direito') || c.includes('legislacao') || c.includes('politica')) {
    // Templo clássico / colunas
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/><line x1="4" y1="18" x2="20" y2="18"/></svg>`;
  }
  if (c.includes('literatura') || c.includes('livro') || c.includes('educacao') || c.includes('linguistica')) {
    // Livro aberto
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
  }
  if (c.includes('geografia') || c.includes('ecologia') || c.includes('urbanismo') || c.includes('economia')) {
    // Globo terrestre
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`;
  }
  // Lâmpada / Ideias / Comunicação / Tecnologia / Outros
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`;
}

// Ícone para os cards de Temas (equivalente ao seu respectivo eixo temático)
function obterIconeCardTema(temaOuEixo) {
  return obterIconeEixo(temaOuEixo);
}

function normalizarTipo(categoria) {
  if (!categoria) return 'geral';
  return categoria
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// Macro-categorias: agrupa as categorias do banco em poucos blocos para reduzir a poluição visual
const GRUPOS_CATEGORIA = [
  { nome: 'Filosofia e Sociedade', chaves: ['filosofia', 'sociologia', 'antropologia', 'psiquiatria', 'psicologia', 'saude', 'religiao', 'etica'] },
  { nome: 'História e Política', chaves: ['historia', 'politica', 'direito', 'legislacao', 'constituicao', 'cidadania'] },
  { nome: 'Literatura e Educação', chaves: ['literatura', 'livro', 'educacao', 'linguistica', 'arte', 'cinema', 'musica', 'cultura'] },
  { nome: 'Geografia e Ciência', chaves: ['geografia', 'ecologia', 'urbanismo', 'economia', 'ciencia', 'ambiente', 'biologia'] }
];
const GRUPO_PADRAO = 'Atualidades';

function grupoDaCategoria(categoria) {
  const n = normalizarTipo(categoria);
  const grupo = GRUPOS_CATEGORIA.find(g => g.chaves.some(chave => n.includes(chave)));
  return grupo ? grupo.nome : GRUPO_PADRAO;
}

function repassaFiltroCategoria(rep) {
  return categoriaSelecionada === 'todas' || grupoDaCategoria(rep.categoria) === categoriaSelecionada;
}

// Quantidade de itens visíveis por coluna antes do "Ver mais"
const LIMITE_TESES = 2;
const LIMITE_REPERTORIOS = 3;

// 1. Inicialização da Landing Page (carrega apenas o que existe no banco)
async function inicializarLandingPage() {
  try {
    const [eixosRes, categoriasRes, temasRes] = await Promise.all([
      apiFetch('/eixos'),
      apiFetch('/categorias'),
      apiFetch('/temas')
    ]);

    if (!eixosRes.ok || !temasRes.ok) {
      throw new Error('Falha ao comunicar com a API');
    }

    todosEixos = await eixosRes.json();
    const categorias = categoriasRes.ok ? await categoriasRes.json() : [];
    todosTemas = await temasRes.json();

    renderizarChipsCategorias(categorias);
    renderizarLandingTemas(todosTemas);
  } catch (error) {
    console.error('Erro ao inicializar a página:', error);
    if (categoriasChips) {
      categoriasChips.innerHTML = '<span class="qtd">Categorias temporariamente indisponíveis.</span>';
    }
    if (eixosNavList) {
      eixosNavList.innerHTML = '<li><span class="qtd">Eixos indisponíveis.</span></li>';
    }
    resultsContainer.innerHTML = `
      <div class="empty-state">
        <p>Não foi possível carregar os repertórios do banco de dados.</p>
        <p style="font-size: 0.875rem; margin-top: 0.5rem; color: var(--text-muted, #64748b);">
          Verifique sua conexão com a internet ou se o backend local está ativo na porta 3000.
        </p>
        <button type="button" class="hero-btn" style="margin-top: 1rem; display: inline-flex; cursor: pointer;" onclick="location.reload()">
          Tentar novamente
        </button>
      </div>
    `;
  }
}

// 2. Renderiza o Menu Lateral de Eixos com ícones e pílula ativa azul-marinho
function renderizarMenuEixos() {
  if (!eixosNavList) return;
  eixosNavList.innerHTML = '';

  const liTodos = document.createElement('li');
  liTodos.innerHTML = `
    <a href="#" data-eixo-id="todos" class="${eixoSelecionadoId === null ? 'active' : ''}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
      <span class="nome">Início (Todos)</span>
    </a>
  `;
  eixosNavList.appendChild(liTodos);

  todosEixos.forEach(eixo => {
    const li = document.createElement('li');
    const isAtivo = eixoSelecionadoId === eixo.id ? 'active' : '';
    li.innerHTML = `
      <a href="#eixo-${eixo.id}" data-eixo-id="${eixo.id}" class="${isAtivo}">
        ${obterIconeEixo(eixo.nome)}
        <span class="nome">${eixo.nome}</span>
      </a>
    `;
    eixosNavList.appendChild(li);
  });
}

// 3. Renderiza os Cards Ilustrados de Categorias vindos da API
function renderizarChipsCategorias(categorias) {
  if (!categoriasChips) return;
  categoriasChips.innerHTML = '';

  const btnTodas = document.createElement('button');
  btnTodas.type = 'button';
  btnTodas.className = `cat-card ${categoriaSelecionada === 'todas' ? 'active' : ''}`;
  btnTodas.dataset.categoria = 'todas';
  btnTodas.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
    </svg>
    <span>Todas</span>
  `;
  categoriasChips.appendChild(btnTodas);

  const presentes = new Set((categorias || []).map(grupoDaCategoria));
  const gruposVisiveis = [...GRUPOS_CATEGORIA.map(g => g.nome), GRUPO_PADRAO].filter(nome => presentes.has(nome));

  gruposVisiveis.forEach(cat => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `cat-card ${categoriaSelecionada === cat ? 'active' : ''}`;
    btn.dataset.categoria = cat;
    btn.innerHTML = `
      ${obterIconeCategoria(cat)}
      <span>${cat}</span>
    `;
    categoriasChips.appendChild(btn);
  });
}

// 4. Renderiza os Cards de Temas, Teses e Repertórios no formato do Dashboard
function renderizarLandingTemas(temas, contextoCustom = null, destaqueBusca = '') {
  temasExibidosAtualmente = temas || [];

  const temasParaRenderizar = temasExibidosAtualmente.filter(tema => {
    if (categoriaSelecionada === 'todas' || temasExibidosAtualmente.length === 1) return true;
    const repsFiltrados = (tema.repertorios || []).filter(repassaFiltroCategoria);
    return repsFiltrados.length > 0;
  });

  renderizarMenuEixos();

  if (temasParaRenderizar.length === 0) {
    resultsContainer.innerHTML = `
      <div class="empty-state">
        Nenhum tema encontrado para este filtro. Selecione outra categoria acima ou pesquise seu próprio tema na barra de busca.
      </div>
    `;
    return;
  }

  let totalArgs = 0;
  let totalReps = 0;

  temasParaRenderizar.forEach(t => {
    totalArgs += (t.argumentos || []).length;
    const repsDoTema = (t.repertorios || []).filter(repassaFiltroCategoria);
    totalReps += repsDoTema.length;
  });

  const tituloSecao = temasParaRenderizar.length === 1
    ? 'Tema selecionado'
    : eixoSelecionadoId
      ? `Temas do eixo selecionado`
      : 'Temas e repertórios em destaque';

  const subtituloSecao = contextoCustom
    ? contextoCustom
    : 'Selecione um tema ou copie diretamente as teses e repertórios legitimados para sua redação.';

  let html = `
    <div class="feed-header">
      <div class="feed-header-left">
        <h2>${tituloSecao}</h2>
        <p>${subtituloSecao}</p>
      </div>
      <ul class="counts">
        <li><strong>${temasParaRenderizar.length}</strong> ${temasParaRenderizar.length === 1 ? 'tema' : 'temas'}</li>
        <li><strong>${totalArgs}</strong> ${totalArgs === 1 ? 'tese' : 'teses'}</li>
        <li><strong>${totalReps}</strong> ${totalReps === 1 ? 'repertório' : 'repertórios'}</li>
      </ul>
    </div>
  `;

  temasParaRenderizar.forEach((tema, idx) => {
    const args = tema.argumentos || [];
    const repsFiltrados = (tema.repertorios || []).filter(repassaFiltroCategoria);

    // Com um único tema em foco mostra tudo; na listagem geral, só os primeiros itens
    const expandido = temasParaRenderizar.length === 1;
    const extra = (i, limite) => (!expandido && i >= limite ? ' is-extra' : '');
    const botaoMais = (total, limite) => (!expandido && total > limite)
      ? `<button type="button" class="ver-mais" data-restantes="${total - limite}">Ver mais (${total - limite})</button>`
      : '';

    const argsHtml = args.length > 0
      ? args.map((arg, i) => `
          <article class="arg${extra(i, LIMITE_TESES)}" data-copyable>
            <div class="entry-meta">
              <span class="entry-key">Tese Argumentativa</span>
              <button class="copy" type="button" title="Copiar tese" aria-label="Copiar tese">${COPY_ICON_SVG}</button>
            </div>
            <h4 class="tese" data-part>${destacarTermo(arg.descricao, destaqueBusca)}</h4>
          </article>
        `).join('')
      : `<p class="qtd">Nenhuma tese cadastrada para este tema.</p>`;

    const repsHtml = repsFiltrados.length > 0
      ? repsFiltrados.map((rep, i) => `
          <article class="rep${extra(i, LIMITE_REPERTORIOS)}" data-tipo="${normalizarTipo(rep.categoria)}" data-copyable>
            <div class="entry-meta">
              <p class="rep-tipo" data-part>${rep.categoria}</p>
              <button class="copy" type="button" title="Copiar repertório" aria-label="Copiar repertório">${COPY_ICON_SVG}</button>
            </div>
            <p class="rep-desc" data-part>${destacarTermo(rep.conteudo, destaqueBusca)}</p>
          </article>
        `).join('')
      : `<p class="qtd">Nenhum repertório registrado nesta categoria.</p>`;

    html += `
      <section class="tema-card" id="tema-${tema.id}" data-tema-id="${tema.id}">
        <div class="tema-card-top">
          <div class="tema-icon-box" aria-hidden="true">
            ${obterIconeCardTema(tema)}
          </div>
          <div class="tema-head-info">
            <h3>
              <a href="#tema-${tema.id}" class="tema-link" data-tema-id="${tema.id}">
                ${destacarTermo(tema.titulo, destaqueBusca)}
              </a>
            </h3>
            <span class="badge-pill">${tema.eixo || 'Eixo Geral'}</span>
          </div>
        </div>
        <div class="cols">
          <div class="col-pane-left">
            <h4 class="col-title">Teses (${args.length})</h4>
            <div class="entry-list">
              ${argsHtml}
            </div>
            ${botaoMais(args.length, LIMITE_TESES)}
          </div>
          <div class="col-pane-right">
            <h4 class="col-title">Repertórios (${repsFiltrados.length})</h4>
            <div class="entry-list">
              ${repsHtml}
            </div>
            ${botaoMais(repsFiltrados.length, LIMITE_REPERTORIOS)}
          </div>
        </div>
      </section>
    `;
  });

  resultsContainer.innerHTML = html;
}

// 5. Renderiza a página de Recomendação Inteligente para um Tema Livre do Usuário
function renderizarRecomendacaoTemaLivre(rec) {
  suggestList.style.display = 'none';
  btnVerTodos.style.display = 'inline-block';
  eixoSelecionadoId = rec.eixo_id;
  renderizarMenuEixos();

  const args = rec.argumentos || [];
  const reps = (rec.repertorios || []).filter(repassaFiltroCategoria);
  const correlatos = rec.temas_correlatos || [];

  const argsHtml = args.map(arg => `
    <article class="arg" data-copyable>
      <div class="entry-meta">
        <span class="entry-key">Tese Compatível</span>
        <button class="copy" type="button" title="Copiar tese" aria-label="Copiar tese">${COPY_ICON_SVG}</button>
      </div>
      <h4 class="tese" data-part>${arg.descricao}</h4>
      <p class="rep-uso">
        Matriz de origem: <em>${arg.tema_origem}</em>
      </p>
    </article>
  `).join('');

  const repsHtml = reps.map(rep => `
    <article class="rep" data-tipo="${normalizarTipo(rep.categoria)}" data-copyable>
      <div class="entry-meta">
        <p class="rep-tipo" data-part>${rep.categoria}</p>
        <button class="copy" type="button" title="Copiar repertório" aria-label="Copiar repertório">${COPY_ICON_SVG}</button>
      </div>
      <p class="rep-desc" data-part>${rep.conteudo}</p>
      <p class="rep-uso">
        Eixo de referência: <em>${rep.eixo}</em>
      </p>
    </article>
  `).join('');

  const correlatosHtml = correlatos.length > 0
    ? `
      <section class="tema-card">
        <div class="section-head">
          <h2>Temas correlatos no catálogo</h2>
        </div>
        <ul class="correlatos-list">
          ${correlatos.map(t => `
            <li>
              <a href="#tema-${t.id}" class="tema-link" data-tema-id="${t.id}">
                <span>${t.titulo}</span>
                <span class="badge-pill">${t.eixo}</span>
              </a>
            </li>
          `).join('')}
        </ul>
      </section>
    `
    : '';

  resultsContainer.innerHTML = `
    <div class="feed-header">
      <div class="feed-header-left">
        <h2>Recomendação para “${rec.tema_pesquisado}”</h2>
        <p>Proposta classificada no eixo <strong>${rec.eixo_sugerido}</strong> com base no repertório da plataforma.</p>
      </div>
      <ul class="counts">
        <li><strong>${args.length}</strong> teses recomendadas</li>
        <li><strong>${reps.length}</strong> repertórios recomendados</li>
      </ul>
    </div>

    <section class="tema-card">
      <div class="tema-card-top">
        <div class="tema-icon-box" aria-hidden="true">
          ${obterIconeCardTema(rec.eixo_sugerido || rec)}
        </div>
        <div class="tema-head-info">
          <h3>${rec.tema_pesquisado}</h3>
          <span class="badge-pill">${rec.eixo_sugerido}</span>
        </div>
      </div>
      <div class="cols">
        <div class="col-pane-left">
          <h4 class="col-title">Teses Recomendadas (${args.length})</h4>
          <div class="entry-list">
            ${argsHtml}
          </div>
        </div>
        <div class="col-pane-right">
          <h4 class="col-title">Repertórios Recomendados (${reps.length})</h4>
          <div class="entry-list">
            ${repsHtml}
          </div>
        </div>
      </div>
    </section>

    ${correlatosHtml}
  `;
}

// Utilitário para grifar (<mark>) o termo pesquisado
function destacarTermo(texto, termo) {
  if (!termo || !texto) return texto;
  const escaped = termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return texto.replace(regex, '<mark>$1</mark>');
}

// 6. Carrega um tema específico via GET /api/temas/:id
async function carregarTemaPorId(id, termoDestaque = '') {
  try {
    suggestList.style.display = 'none';
    btnVerTodos.style.display = 'inline-block';

    const response = await apiFetch(`/temas/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar detalhes do tema');

    const tema = await response.json();
    eixoSelecionadoId = tema.eixo_id;
    renderizarLandingTemas([tema], null, termoDestaque);
  } catch (error) {
    console.error('Erro ao carregar tema:', error);
  }
}

// 7. Busca na API (/api/temas/busca + /api/temas/recomendar) para o Autocomplete e filtragem
async function buscarTemas(termo, atualizarPagina = false) {
  searchBtn.disabled = true;
  searchBtn.textContent = 'Buscando...';

  suggestList.style.display = 'block';
  suggestList.innerHTML = '<li><a href="#"><span>Consultando repertórios e analisando eixo...</span></a></li>';

  try {
    const [buscaRes, recRes] = await Promise.all([
      apiFetch(`/temas/busca?q=${encodeURIComponent(termo)}`),
      apiFetch(`/temas/recomendar?q=${encodeURIComponent(termo)}`)
    ]);

    const data = buscaRes.ok ? await buscaRes.json() : [];
    const rec = recRes.ok ? await recRes.json() : null;

    renderizarSugestoes(data, termo, rec);

    if (atualizarPagina) {
      suggestList.style.display = 'none';
      if (data.length > 0) {
        const idsEncontrados = new Set(data.map(d => d.id));
        const temasFiltrados = todosTemas.filter(t => idsEncontrados.has(t.id));
        btnVerTodos.style.display = 'inline-block';
        renderizarLandingTemas(
          temasFiltrados,
          `Resultados encontrados para “${termo}”.`,
          termo
        );
      } else if (rec) {
        renderizarRecomendacaoTemaLivre(rec);
      }
    }
  } catch (error) {
    console.error('Erro ao buscar temas:', error);
    suggestList.innerHTML = '<li><a href="#"><span>Erro ao consultar a base de dados.</span></a></li>';
  } finally {
    searchBtn.disabled = false;
    searchBtn.textContent = 'Buscar';
  }
}

// Renderiza o dropdown de autocomplete com temas do banco + opção de gerar recomendação para o tema próprio do aluno
function renderizarSugestoes(temas, termo, rec) {
  suggestList.innerHTML = '';

  temas.forEach(tema => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="#tema-${tema.id}" data-tema-id="${tema.id}">
        <span>${destacarTermo(tema.titulo, termo)}</span>
        <span class="meta">${tema.eixo || 'Eixo'}</span>
      </a>
    `;
    li.querySelector('a').addEventListener('click', (e) => {
      e.preventDefault();
      searchInput.value = tema.titulo;
      carregarTemaPorId(tema.id, termo);
    });
    suggestList.appendChild(li);
  });

  if (rec && !rec.existe_exato) {
    const liCustom = document.createElement('li');
    liCustom.innerHTML = `
      <a href="#recomendar" class="suggest-custom">
        <span>Gerar teses e repertórios para: <strong>“${termo}”</strong></span>
        <span class="meta">${rec.eixo_sugerido}</span>
      </a>
    `;
    liCustom.querySelector('a').addEventListener('click', (e) => {
      e.preventDefault();
      renderizarRecomendacaoTemaLivre(rec);
    });
    suggestList.appendChild(liCustom);
  }
}

// Resetar para visão completa da Landing Page
function voltarParaTodosTemas() {
  eixoSelecionadoId = null;
  categoriaSelecionada = 'todas';
  searchInput.value = '';
  suggestList.style.display = 'none';
  btnVerTodos.style.display = 'none';
  document.querySelectorAll('#categoriasChips .cat-card').forEach(c => {
    c.classList.toggle('active', c.dataset.categoria === 'todas');
  });
  renderizarLandingTemas(todosTemas);
}

// Event Listeners de Busca (Debounce + Click + Enter)
searchInput.addEventListener('input', (e) => {
  const termo = e.target.value.trim();

  if (termo === '') {
    suggestList.innerHTML = '';
    suggestList.style.display = 'none';
    voltarParaTodosTemas();
    return;
  }

  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    buscarTemas(termo, false);
  }, 250);
});

searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const termo = searchInput.value.trim();
  if (termo) {
    buscarTemas(termo, true);
  } else {
    voltarParaTodosTemas();
  }
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const termo = searchInput.value.trim();
    if (termo) {
      buscarTemas(termo, true);
    } else {
      voltarParaTodosTemas();
    }
  } else if (e.key === 'Escape') {
    suggestList.style.display = 'none';
  }
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.search')) {
    suggestList.style.display = 'none';
  }
});

// Navegação lateral por Eixos do banco
if (eixosNavList) {
  eixosNavList.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-eixo-id]');
    if (!link) return;
    e.preventDefault();

    const rawId = link.dataset.eixoId;
    if (rawId === 'todos') {
      voltarParaTodosTemas();
      return;
    }

    eixoSelecionadoId = parseInt(rawId, 10);
    btnVerTodos.style.display = 'inline-block';

    const eixoObj = todosEixos.find(x => x.id === eixoSelecionadoId);
    const filtrados = todosTemas.filter(t => t.eixo_id === eixoSelecionadoId);
    renderizarLandingTemas(
      filtrados,
      `Exibindo os temas e repertórios do eixo ${eixoObj ? eixoObj.nome : ''}.`
    );
  });
}

// Filtro por Card de Categoria de Repertório do banco
if (categoriasChips) {
  categoriasChips.addEventListener('click', (e) => {
    const card = e.target.closest('.cat-card[data-categoria]');
    if (!card) return;

    categoriaSelecionada = card.dataset.categoria;
    document.querySelectorAll('#categoriasChips .cat-card').forEach(c => {
      c.classList.toggle('active', c.dataset.categoria === categoriaSelecionada);
    });

    const filtrados = eixoSelecionadoId
      ? todosTemas.filter(t => t.eixo_id === eixoSelecionadoId)
      : todosTemas;

    const contexto = categoriaSelecionada === 'todas'
      ? null
      : `Filtrando temas com repertórios na categoria ${categoriaSelecionada}.`;

    if (categoriaSelecionada !== 'todas') {
      btnVerTodos.style.display = 'inline-block';
    }
    renderizarLandingTemas(filtrados, contexto, searchInput.value.trim());
  });
}

if (btnLimparCategoria) {
  btnLimparCategoria.addEventListener('click', () => {
    categoriaSelecionada = 'todas';
    document.querySelectorAll('#categoriasChips .cat-card').forEach(c => {
      c.classList.toggle('active', c.dataset.categoria === 'todas');
    });
    const filtrados = eixoSelecionadoId
      ? todosTemas.filter(t => t.eixo_id === eixoSelecionadoId)
      : todosTemas;
    renderizarLandingTemas(filtrados, null, searchInput.value.trim());
  });
}

// Clicar no título de um tema na listagem abre o foco naquele tema
resultsContainer.addEventListener('click', (e) => {
  const temaLink = e.target.closest('.tema-link');
  if (temaLink) {
    e.preventDefault();
    carregarTemaPorId(temaLink.dataset.temaId, searchInput.value.trim());
  }
});

if (brandHome) {
  brandHome.addEventListener('click', (e) => {
    e.preventDefault();
    voltarParaTodosTemas();
  });
}
if (btnVerTodos) {
  btnVerTodos.addEventListener('click', () => voltarParaTodosTemas());
}

// "Ver mais" / "Ver menos" nas colunas do card de tema
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.ver-mais');
  if (!btn) return;
  const lista = btn.previousElementSibling;
  if (!lista) return;
  const aberto = lista.classList.toggle('expanded');
  btn.textContent = aberto ? 'Ver menos' : `Ver mais (${btn.dataset.restantes})`;
});

// Botão de Copiar argumento ou repertório com confirmação por ícone
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.copy');
  if (!btn) return;
  const box = btn.closest('[data-copyable]');
  if (!box) return;

  const text = Array.from(box.querySelectorAll('[data-part]'))
    .map(n => n.textContent.trim())
    .join(' — ');

  try {
    await navigator.clipboard.writeText(text);
    btn.innerHTML = CHECK_ICON_SVG;
    btn.classList.add('copied');
  } catch (err) {
    console.error('Falha ao copiar:', err);
  }
  setTimeout(() => {
    btn.innerHTML = COPY_ICON_SVG;
    btn.classList.remove('copied');
  }, 1500);
});

// Inicia carregando os dados reais do Supabase
inicializarLandingPage();
