// Quantidade mínima de ingredientes para a estatística "receitas mais elaboradas"
const MINIMO_INGREDIENTES = 8;

let receitasAPI = JSON.parse(localStorage.getItem("receitasAPI")) || [];
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

const receitaSelect = document.getElementById("receita");
const porcoesOriginais = document.getElementById("original");
const porcoesDesejadas = document.getElementById("desejada");
const botaoCalcular = document.getElementById("calcular");
const mensagemErro = document.getElementById("erro");
const resultado = document.getElementById("resultado");
const tituloResultado = document.getElementById("tituloResultado");
const fatorResultado = document.getElementById("fator");
const listaIngredientes = document.getElementById("lista");

const listaReceitas = document.getElementById("listaReceitas");

const statQtdFavoritas = document.getElementById("statQtdFavoritas");
const statMediaFavoritas = document.getElementById("statMediaFavoritas");
const statMediaGeral = document.getElementById("statMediaGeral");
const statFavoritasLongas = document.getElementById("statFavoritasLongas");

// Funções matemáticas básicas(TDE 01)

function somar(a, b) {
    return a + b;
}

function subtrair(a, b) {
    return a - b;
}

function multiplicar(a, b) {
    return a * b;
}

function dividir(a, b) {
    if (b === 0) {
        // Divisão por zero: mostra uma mensagem na tela em vez de devolver Infinity
        mensagemErro.textContent = "Não é possível dividir por zero.";
        return 0;
    }
    return a / b;
}

// Função que recebe outra função como parâmetro (callback):
// "operacao" pode ser somar, subtrair, multiplicar ou dividir
function calcularOperacao(a, b, operacao) {
    return operacao(a, b);
}

//Formatando números(2 casas decimais e vírgula como separador decimal)

function formatar(numero) {
    return Number(numero.toFixed(2)).toString().replace(".", ",");
}


// A API entrega os ingredientes em campos separados
// (strIngredient1, strMeasure1, ...). Aqui viram uma lista.
function organizarIngredientes(receita) {
    const ingredientes = [];

    for (let i = 1; i <= 20; i++) {
        const nome = receita["strIngredient" + i];
        const quantidade = receita["strMeasure" + i];

        if (nome && nome.trim() !== "") {
            ingredientes.push({
                nome: nome.trim(),
                quantidade: quantidade ? quantidade.trim() : ""
            });
        }
    }

    return ingredientes;
}
// Entende: 2, 1.5, 1/2 e 1 1/2
// Devolve a quantidade (número) e a unidade (texto restante)
function interpretarMedida(medida) {
    const achou = medida.trim().match(
        /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:[.,]\d+)?)(.*)$/
    );

    if (!achou) {
        return null;
    }

    let quantidade = 0;

    // "1 1/2" vira duas partes: "1" e "1/2", que são somadas
    achou[1].split(" ").forEach(parte => {
        if (parte.includes("/")) {
            const fracao = parte.split("/");
            quantidade = somar(quantidade, dividir(Number(fracao[0]), Number(fracao[1])));
        } else {
            quantidade = somar(quantidade, Number(parte.replace(",", ".")));
        }
    });

    return { quantidade: quantidade, unidade: achou[2] };
}
//Select de receitas (TDE 02)
function carregarReceitas() {

    // Junta API + favoritos sem repetir (o Map usa o idMeal como chave)
    const todasReceitas = [
        ...new Map(
            [...receitasAPI, ...favoritos].map(r => [r.idMeal, r])
        ).values()
    ];

    receitaSelect.innerHTML = '<option value="">Selecione uma receita</option>';

    todasReceitas.forEach(receita => {
        const opcao = document.createElement("option");
        opcao.value = receita.idMeal;
        opcao.textContent = receita.strMeal;
        receitaSelect.appendChild(opcao);
    });
}

function obterReceitaSelecionada() {
    return [...receitasAPI, ...favoritos].find(
        receita => receita.idMeal === receitaSelect.value
    );
}
//Calcula as novas porções

