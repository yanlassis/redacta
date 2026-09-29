// 1. Capturando o campo de texto
const searchInput = document.getElementById('searchInput');

// 2. Capturando o botão de busca
const searchBtn = document.getElementById('searchBtn');

// 3. Capturando a caixa onde os resultados vão aparecer
const resultsContainer = document.getElementById('resultsContainer');

const API_URL = 'http://localhost:3000/api/temas/busca';

// Função para buscar temas na API
async function buscarTemas(termo) {
    // Estado de Loading
    searchBtn.disabled = true;
    searchBtn.textContent = 'Buscando...';
    resultsContainer.innerHTML = '<p>Carregando temas...</p>';

    try {
        const url = termo ? `${API_URL}?q=${encodeURIComponent(termo)}` : API_URL;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();

        // Estado de Sucesso ou Vazio
        if (data.length === 0) {
            resultsContainer.innerHTML = '<p>Nenhum tema encontrado para essa busca.</p>';
        } else {
            renderizarCards(data);
        }

    } catch (error) {
        console.error("Erro ao buscar temas:", error);
        // Estado de Erro
        resultsContainer.innerHTML = '<p>Ocorreu um erro ao buscar os temas. Tente novamente mais tarde.</p>';
    } finally {
        // Restaurar estado do botão
        searchBtn.disabled = false;
        searchBtn.textContent = 'Buscar';
    }
}

// Função para renderizar os cards programaticamente
function renderizarCards(temas) {
    resultsContainer.innerHTML = ''; // Limpar resultados anteriores

    temas.forEach(tema => {
        const card = document.createElement('div');
        card.className = 'card'; 
        
        const titulo = document.createElement('h3');
        titulo.textContent = tema.titulo;
        
        const eixo = document.createElement('p');
        eixo.innerHTML = `<strong>Eixo:</strong> ${tema.eixo}`;

        card.appendChild(titulo);
        card.appendChild(eixo);
        
        resultsContainer.appendChild(card);
    });
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    const termo = searchInput.value.trim();
    buscarTemas(termo);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const termo = searchInput.value.trim();
        buscarTemas(termo);
    }
});
