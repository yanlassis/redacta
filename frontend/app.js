// 1. Capturando o campo de texto
const searchInput = document.getElementById('searchInput');

// 2. Capturando o botão de busca
const searchBtn = document.getElementById('searchBtn');

// 3. Capturando a lista de sugestões (Autocomplete) e o painel de resultados
const resultsContainer = document.getElementById('resultsContainer');
const suggestList = document.querySelector('.suggest');

const API_URL = 'http://localhost:3000/api/temas/busca';

// Função para buscar temas na API
async function buscarTemas(termo) {
    // Estado de Loading
    searchBtn.disabled = true;
    searchBtn.textContent = 'Buscando...';
    
    // Mostra a lista suspensa e avisa que está carregando, sem apagar o layout de trás!
    suggestList.style.display = 'block';
    suggestList.innerHTML = '<li><a href="#"><span>Carregando temas...</span></a></li>';

    try {
        const url = termo ? `${API_URL}?q=${encodeURIComponent(termo)}` : API_URL;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();

        // Estado de Sucesso ou Vazio
        if (data.length === 0) {
            suggestList.innerHTML = '<li><a href="#"><span>Nenhum tema encontrado.</span></a></li>';
        } else {
            renderizarCards(data);
        }

    } catch (error) {
        console.error("Erro ao buscar temas:", error);
        // Estado de Erro
        suggestList.innerHTML = '<li><a href="#"><span>Erro ao buscar os temas.</span></a></li>';
    } finally {
        // Restaurar estado do botão
        searchBtn.disabled = false;
        searchBtn.textContent = 'Buscar';
    }
}

// Função para renderizar as sugestões programaticamente
function renderizarCards(temas) {
    suggestList.innerHTML = ''; // Limpar resultados anteriores

    temas.forEach(tema => {
        const li = document.createElement('li');
        
        // Coloca o título vindo do banco e uma tag fictícia de eixos
        li.innerHTML = `<a href="#"><span>${tema.titulo}</span><span class="meta">Novo!</span></a>`;
        
        suggestList.appendChild(li);
    });
}

// Variável para evitar que o JS vá no banco de dados a cada milissegundo (Debounce)
let timeoutId;

// Event Listener para quando o usuário digita
searchInput.addEventListener('input', (e) => {
    const termo = e.target.value.trim();

    // Se o usuário apagar tudo, escondemos a lista
    if (termo === '') {
        suggestList.innerHTML = '';
        suggestList.style.display = 'none';
        return;
    }

    // Cancelamos a busca anterior se ele ainda está digitando
    clearTimeout(timeoutId);

    // Esperamos 300ms após ele parar de digitar para ir no banco
    timeoutId = setTimeout(() => {
        buscarTemas(termo);
    }, 300);
});

// Mantemos o evento de click e enter (caso o usuário aperte o enter ansioso ou clique na lupa)
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const termo = searchInput.value.trim();
    if(termo) buscarTemas(termo);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const termo = searchInput.value.trim();
        if(termo) buscarTemas(termo);
    }
});
