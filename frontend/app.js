// Seletores do DOM
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const suggestList = document.querySelector('.suggest');
const resultsContainer = document.getElementById('resultsContainer');
const eixosNavList = document.getElementById('eixosNavList');
const categoriasChips = document.getElementById('categoriasChips');
const brandHome = document.getElementById('brandHome');
const btnVerTodos = document.getElementById('btnVerTodos');

const API_BASE = 'http://localhost:3000/api';

// Estado da aplicação carregado do banco
let todosTemas = [];
let todosEixos = [];
let temasExibidosAtualmente = [];
let eixoSelecionadoId = null;
let categoriaSelecionada = 'todas';
let timeoutId = null;

// Utilitário para normalizar nome da categoria para o atributo data-tipo (CSS)
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
    renderizarLandingTemas(todosTemas, 'Catálogo do Banco de Dados');
  } catch (error) {
    console.error('Erro ao inicializar a página:', error);
    resultsContainer.innerHTML = `
      <div class="empty-state">
        Não foi possível carregar os dados do servidor. Verifique se o backend está rodando na porta 3000.
      </div>
    `;
  }
}

// 2. Renderiza a barra lateral exibindo apenas os Eixos
function renderizarMenuEixos() {
  if (!eixosNavList) return;
  eixosNavList.innerHTML = '';

  // Item "Todos os eixos"
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

// 4. Renderiza a Landing Page ou lista filtrada com os Temas, Argumentos e Repertórios do banco
function renderizarLandingTemas(temas, subtitulo = 'Catálogo do Banco de Dados', destaqueBusca = '') {
  temasExibidosAtualmente = temas || [];

  // Filtra os temas que efetivamente serão renderizados (caso haja filtro de categoria ativo)
  const temasParaRenderizar = temasExibidosAtualmente.filter(tema => {
    if (categoriaSelecionada === 'todas' || temasExibidosAtualmente.length === 1) return true;
    const repsFiltrados = (tema.repertorios || []).filter(r => r.categoria === categoriaSelecionada);
    return repsFiltrados.length > 0;
  });

  // Atualiza a barra lateral para refletir exatamente os dados exibidos
  renderizarMenuEixos(temasParaRenderizar);

  if (temasParaRenderizar.length === 0) {
    resultsContainer.innerHTML = `
      <div class="empty-state">
        Nenhum tema encontrado para os critérios selecionados.
      </div>
    `;
    return;
  }

  // Contagens reais exatas dos cards renderizados na tela
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
    : 'Temas e Repertórios para Redação';

  const descricaoContexto = temasParaRenderizar.length === 1
    ? `Eixo temático: ${temasParaRenderizar[0].eixo || 'Geral'}`
    : 'Consulte abaixo os temas, argumentos e repertórios socioculturais cadastrados no banco de dados.';

  let html = `
    <header class="tema">
      <span class="tema-badge">${subtitulo}</span>
      <h1>${tituloPrincipal}</h1>
      <p class="contexto">${descricaoContexto}</p>
      <ul class="counts">
        <li><strong>${temasParaRenderizar.length}</strong> ${temasParaRenderizar.length === 1 ? 'tema' : 'temas'}</li>
        <li><strong>${eixosUnicos}</strong> ${eixosUnicos === 1 ? 'eixo' : 'eixos'}</li>
        <li><strong>${totalArgs}</strong> ${totalArgs === 1 ? 'argumento' : 'argumentos'}</li>
        <li><strong>${totalReps}</strong> ${totalReps === 1 ? 'repertório' : 'repertórios'}</li>
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
            <h4 class="tese" data-part>${destacarTermo(arg.descricao, destaqueBusca)}</h4>
            <button class="copy" type="button">Copiar argumento</button>
          </article>
        `).join('')
      : `<p class="qtd">Nenhum argumento cadastrado para este tema.</p>`;

    const repsHtml = repsFiltrados.length > 0
      ? repsFiltrados.map(rep => `
          <article class="rep" data-tipo="${normalizarTipo(rep.categoria)}" data-copyable>
            <p class="rep-tipo" data-part>${rep.categoria}</p>
            <p class="rep-desc" data-part>${destacarTermo(rep.conteudo, destaqueBusca)}</p>
            <button class="copy" type="button">Copiar repertório</button>
          </article>
        `).join('')
      : `<p class="qtd">Nenhum repertório nesta categoria.</p>`;

    html += `
      <section class="eixo" id="tema-${tema.id}" data-tema-id="${tema.id}">
        <div class="eixo-header">
          <h2>
            <a href="#tema-${tema.id}" class="tema-link" data-tema-id="${tema.id}">
              ${destacarTermo(tema.titulo, destaqueBusca)}
            </a>
          </h2>
          <span class="eixo-tag">${tema.eixo || 'Sem eixo'}</span>
        </div>
        <div class="cols">
          <div>
            <h3 class="col-title">Argumentos (${args.length})</h3>
            ${argsHtml}
          </div>
          <div>
            <h3 class="col-title">Repertórios (${repsFiltrados.length})</h3>
            ${repsHtml}
          </div>
        </div>
      </section>
    `;
  });

  resultsContainer.innerHTML = html;
}

