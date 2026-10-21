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
const mobileEixosBtn = document.getElementById('mobileEixosBtn');
const mobileEixosLabel = document.getElementById('mobileEixosLabel');
const sidebarScroll = document.getElementById('sidebarScroll');

// Seletores do Módulo de Favoritos
const favoritosList = document.getElementById('favoritosList');
const favoritosEmptyState = document.getElementById('favoritosEmptyState');
const btnVerTodosFavoritos = document.getElementById('btnVerTodosFavoritos');
const topbarFavBtn = document.getElementById('topbarFavBtn');
const topbarFavBadge = document.getElementById('topbarFavBadge');
const favoritosModal = document.getElementById('favoritosModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalFavoritosList = document.getElementById('modalFavoritosList');
const modalSearchInput = document.getElementById('modalSearchInput');
const modalFilterPills = document.getElementById('modalFilterPills');
const favoritosModalCount = document.getElementById('favoritosModalCount');
const toastNotification = document.getElementById('toastNotification');
const toastMessage = document.getElementById('toastMessage');

if (mobileEixosBtn && sidebarScroll) {
  mobileEixosBtn.addEventListener('click', () => {
    const aberto = sidebarScroll.classList.toggle('is-open');
    mobileEixosBtn.setAttribute('aria-expanded', String(aberto));
  });
}

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

// ============================================================================
// MÓDULO DE FAVORITOS (REDACTA)
// ============================================================================
const DEFAULT_FAVORITOS = [
  {
    id: 'fav-1',
    titulo: 'A tirania da maioria',
    autor: 'Alexis de Tocqueville',
    categoria: 'SOCIOLOGIA',
    icone: 'flame',
    citacao: 'A maioria possui um poder tão irresistível que é preciso submeter-se a ela ou morrer.',
    contexto: 'Crítica aos perigos do conformismo social e a opressão de minorias em regimes democráticos.'
  },
  {
    id: 'fav-2',
    titulo: 'O contrato social',
    autor: 'Jean-Jacques Rousseau',
    categoria: 'FILOSOFIA',
    icone: 'document',
    citacao: 'O homem nasce livre, e por toda parte encontra-se a ferros.',
    contexto: 'Fundamento sobre o pacto social, a soberania popular e a responsabilidade do Estado em assegurar o bem-estar coletivo.'
  },
  {
    id: 'fav-3',
    titulo: '1984',
    autor: 'George Orwell',
    categoria: 'LITERATURA',
    icone: 'document',
    citacao: 'Guerra é Paz. Liberdade é Escravidão. Ignorância é Força.',
    contexto: 'Distopia sobre vigilância em massa, controle de dados, manipulação midiática e restrição da liberdade individual.'
  },
  {
    id: 'fav-4',
    titulo: 'A invisibilidade social e o preconceito',
    autor: 'Contemporâneo',
    categoria: 'ATUALIDADES',
    icone: 'eye',
    citacao: 'O verdadeiro olhar humano enxerga para além da utilidade econômica do indivíduo.',
    contexto: 'Análise sobre a indiferença da sociedade perante trabalhadores marginalizados e a desumanização cotidiana.'
  }
];

const STORAGE_KEY = 'redacta_favoritos';

class FavoritosManager {
  constructor() {
    this.favoritos = this.loadFavoritos();
  }

  loadFavoritos() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Erro ao carregar favoritos do localStorage:', e);
    }
    this.saveFavoritos(DEFAULT_FAVORITOS);
    return [...DEFAULT_FAVORITOS];
  }

  saveFavoritos(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Erro ao salvar favoritos no localStorage:', e);
    }
  }

  getAll() {
    return this.favoritos;
  }

  isFavorite(id, titulo) {
    return this.favoritos.some(item => 
      String(item.id) === String(id) || 
      (titulo && item.titulo && item.titulo.trim().toLowerCase() === titulo.trim().toLowerCase())
    );
  }

  toggleFavorite(repertoireData) {
    const existingIndex = this.favoritos.findIndex(item => 
      String(item.id) === String(repertoireData.id) || 
      (item.titulo && repertoireData.titulo && item.titulo.trim().toLowerCase() === repertoireData.titulo.trim().toLowerCase())
    );

    let isAdded = false;
    if (existingIndex >= 0) {
      this.favoritos.splice(existingIndex, 1);
      isAdded = false;
    } else {
      this.favoritos.unshift(repertoireData);
      isAdded = true;
    }

    this.saveFavoritos(this.favoritos);
    this.notifyUpdate(isAdded, repertoireData);
    return isAdded;
  }

  removeFavoriteById(id) {
    const item = this.favoritos.find(i => String(i.id) === String(id));
    if (!item) return null;

    this.favoritos = this.favoritos.filter(i => String(i.id) !== String(id));
    this.saveFavoritos(this.favoritos);
    this.notifyUpdate(false, item);
    return item;
  }

  notifyUpdate(isAdded, item) {
    renderFavoritosWidget();
    updateFavoritosBadges();
    updateAllTemaBookmarkButtons();
    if (favoritosModal && favoritosModal.classList.contains('active')) {
      renderModalFavoritos();
    }
    if (isAdded) {
      showToast(`Adicionado aos favoritos: ${item.titulo}`, 'success');
    } else {
      showToast(`Removido dos favoritos: ${item.titulo}`, 'info');
    }
  }
}

