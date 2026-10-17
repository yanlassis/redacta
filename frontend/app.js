// Seletores do DOM
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const suggestList = document.querySelector('.suggest');
const resultsContainer = document.getElementById('resultsContainer');
const eixosNavList = document.getElementById('eixosNavList');
const categoriasChips = document.getElementById('categoriasChips');
const brandHome = document.getElementById('brandHome');
const btnVerTodos = document.getElementById('btnVerTodos');
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

// Base da API: usa o mesmo domínio na Vercel (/api) ou localhost:3000 em ambiente local
const API_BASE = window.location.hostname === 'localhost' && window.location.port !== '3000' && window.location.port !== ''
  ? 'http://localhost:3000/api'
  : '/api';

// Estado da aplicação carregado do banco
let todosTemas = [];
let todosEixos = [];
let temasExibidosAtualmente = [];
let eixoSelecionadoId = null;
let categoriaSelecionada = 'todas';
let timeoutId = null;

const COPY_ICON_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><rect x="9" y="9" width="11" height="11"/><path d="M5 15H4V4h11v1"/></svg>`;
const CHECK_ICON_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;

function normalizarTipo(categoria) {
  if (!categoria) return 'geral';
  return categoria
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// 1. Inicialização da Landing Page (carrega apenas o que existe no banco)
async function inicializarLandingPage() {
  try {
    const [eixosRes, categoriasRes, temasRes] = await Promise.all([
      fetch(`${API_BASE}/eixos`),
      fetch(`${API_BASE}/categorias`),
      fetch(`${API_BASE}/temas`)
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
    resultsContainer.innerHTML = `
      <div class="empty-state">
        Não foi possível sincronizar o caderno de referências. Verifique se o servidor backend está ativo na porta 3000.
      </div>
    `;
  }
}

// 2. Renderiza o Aparato Marginal exibindo apenas os Eixos com detents quadrados
function renderizarMenuEixos() {
  if (!eixosNavList) return;
  eixosNavList.innerHTML = '';

  const liTodos = document.createElement('li');
  liTodos.innerHTML = `
    <a href="#" data-eixo-id="todos" class="${eixoSelecionadoId === null ? 'active' : ''}">
      <span class="nome">Todos os eixos</span>
    </a>
  `;
  eixosNavList.appendChild(liTodos);

  todosEixos.forEach(eixo => {
    const li = document.createElement('li');
    const isAtivo = eixoSelecionadoId === eixo.id ? 'active' : '';
    li.innerHTML = `
      <a href="#eixo-${eixo.id}" data-eixo-id="${eixo.id}" class="${isAtivo}">
        <span class="nome">${eixo.nome}</span>
      </a>
    `;
    eixosNavList.appendChild(li);
  });
}

// 3. Renderiza os filtros de categorias reais vindos da tabela repertorios
function renderizarChipsCategorias(categorias) {
  if (!categoriasChips) return;
  categoriasChips.innerHTML = '';

  const btnTodas = document.createElement('button');
  btnTodas.type = 'button';
  btnTodas.className = `chip ${categoriaSelecionada === 'todas' ? 'active' : ''}`;
  btnTodas.dataset.categoria = 'todas';
  btnTodas.textContent = 'Todas';
  categoriasChips.appendChild(btnTodas);

  categorias.forEach(cat => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `chip ${categoriaSelecionada === cat ? 'active' : ''}`;
    btn.dataset.categoria = cat;
    btn.textContent = cat;
    categoriasChips.appendChild(btn);
  });
}

// 4. Renderiza a Edição de Referência com os Temas, Argumentos e Repertórios do banco
function renderizarLandingTemas(temas, contextoCustom = null, destaqueBusca = '') {
  temasExibidosAtualmente = temas || [];

  const temasParaRenderizar = temasExibidosAtualmente.filter(tema => {
    if (categoriaSelecionada === 'todas' || temasExibidosAtualmente.length === 1) return true;
    const repsFiltrados = (tema.repertorios || []).filter(r => r.categoria === categoriaSelecionada);
    return repsFiltrados.length > 0;
  });

  renderizarMenuEixos();

  if (temasParaRenderizar.length === 0) {
    resultsContainer.innerHTML = `
      <div class="empty-state">
        Nenhum registro localizado para os critérios selecionados. Ajuste o filtro lateral ou digite seu próprio tema na consulta acima.
      </div>
    `;
    return;
  }

  const eixosUnicos = new Set(temasParaRenderizar.map(t => t.eixo_id).filter(Boolean)).size;
  let totalArgs = 0;
  let totalReps = 0;

  temasParaRenderizar.forEach(t => {
    totalArgs += (t.argumentos || []).length;
    const repsDoTema = (t.repertorios || []).filter(r =>
      categoriaSelecionada === 'todas' || r.categoria === categoriaSelecionada
    );
    totalReps += repsDoTema.length;
  });

  const tituloPrincipal = temasParaRenderizar.length === 1
    ? destacarTermo(temasParaRenderizar[0].titulo, destaqueBusca)
    : 'Catálogo de Temas, Teses e Repertórios';

  const descricaoContexto = contextoCustom
    ? contextoCustom
    : temasParaRenderizar.length === 1
      ? `Eixo temático classificado: ${temasParaRenderizar[0].eixo || 'Geral'}.`
      : 'Índice integral de temas de redação sincronizados com o banco de dados. Selecione um eixo à esquerda ou consulte qualquer tema próprio na barra superior.';

  let html = `
    <header class="tema">
      <h1>${tituloPrincipal}</h1>
      <p class="contexto">${descricaoContexto}</p>
      <ul class="counts">
        <li><strong>${temasParaRenderizar.length}</strong> ${temasParaRenderizar.length === 1 ? 'pauta catalogada' : 'pautas catalogadas'}</li>
        <li><strong>${eixosUnicos}</strong> ${eixosUnicos === 1 ? 'eixo temático' : 'eixos temáticos'}</li>
        <li><strong>${totalArgs}</strong> ${totalArgs === 1 ? 'tese argumentativa' : 'teses argumentativas'}</li>
        <li><strong>${totalReps}</strong> ${totalReps === 1 ? 'repertório legitimado' : 'repertórios legitimados'}</li>
      </ul>
    </header>
  `;

  temasParaRenderizar.forEach(tema => {
    const args = tema.argumentos || [];
    const repsFiltrados = (tema.repertorios || []).filter(r =>
      categoriaSelecionada === 'todas' || r.categoria === categoriaSelecionada
    );

    const argsHtml = args.length > 0
      ? args.map(arg => `
          <article class="arg" data-copyable>
            <div class="entry-meta">
              <span class="entry-key">Tese Argumentativa</span>
              <button class="copy" type="button" title="Copiar tese" aria-label="Copiar tese">${COPY_ICON_SVG}</button>
            </div>
            <h4 class="tese" data-part>${destacarTermo(arg.descricao, destaqueBusca)}</h4>
          </article>
        `).join('')
      : `<p class="qtd">Nenhuma tese cadastrada para este tema.</p>`;

    const repsHtml = repsFiltrados.length > 0
      ? repsFiltrados.map(rep => `
          <article class="rep" data-tipo="${normalizarTipo(rep.categoria)}" data-copyable>
            <div class="entry-meta">
              <p class="rep-tipo" data-part>${rep.categoria}</p>
              <button class="copy" type="button" title="Copiar repertório" aria-label="Copiar repertório">${COPY_ICON_SVG}</button>
            </div>
            <p class="rep-desc" data-part>${destacarTermo(rep.conteudo, destaqueBusca)}</p>
          </article>
        `).join('')
      : `<p class="qtd">Nenhum repertório registrado nesta área.</p>`;

    html += `
      <section class="eixo" id="tema-${tema.id}" data-tema-id="${tema.id}">
        <div class="eixo-header">
          <h2>
            <a href="#tema-${tema.id}" class="tema-link" data-tema-id="${tema.id}">
              ${destacarTermo(tema.titulo, destaqueBusca)}
            </a>
          </h2>
          <span class="eixo-tag">${tema.eixo || 'Eixo Geral'}</span>
        </div>
        <div class="cols">
          <div class="col-pane-left">
            <h3 class="col-title">Teses e Argumentos (${args.length})</h3>
            ${argsHtml}
          </div>
          <div class="col-pane-right">
            <h3 class="col-title">Repertórios Socioculturais (${repsFiltrados.length})</h3>
            ${repsHtml}
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
  const reps = (rec.repertorios || []).filter(r =>
    categoriaSelecionada === 'todas' || r.categoria === categoriaSelecionada
  );
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
      <section class="eixo">
        <div class="eixo-header">
          <h2>Pautas correlatas no catálogo</h2>
        </div>
        <ul class="correlatos-list">
          ${correlatos.map(t => `
            <li>
              <a href="#tema-${t.id}" class="tema-link" data-tema-id="${t.id}">
                <span>${t.titulo}</span>
                <span class="eixo-tag">${t.eixo}</span>
              </a>
            </li>
          `).join('')}
        </ul>
      </section>
    `
    : '';

  resultsContainer.innerHTML = `
    <header class="tema">
      <h1>“${rec.tema_pesquisado}”</h1>
      <p class="contexto">
        Proposta analisada por afinidade vocabular e classificada no eixo <strong>${rec.eixo_sugerido}</strong>.
        Abaixo estão as teses e os repertórios socioculturais da nossa base mais pertinentes para fundamentar sua redação:
      </p>
      <ul class="counts">
        <li>Eixo identificado: <strong>${rec.eixo_sugerido}</strong></li>
        <li><strong>${args.length}</strong> teses recomendadas</li>
        <li><strong>${reps.length}</strong> repertórios recomendados</li>
      </ul>
    </header>

    <section class="eixo">
      <div class="eixo-header">
        <h2>Estrutura recomendada para o tema proposto</h2>
        <span class="eixo-tag">${rec.eixo_sugerido}</span>
      </div>
      <div class="cols">
        <div class="col-pane-left">
          <h3 class="col-title">Teses Recomendadas (${args.length})</h3>
          ${argsHtml}
        </div>
        <div class="col-pane-right">
          <h3 class="col-title">Repertórios Recomendados (${reps.length})</h3>
          ${repsHtml}
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

    const response = await fetch(`${API_BASE}/temas/${id}`);
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
  searchBtn.textContent = 'Consultando...';

  suggestList.style.display = 'block';
  suggestList.innerHTML = '<li><a href="#"><span>Consultando base de referências e analisando eixo...</span></a></li>';

  try {
    const [buscaRes, recRes] = await Promise.all([
      fetch(`${API_BASE}/temas/busca?q=${encodeURIComponent(termo)}`),
      fetch(`${API_BASE}/temas/recomendar?q=${encodeURIComponent(termo)}`)
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
          `Resultados localizados no catálogo para a consulta “${termo}”.`,
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
    searchBtn.textContent = 'Consultar';
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
        <span>Gerar concordância de teses e repertórios para: <strong>“${termo}”</strong></span>
        <span class="meta">[EIXO: ${rec.eixo_sugerido}]</span>
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
  document.querySelectorAll('#categoriasChips .chip').forEach(c => {
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
      `Recorte temático do eixo ${eixoObj ? eixoObj.nome : ''}.`
    );
  });
}

// Filtro por Categoria de Repertório do banco
if (categoriasChips) {
  categoriasChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip[data-categoria]');
    if (!chip) return;

    categoriaSelecionada = chip.dataset.categoria;
    document.querySelectorAll('#categoriasChips .chip').forEach(c => {
      c.classList.toggle('active', c.dataset.categoria === categoriaSelecionada);
    });

    const filtrados = eixoSelecionadoId
      ? todosTemas.filter(t => t.eixo_id === eixoSelecionadoId)
      : todosTemas;

    const contexto = categoriaSelecionada === 'todas'
      ? null
      : `Exibindo apenas pautas com repertórios na área de ${categoriaSelecionada}.`;

    if (categoriaSelecionada !== 'todas') {
      btnVerTodos.style.display = 'inline-block';
    }
    renderizarLandingTemas(filtrados, contexto, searchInput.value.trim());
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