// Utilitário para grifar (<mark>) o termo pesquisado
function destacarTermo(texto, termo) {
  if (!termo || !texto) return texto;
  const escaped = termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return texto.replace(regex, '<mark>$1</mark>');
}

// 5. Carrega um tema específico via GET /api/temas/:id
async function carregarTemaPorId(id, termoDestaque = '') {
  try {
    suggestList.style.display = 'none';
    btnVerTodos.style.display = 'inline-block';

    const response = await fetch(`${API_BASE}/temas/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar detalhes do tema');

    const tema = await response.json();
    eixoSelecionadoId = tema.eixo_id;
    renderizarLandingTemas([tema], `Tema #${tema.id} • ${tema.eixo}`, termoDestaque);
  } catch (error) {
    console.error('Erro ao carregar tema:', error);
  }
}

// 6. Busca na API (/api/temas/busca) para o Autocomplete e filtragem
async function buscarTemas(termo, atualizarPagina = false) {
  searchBtn.disabled = true;
  searchBtn.textContent = 'Buscando...';

  suggestList.style.display = 'block';
  suggestList.innerHTML = '<li><a href="#"><span>Carregando temas...</span></a></li>';

  try {
    const url = termo
      ? `${API_BASE}/temas/busca?q=${encodeURIComponent(termo)}`
      : `${API_BASE}/temas/busca`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      suggestList.innerHTML = '<li><a href="#"><span>Nenhum tema encontrado no banco.</span></a></li>';
      if (atualizarPagina) {
        renderizarLandingTemas([], `Resultados para "${termo}"`);
        btnVerTodos.style.display = 'inline-block';
      }
    } else {
      renderizarSugestoes(data, termo);
      if (atualizarPagina) {
        suggestList.style.display = 'none';
        const idsEncontrados = new Set(data.map(d => d.id));
        const temasFiltrados = todosTemas.filter(t => idsEncontrados.has(t.id));
        btnVerTodos.style.display = 'inline-block';
        renderizarLandingTemas(temasFiltrados, `Resultados para "${termo}"`, termo);
      }
    }
  } catch (error) {
    console.error('Erro ao buscar temas:', error);
    suggestList.innerHTML = '<li><a href="#"><span>Erro ao buscar os temas.</span></a></li>';
  } finally {
    searchBtn.disabled = false;
    searchBtn.textContent = 'Buscar';
  }
}

// Renderiza o dropdown de autocomplete com o nome real do eixo vindo do banco
function renderizarSugestoes(temas, termo) {
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
  renderizarLandingTemas(todosTemas, 'Catálogo do Banco de Dados');
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

// Fechar sugestões ao clicar fora
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
    renderizarLandingTemas(filtrados, `Eixo Temático • ${eixoObj ? eixoObj.nome : ''}`);
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

    const subtitulo = categoriaSelecionada === 'todas'
      ? 'Catálogo do Banco de Dados'
      : `Filtrado por Repertório: ${categoriaSelecionada}`;

    if (categoriaSelecionada !== 'todas') {
      btnVerTodos.style.display = 'inline-block';
    }
    renderizarLandingTemas(filtrados, subtitulo, searchInput.value.trim());
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

// Botões de voltar à visão geral
if (brandHome) {
  brandHome.addEventListener('click', (e) => {
    e.preventDefault();
    voltarParaTodosTemas();
  });
}
if (btnVerTodos) {
  btnVerTodos.addEventListener('click', () => voltarParaTodosTemas());
}

// Botão de Copiar argumento ou repertório
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.copy');
  if (!btn) return;
  const box = btn.closest('[data-copyable]');
  if (!box) return;

  const text = Array.from(box.querySelectorAll('[data-part]'))
    .map(n => n.textContent.trim())
    .join(' — ');

  const original = btn.textContent;
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = 'Copiado!';
  } catch (err) {
    btn.textContent = 'Erro ao copiar';
  }
  setTimeout(() => {
    btn.textContent = original;
  }, 1500);
});

// Inicia carregando os dados reais do Supabase
inicializarLandingPage();