const favManager = new FavoritosManager();

function getFavoritoIconSvg(type) {
  if (type === 'flame') {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>`;
  } else if (type === 'eye') {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  } else {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`;
  }
}

function renderFavoritosWidget() {
  if (!favoritosList) return;
  const items = favManager.getAll();
  favoritosList.innerHTML = '';

  if (items.length === 0) {
    if (favoritosEmptyState) favoritosEmptyState.style.display = 'flex';
    return;
  }
  if (favoritosEmptyState) favoritosEmptyState.style.display = 'none';

  const displayItems = items.slice(0, 4);

  displayItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'favorito-item';
    div.dataset.favId = item.id;

    const authorText = item.autor ? `(${item.autor})` : '';

    div.innerHTML = `
      <div class="favorito-item-icon">
        ${getFavoritoIconSvg(item.icone || 'document')}
      </div>
      <div class="favorito-item-content">
        <h4 class="favorito-item-title" title="${item.titulo}">${item.titulo}</h4>
        ${authorText ? `<span class="favorito-item-author">${authorText}</span>` : ''}
        <span class="favorito-item-tag">${item.categoria || 'GERAL'}</span>
      </div>
      <button type="button" class="favorito-bookmark-btn" aria-label="Remover dos favoritos" title="Remover dos favoritos" data-remove-id="${item.id}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    `;

    div.addEventListener('click', (e) => {
      if (e.target.closest('.favorito-bookmark-btn')) return;
      openFavoritosModal(item.id);
    });

    const removeBtn = div.querySelector('.favorito-bookmark-btn');
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      div.classList.add('removing');
      setTimeout(() => {
        favManager.removeFavoriteById(item.id);
      }, 200);
    });

    favoritosList.appendChild(div);
  });
}

function updateFavoritosBadges() {
  const count = favManager.getAll().length;
  if (topbarFavBadge) {
    topbarFavBadge.textContent = count;
  }
  const sideBadge = document.getElementById('navFavoritosBadge');
  if (sideBadge) {
    sideBadge.textContent = count;
  }
}

function updateAllTemaBookmarkButtons() {
  document.querySelectorAll('.tema-bookmark-btn').forEach(btn => {
    const temaId = btn.dataset.favTemaId;
    const card = btn.closest('.tema-card');
    const titulo = card?.querySelector('.tema-head-info h3')?.textContent?.trim() || '';
    const isFav = favManager.isFavorite(`tema-${temaId}`, titulo);
    btn.classList.toggle('is-active', isFav);
    btn.setAttribute('title', isFav ? 'Remover dos favoritos' : 'Favoritar tema');
    const svg = btn.querySelector('svg');
    if (svg) svg.setAttribute('fill', isFav ? 'currentColor' : 'none');
  });
}

let modalFilter = 'TODOS';
let modalSearch = '';

