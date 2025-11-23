// Seleciona o elemento HTML com a classe "card-container" e o armazena na variável cardContainer.
// Este container será usado para exibir os cards das linguagens de programação.
let cardContainer = document.querySelector(".card-container");
// Seleciona o elemento <input> dentro do <main> e o armazena na variável campoBusca.
// Este é o campo onde o usuário digitará o termo para a busca.
let campoBusca = document.querySelector("#campo-busca");
// Seleciona o elemento <button> de busca e o armazena na variável botaoBusca.
// Este é o botão que o usuário clicará para iniciar a busca.
let botaoBusca = document.querySelector("#botao-busca");
// Seleciona os elementos das views
let mainView = document.querySelector("#main-view");
let detalhesView = document.querySelector("#detalhes-view");
let detalhesContainer = document.querySelector("#detalhes-container");
let botaoVoltar = document.querySelector("#botao-voltar");
let header = document.querySelector("header");
let footer = document.querySelector(".footer");
// Inicializa um array vazio chamado 'dados'. Este array será preenchido com os dados do arquivo data.json.
let dados = [];

// Define uma função assíncrona para carregar os dados do arquivo JSON.
async function carregarDados() {
    // Verifica se o array 'dados' está vazio. Isso evita carregar o arquivo .json repetidamente.
    if (dados.length === 0) {
        try {
            // 'fetch' busca o arquivo 'data.json'. 'await' pausa a função até que a requisição seja completada.
            let resposta = await fetch("data.json");
            // Converte a resposta da requisição para o formato JSON. 'await' pausa até a conversão terminar.
            dados = await resposta.json();
            // Exibe todos os dados quando carregar
            renderizarCards(dados);
        } catch (error) {
            // Se ocorrer um erro ao buscar ou converter os dados, uma mensagem de erro é exibida no console.
            console.error("Falha ao buscar os dados:", error);
            return;
        }
    }
}

// Função para mostrar a view principal e esconder a view de detalhes
function mostrarViewPrincipal() {
    detalhesView.classList.add("hidden");
    // Adiciona animação fade-in na view principal
    setTimeout(() => {
        mainView.classList.remove("hidden");
        mainView.style.opacity = '0';
        mainView.style.animation = 'fadeIn 0.4s ease-out forwards';
        setTimeout(() => {
            mainView.style.opacity = '1';
        }, 50);
    }, 100);
    
    header.classList.remove("hidden");
    if (footer) footer.classList.remove("hidden");
}

// Função para mostrar a view de detalhes e esconder a view principal
function mostrarViewDetalhes() {
    mainView.classList.add("hidden");
    // Adiciona animação fade-in na view de detalhes
    setTimeout(() => {
        detalhesView.classList.remove("hidden");
        detalhesView.style.opacity = '0';
        detalhesView.style.animation = 'fadeInView 0.4s ease-out forwards';
        setTimeout(() => {
            detalhesView.style.opacity = '1';
        }, 50);
    }, 100);
    
    header.classList.add("hidden");
    if (footer) footer.classList.add("hidden");
}

// Define uma função para filtrar os dados pelo termo de busca.
function IniciarBusca() {
    // Verifica se os dados já foram carregados
    if (dados.length === 0) {
        console.warn("Dados ainda não foram carregados. Aguarde...");
        return;
    }

    // Pega o valor do campo de busca, converte para letras minúsculas para uma busca não sensível a maiúsculas/minúsculas.
    const termoBusca = campoBusca.value.toLowerCase().trim();
    
    // Se o campo de busca estiver vazio, mostra todos os dados na view principal
    if (termoBusca === "") {
        mostrarViewPrincipal();
        renderizarCards(dados);
        return;
    }

    // Filtra o array 'dados'. A função 'filter' cria um novo array com todos os elementos que passam no teste.
    const dadosFiltrados = dados.filter(dado =>
        // O teste verifica se o nome ou a descrição do 'dado' (em minúsculas) inclui o termo da busca.
        dado.nome.toLowerCase().includes(termoBusca) ||
        dado.descricao.toLowerCase().includes(termoBusca)
    );

    // Se encontrou resultados, mostra a view de detalhes
    if (dadosFiltrados.length > 0) {
        mostrarViewDetalhes();
        renderizarCardsDetalhes(dadosFiltrados);
    } else {
        // Se não encontrou resultados, mantém na view principal e mostra mensagem
        mostrarViewPrincipal();
        cardContainer.innerHTML = "<p style='text-align: center; color: var(--tertiary-color); font-size: 1.2rem;'>Nenhuma extensão encontrada com esse termo.</p>";
    }
}

