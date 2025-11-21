// Seleciona o elemento HTML com a classe "card-container" e o armazena na variável cardContainer.
// Este container será usado para exibir os cards das linguagens de programação.
let cardContainer = document.querySelector(".card-container");
// Seleciona o elemento <input> dentro do <header> e o armazena na variável campoBusca.
// Este é o campo onde o usuário digitará o termo para a busca.
let campoBusca = document.querySelector("main input");
// Seleciona o elemento <button> dentro do <header> e o armazena na variável botaoBusca.
// Este é o botão que o usuário clicará para iniciar a busca.
let botaoBusca = document.querySelector("main button");
// Inicializa um array vazio chamado 'dados'. Este array será preenchido com os dados do arquivo data.json.
let dados = [];

// Define uma função assíncrona chamada IniciarBusca. Funções 'async' permitem o uso do 'await' para esperar por operações demoradas.
async function IniciarBusca (){
    // Verifica se o array 'dados' está vazio. Isso evita carregar o arquivo .json repetidamente.
    if (dados.length === 0){
        try {
            // 'fetch' busca o arquivo 'data.json'. 'await' pausa a função até que a requisição seja completada.
            let resposta = await fetch("data.json");
            // Converte a resposta da requisição para o formato JSON. 'await' pausa até a conversão terminar.
            dados = await resposta.json();
        } catch (error) {
            // Se ocorrer um erro ao buscar ou converter os dados, uma mensagem de erro é exibida no console.
            console.error("Falha ao buscar os dados:", error);
            return;
        }
    }

    // Pega o valor do campo de busca, converte para letras minúsculas para uma busca não sensível a maiúsculas/minúsculas.
    const termoBusca = campoBusca.value.toLowerCase();
    // Filtra o array 'dados'. A função 'filter' cria um novo array com todos os elementos que passam no teste.
    const dadosFiltrados = dados.filter(dado =>
        // O teste verifica se o nome ou a descrição do 'dado' (em minúsculas) inclui o termo da busca.
        dado.nome.toLowerCase().includes(termoBusca) ||
        dado.descricao.toLowerCase().includes(termoBusca)
);

    // Chama a função renderizarCards, passando o array com os dados filtrados para serem exibidos na tela.
    renderizarCards(dadosFiltrados);
}

function renderizarCards(dados) {
    // Limpa o conteúdo atual do container de cards para exibir apenas os resultados da nova busca.
    cardContainer.innerHTML = "";
    // Itera sobre cada objeto 'dado' dentro do array 'dados' (que pode ser o completo ou o filtrado).
    for (const dado of dados) {
        // Cria um novo elemento HTML <article> para representar o card.
        const card = document.createElement("article");
        // Adiciona a classe "card" ao elemento <article> para aplicar os estilos CSS.
        card.classList.add("card");

        // Adiciona um SVG placeholder como o usuário mencionou que as imagens virão depois.
        card.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"></path></svg>
            <div class="card__content">
                <p class="card__title">${dado.nome}</p>
                <p class="card__description">${dado.descricao}</p>
            </div>
        `;
        // Adiciona um evento de clique ao card para abrir o link
        if (dado.link) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                window.open(dado.link, '_blank');
            });
        }

        cardContainer.appendChild(card);
    }
}

// Adiciona um "escutador de eventos" ao botão de busca.
// Quando o botão for clicado ("click"), a função IniciarBusca será executada.
botaoBusca.addEventListener("click", IniciarBusca);

// Template strings -> dados dinâmicos dentro de um texto, utiliza-se crase (``)
// parâmetros -> quaisquer resposta que estamos procurando de dados externos outras funções....
// função assíncrona -> não necessariamente irá ter a resposta