function calcular() {

    // Limpa o que estava na tela
    mensagemErro.textContent = "";
    resultado.hidden = true;
    listaIngredientes.innerHTML = "";

    const original = Number(porcoesOriginais.value);
    const desejada = Number(porcoesDesejadas.value);
    const receita = obterReceitaSelecionada();

    // Validações
    if (!receita) {
        mensagemErro.textContent = "Selecione uma receita.";
        return;
    }

    if (original <= 0 || desejada <= 0) {
        mensagemErro.textContent = "Informe quantidades de porções maiores que zero.";
        return;
    }

    const ingredientes = organizarIngredientes(receita);

    if (ingredientes.length === 0) {
        mensagemErro.textContent = "Essa receita não possui ingredientes disponíveis.";
        return;
    }

    // Fator = porções desejadas ÷ porções originais
    const fator = calcularOperacao(desejada, original, dividir);

    ingredientes.forEach(ingrediente => {
        const item = document.createElement("li");
        const medida = interpretarMedida(ingrediente.quantidade);
        if (medida === null || /\d/.test(medida.unidade)) {
            item.textContent = `${ingrediente.nome}: ${ingrediente.quantidade || "Quantidade não informada"}`;
        } else {
            const novaQuantidade = calcularOperacao(medida.quantidade, fator, multiplicar);

            // Diferença entre a quantidade nova e a original
            const diferenca = subtrair(novaQuantidade, medida.quantidade);

            item.textContent = `${ingrediente.nome}: ${formatar(novaQuantidade)}${medida.unidade}`;
        }

        listaIngredientes.appendChild(item);
    });

    tituloResultado.textContent = receita.strMeal;
    fatorResultado.textContent = `Fator de ajuste: ${formatar(fator)}x`;
    resultado.hidden = false;
}

// Estatísticas 
// Média de ingredientes de uma lista de receitas
function mediaIngredientes(lista) {
    let total = 0;

    lista.forEach(receita => {
        total = somar(total, organizarIngredientes(receita).length);
    });

    // Lista vazia: devolve 0 sem tentar dividir por zero
    if (lista.length === 0) {
        return 0;
    }

    return dividir(total, lista.length);
}

// Filtra as receitas que têm pelo menos "minimo" ingredientes
function filtrarPorIngredientes(lista, minimo) {
    return lista.filter(receita => organizarIngredientes(receita).length >= minimo);
}

function calcularEstatisticas() {
    statQtdFavoritas.textContent = favoritos.length;
    statMediaFavoritas.textContent = formatar(mediaIngredientes(favoritos));
    statMediaGeral.textContent = formatar(mediaIngredientes(receitasAPI));
    statFavoritasLongas.textContent = filtrarPorIngredientes(favoritos, MINIMO_INGREDIENTES).length;
}
//Lista favs
function mostrarReceitas() {
    listaReceitas.innerHTML = "";

    if (favoritos.length === 0) {
        const item = document.createElement("li");
        item.textContent = "Você ainda não possui receitas favoritas.";
        listaReceitas.appendChild(item);
        return;
    }

    favoritos.forEach(receita => {
        const item = document.createElement("li");

        const nome = document.createElement("span");
        nome.textContent = receita.strMeal;

        const botaoRemover = document.createElement("button");
        botaoRemover.textContent = "Remover";
        botaoRemover.dataset.id = receita.idMeal;

        item.appendChild(nome);
        item.appendChild(botaoRemover);
        listaReceitas.appendChild(item);
    });
}

// Remover um favorito
listaReceitas.addEventListener("click", function(evento) {
    if (evento.target.tagName === "BUTTON") {
        const id = evento.target.dataset.id;

        favoritos = favoritos.filter(receita => receita.idMeal !== id);
        localStorage.setItem("favoritos", JSON.stringify(favoritos));

        mostrarReceitas();
        calcularEstatisticas();
        carregarReceitas();
        resultado.hidden = true;
    }
});

//eventos

botaoCalcular.addEventListener("click", calcular);

// Ao trocar de receita, limpa o resultado e a mensagem de erro
receitaSelect.addEventListener("change", function() {
    resultado.hidden = true;
    mensagemErro.textContent = "";
});

carregarReceitas();
mostrarReceitas();
calcularEstatisticas();