// Função para mapear o nome da extensão para o nome do arquivo de imagem
function obterNomeImagem(nomeExtensao) {
    const mapeamentoImagens = {
        "Gemini Code Assist": "./assets/gemini.png",
        "GitHub Copilot": "./assets/githubcopilot.png",
        "GitLens": "./assets/gitlens.png",
        "Prettier": "./assets/prettier.png",
        "ESLint": "./assets/eslint.png",
        "Live Server": "./assets/liveserver.webp",
        "Path Intellisense": "./assets/pathintellisense.png",
        "Code Spell Checker": "./assets/codespell.png",
        "Auto Rename Tag": "./assets/autorenametag.png",
        "REST Client": "./assets/restclient.png",
        "vscode-icons": "./assets/vscodeicons.webp"
    };
    return mapeamentoImagens[nomeExtensao] || "./assets/logo.png"; // Retorna logo.png como fallback
}

// Função para criar um card (reutilizável)
function criarCard(dado, index = 0) {
    const card = document.createElement("article");
    card.classList.add("card");
    
    // Adiciona classe para animação fade-in
    card.style.opacity = '0';
    card.style.animationDelay = `${index * 0.05}s`;

    const nomeImagem = obterNomeImagem(dado.nome);

    card.innerHTML = `
        <img src="${nomeImagem}" alt="${dado.nome}" class="card__preview">
        <div class="card__content">
            <p class="card__title">${dado.nome}</p>
            <p class="card__description">${dado.descricao}</p>
        </div>
    `;

    if (dado.link) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            window.open(dado.link, '_blank');
        });
    }

    // Adiciona animação fade-in após um pequeno delay
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.animation = 'fadeIn 0.6s ease-out forwards';
    }, index * 50);

    return card;
}

function renderizarCards(dados) {
    // Limpa o conteúdo atual do container de cards para exibir apenas os resultados da nova busca.
    cardContainer.innerHTML = "";
    // Itera sobre cada objeto 'dado' dentro do array 'dados' (que pode ser o completo ou o filtrado).
    for (let i = 0; i < dados.length; i++) {
        const card = criarCard(dados[i], i);
        cardContainer.appendChild(card);
    }
}

// Função para renderizar cards na view de detalhes
function renderizarCardsDetalhes(dados) {
    detalhesContainer.innerHTML = "";
    // Adiciona animação fade-in no container
    detalhesContainer.style.opacity = '0';
    
    for (let i = 0; i < dados.length; i++) {
        const card = criarCard(dados[i], i);
        detalhesContainer.appendChild(card);
    }
    
    // Anima o container após um pequeno delay
    setTimeout(() => {
        detalhesContainer.style.opacity = '1';
        detalhesContainer.style.animation = 'fadeInView 0.4s ease-out forwards';
    }, 100);
}

// Adiciona um "escutador de eventos" ao botão de busca.
// Quando o botão for clicado ("click"), a função IniciarBusca será executada.
if (botaoBusca) {
    botaoBusca.addEventListener("click", IniciarBusca);
}

// Adiciona evento ao botão voltar
botaoVoltar.addEventListener("click", () => {
    mostrarViewPrincipal();
    campoBusca.value = ""; // Limpa o campo de busca
    renderizarCards(dados); // Mostra todos os cards novamente
});

// Permite buscar pressionando Enter no campo de busca
if (campoBusca) {
    campoBusca.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            IniciarBusca();
        }
    });
}

// Carrega e exibe todos os dados automaticamente quando a página carregar
carregarDados();

// Template strings -> dados dinâmicos dentro de um texto, utiliza-se crase (``)
// parâmetros -> quaisquer resposta que estamos procurando de dados externos outras funções....
// função assíncrona -> não necessariamente irá ter a resposta