function openFavoritosModal(highlightId = null) {
  if (!favoritosModal) return;
  favoritosModal.classList.add('active');
  favoritosModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  renderModalFavoritos();

  if (highlightId) {
    setTimeout(() => {
      const el = document.getElementById(`modal-card-${highlightId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.borderColor = 'var(--navy-accent)';
      }
    }, 150);
  }
}

function closeFavoritosModal() {
  if (!favoritosModal) return;
  favoritosModal.classList.remove('active');
  favoritosModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function renderModalFavoritos() {
  if (!modalFavoritosList) return;
  const allItems = favManager.getAll();

  if (favoritosModalCount) {
    favoritosModalCount.textContent = allItems.length;
  }

  const filtered = allItems.filter(item => {
    const matchesCategory = modalFilter === 'TODOS' || 
      (item.categoria && item.categoria.toUpperCase().includes(modalFilter.toUpperCase()));

    const term = modalSearch.toLowerCase();
    const matchesSearch = !term || 
      (item.titulo && item.titulo.toLowerCase().includes(term)) ||
      (item.autor && item.autor.toLowerCase().includes(term)) ||
      (item.contexto && item.contexto.toLowerCase().includes(term)) ||
      (item.citacao && item.citacao.toLowerCase().includes(term));

    return matchesCategory && matchesSearch;
  });

  modalFavoritosList.innerHTML = '';

  if (filtered.length === 0) {
    modalFavoritosList.innerHTML = `
      <div class="favoritos-empty-state" style="margin: 1.5rem 0;">
        <div class="empty-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </div>
        <p class="empty-title">Nenhum favorito encontrado</p>
        <p class="empty-desc">Tente alterar os termos da busca ou mudar o filtro por categoria.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('article');
    card.className = 'modal-favorito-card';
    card.id = `modal-card-${item.id}`;

    const authorText = item.autor ? ` • ${item.autor}` : '';
    const textToCopy = item.citacao || item.contexto || item.titulo;

    card.innerHTML = `
      <div class="modal-favorito-top">
        <div>
          <span class="badge-pill" style="margin-bottom: 0.35rem; display: inline-block;">${item.categoria || 'REPERTÓRIO'}</span>
          <h3 class="modal-favorito-title">${item.titulo}${authorText}</h3>
        </div>
        <button type="button" class="remove-modal-favorito-btn" title="Remover de favoritos" data-id="${item.id}">
          Remover
        </button>
      </div>

      ${item.citacao ? `<p class="modal-favorito-desc"><em>"${item.citacao}"</em></p>` : ''}
      ${item.contexto ? `<p class="modal-favorito-desc" style="color: var(--ink-muted); font-size: 0.8rem;">${item.contexto}</p>` : ''}

      <div class="modal-favorito-actions">
        <button type="button" class="copy-quote-btn" data-quote="${encodeURIComponent(textToCopy)}">
          ${COPY_ICON_SVG}
          <span>Copiar citação para redação</span>
        </button>
      </div>
    `;

    const removeBtn = card.querySelector('.remove-modal-favorito-btn');
    removeBtn.addEventListener('click', () => {
      favManager.removeFavoriteById(item.id);
    });

    const copyBtn = card.querySelector('.copy-quote-btn');
    copyBtn.addEventListener('click', () => {
      const text = decodeURIComponent(copyBtn.dataset.quote);
      navigator.clipboard.writeText(text).then(() => {
        showToast('Citação copiada para a área de transferência! 📋', 'success');
      }).catch(() => {
        showToast('Não foi possível copiar o texto.', 'error');
      });
    });

    modalFavoritosList.appendChild(card);
  });
}

let toastTimer = null;
function showToast(message, type = 'info') {
  if (!toastNotification || !toastMessage) return;
  toastMessage.textContent = message;
  toastNotification.classList.add('active');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastNotification.classList.remove('active');
  }, 3000);
}

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

