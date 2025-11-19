let dados = [];

async function IniciarBusca (){
    let resposta = await fetch("data.json");
    dados = await resposta.json();
    console.log(dados);
}

// função assíncrona -> não necessariamente irá ter a resposta