// Quantidade de itens visíveis por coluna antes do "Ver mais" ou do clique no tema
const LIMITE_TESES = 2;
const LIMITE_REPERTORIOS = 2;

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

  const liFav = document.createElement('li');
  liFav.innerHTML = `
    <a href="#favoritos" id="navFavoritosLink">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
      <span class="nome">Favoritos</span>
      <span class="nav-fav-badge" id="navFavoritosBadge">${favManager.getAll().length}</span>
    </a>
  `;
  const aFav = liFav.querySelector('a');
  if (aFav) {
    aFav.addEventListener('click', (e) => {
      e.preventDefault();
      openFavoritosModal();
    });
  }
  eixosNavList.appendChild(liFav);

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
    const botaoMais = (total, limite, rotulo) => (!expandido && total > limite)
      ? `<button type="button" class="ver-mais" data-restantes="${total - limite}" data-rotulo="${rotulo}">Ver mais ${total - limite} ${rotulo}</button>`
      : '';

    const argsHtml = args.length > 0
      ? args.map((arg, i) => `
          <article class="arg${extra(i, LIMITE_TESES)}" data-copyable>
            <div class="entry-meta">
              <span class="entry-key">${arg.direto === false ? 'Tese Relacionada' : 'Tese Argumentativa'}</span>
              <button class="copy" type="button" title="Copiar tese" aria-label="Copiar tese">${COPY_ICON_SVG}</button>
            </div>
            <h4 class="tese" data-part>${destacarTermo(arg.descricao, destaqueBusca)}</h4>
            ${arg.direto === false && arg.tema_origem ? `<p class="rep-uso">Tema correlato: <em>${destacarTermo(arg.tema_origem, destaqueBusca)}</em></p>` : ''}
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
            ${rep.direto === false && rep.tema_origem ? `<p class="rep-uso">Tema correlato: <em>${destacarTermo(rep.tema_origem, destaqueBusca)}</em></p>` : ''}
          </article>
        `).join('')
      : `<p class="qtd">Nenhum repertório registrado nesta categoria.</p>`;

    const isMobileAberto = expandido || idx === 0 ? ' is-open-mobile' : '';
    const isTemaFav = favManager.isFavorite(`tema-${tema.id}`, tema.titulo);

    html += `
      <section class="tema-card${isMobileAberto}" id="tema-${tema.id}" data-tema-id="${tema.id}">
        <div class="tema-card-top" data-toggle-card>
          <div class="tema-icon-box" aria-hidden="true">
            ${obterIconeCardTema(tema)}
          </div>
          <div class="tema-head-info">
            <h3>
              <a href="#tema-${tema.id}" class="tema-link" data-tema-id="${tema.id}">
                ${destacarTermo(tema.titulo, destaqueBusca)}
              </a>
            </h3>
            <div class="tema-submeta">
              <span class="badge-pill">${tema.eixo || 'Eixo Geral'}</span>
              <span class="mobile-card-hint">${args.length} teses · ${repsFiltrados.length} repertórios</span>
            </div>
          </div>
          <button type="button" class="tema-bookmark-btn ${isTemaFav ? 'is-active' : ''}" data-fav-tema-id="${tema.id}" title="${isTemaFav ? 'Remover dos favoritos' : 'Favoritar tema'}" aria-label="Favoritar tema">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${isTemaFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
          <button type="button" class="mobile-card-chevron" aria-label="Expandir ou recolher tema">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>
        <div class="cols">
          <div class="col-pane-left">
            <h4 class="col-title">Teses (${args.length})</h4>
            <div class="entry-list">
              ${argsHtml}
            </div>
            ${botaoMais(args.length, LIMITE_TESES, 'teses relacionadas')}
          </div>
          <div class="col-pane-right">
            <h4 class="col-title">Repertórios (${repsFiltrados.length})</h4>
            <div class="entry-list">
              ${repsHtml}
            </div>
            ${botaoMais(repsFiltrados.length, LIMITE_REPERTORIOS, 'repertórios relacionados')}
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
  const eixoNome = rec.eixo_sugerido || 'Eixo não identificado';
  const semRelacao = args.length === 0;

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
          <h2>${semRelacao ? 'Temas próximos no catálogo' : 'Temas correlatos no catálogo'}</h2>
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
        <p>${rec.eixo_sugerido
          ? `Proposta classificada no eixo <strong>${rec.eixo_sugerido}</strong> com base no repertório da plataforma.`
          : 'Não foi possível classificar esta proposta em um dos eixos da plataforma.'}</p>
      </div>
      <ul class="counts">
        <li><strong>${args.length}</strong> teses recomendadas</li>
        <li><strong>${reps.length}</strong> repertórios recomendados</li>
      </ul>
    </div>

    ${semRelacao ? `
    <div class="empty-state">
      <p>Ainda não temos teses diretamente ligadas a este tema no catálogo.</p>
      <p style="font-size: 0.875rem; margin-top: 0.5rem;">
        ${correlatos.length > 0
          ? 'Confira abaixo os temas mais próximos, que podem servir de ponto de partida para a sua argumentação.'
          : 'Tente descrever o tema com outras palavras ou navegue pelos eixos temáticos no menu lateral.'}
      </p>
    </div>
    ` : `
    <section class="tema-card">
      <div class="tema-card-top">
        <div class="tema-icon-box" aria-hidden="true">
          ${obterIconeCardTema(rec.eixo_sugerido || rec)}
        </div>
        <div class="tema-head-info">
          <h3>${rec.tema_pesquisado}</h3>
          <span class="badge-pill">${eixoNome}</span>
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
    `}

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
        <span class="meta">${rec.eixo_sugerido || 'Eixo não identificado'}</span>
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

    if (sidebarScroll && mobileEixosBtn) {
      sidebarScroll.classList.remove('is-open');
      mobileEixosBtn.setAttribute('aria-expanded', 'false');
    }

    const rawId = link.dataset.eixoId;
    if (rawId === 'todos') {
      if (mobileEixosLabel) mobileEixosLabel.textContent = 'Eixos';
      voltarParaTodosTemas();
      return;
    }

    eixoSelecionadoId = parseInt(rawId, 10);
    btnVerTodos.style.display = 'inline-block';

    const eixoObj = todosEixos.find(x => x.id === eixoSelecionadoId);
    if (mobileEixosLabel && eixoObj) {
      mobileEixosLabel.textContent = eixoObj.nome.split(',')[0];
    }
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

// Clicar na seta ou em um card fechado no celular abre o acordeão; clicar no título do tema (ou cabeçalho no desktop) abre o tema completo com todas as teses e repertórios relacionados
resultsContainer.addEventListener('click', (e) => {
  const bookmarkBtn = e.target.closest('.tema-bookmark-btn');
  if (bookmarkBtn) {
    e.preventDefault();
    e.stopPropagation();
    const temaId = bookmarkBtn.dataset.favTemaId;
    const tema = (temasExibidosAtualmente || []).find(t => String(t.id) === String(temaId)) || (todosTemas || []).find(t => String(t.id) === String(temaId));
    if (tema) {
      const itemData = {
        id: `tema-${tema.id}`,
        titulo: tema.titulo,
        autor: tema.eixo || 'Tema ENEM',
        categoria: (tema.eixo || 'GERAL').toUpperCase(),
        icone: 'document',
        contexto: `Tema de redação do eixo ${tema.eixo || 'Geral'}. Contém teses e repertórios catalogados.`
      };
      favManager.toggleFavorite(itemData);
    }
    return;
  }

  const chevronBtn = e.target.closest('.mobile-card-chevron');
  const cardTop = e.target.closest('[data-toggle-card]');
  const temaLink = e.target.closest('.tema-link');
  const isMobile = window.matchMedia('(max-width: 960px)').matches;

  if (chevronBtn && isMobile) {
    e.preventDefault();
    const card = chevronBtn.closest('.tema-card');
    if (card) {
      card.classList.toggle('is-open-mobile');
    }
    return;
  }

  if (cardTop && isMobile) {
    const card = cardTop.closest('.tema-card');
    if (card && !card.classList.contains('is-open-mobile')) {
      e.preventDefault();
      card.classList.add('is-open-mobile');
      return;
    }
  }

  if (temaLink) {
    e.preventDefault();
    carregarTemaPorId(temaLink.dataset.temaId, searchInput.value.trim());
    return;
  }

  if (cardTop && !isMobile) {
    const card = cardTop.closest('.tema-card');
    if (card && card.dataset.temaId) {
      e.preventDefault();
      carregarTemaPorId(card.dataset.temaId, searchInput.value.trim());
    }
  }
});

if (brandHome) {
  brandHome.addEventListener('click', (e) => {
    e.preventDefault();
    if (mobileEixosLabel) mobileEixosLabel.textContent = 'Eixos';
    voltarParaTodosTemas();
  });
}
if (btnVerTodos) {
  btnVerTodos.addEventListener('click', () => {
    if (mobileEixosLabel) mobileEixosLabel.textContent = 'Eixos';
    voltarParaTodosTemas();
  });
}

// "Ver mais" / "Ver menos" nas colunas do card de tema
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.ver-mais');
  if (!btn) return;
  const lista = btn.previousElementSibling;
  if (!lista) return;
  const aberto = lista.classList.toggle('expanded');
  const rotulo = btn.dataset.rotulo || '';
  btn.textContent = aberto ? 'Ver menos' : `Ver mais ${btn.dataset.restantes} ${rotulo}`.trim();
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

// Listeners do Módulo de Favoritos
if (btnVerTodosFavoritos) {
  btnVerTodosFavoritos.addEventListener('click', () => openFavoritosModal());
}

if (topbarFavBtn) {
  topbarFavBtn.addEventListener('click', () => openFavoritosModal());
}

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeFavoritosModal);
}

if (favoritosModal) {
  favoritosModal.addEventListener('click', (e) => {
    if (e.target === favoritosModal) closeFavoritosModal();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && favoritosModal && favoritosModal.classList.contains('active')) {
    closeFavoritosModal();
  }
});

if (modalFilterPills) {
  modalFilterPills.addEventListener('click', (e) => {
    const pill = e.target.closest('.filter-pill');
    if (!pill) return;
    modalFilterPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    modalFilter = pill.dataset.filter || 'TODOS';
    renderModalFavoritos();
  });
}

if (modalSearchInput) {
  modalSearchInput.addEventListener('input', (e) => {
    modalSearch = e.target.value.trim();
    renderModalFavoritos();
  });
}

// Renderiza o widget inicial de favoritos e atualiza os marcadores
renderFavoritosWidget();
updateFavoritosBadges();

// Inicia carregando os dados reais do Supabase
inicializarLandingPage();
