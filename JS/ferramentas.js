// ==========================================
// 1. DADOS DO LOCALSTORAGE
// ==========================================

// Receitas pesquisadas na página Receitas
let receitasAPI = JSON.parse(localStorage.getItem("receitasAPI")) || [];

// Receitas favoritas
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];


// ==========================================
// 2. ELEMENTOS DO HTML
// ==========================================

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


// ==========================================
// 3. FUNÇÕES MATEMÁTICAS
// ==========================================

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
        return 0;
    }
    return a / b;
}


// ==========================================
// 4. FORMATANDO NÚMEROS (2 casas, vírgula)
// ==========================================

function formatar(numero) {
    return Number(numero.toFixed(2)).toString().replace(".", ",");
}


// ==========================================
// 5. INGREDIENTES DA API
// ==========================================

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


// ==========================================
// 6. INTERPRETANDO QUANTIDADES
// ==========================================

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


// ==========================================
// 7. SELECT DE RECEITAS
// ==========================================

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


// ==========================================
// 8. CALCULANDO AS NOVAS PORÇÕES
// ==========================================

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
    const fator = dividir(desejada, original);

    ingredientes.forEach(ingrediente => {
        const item = document.createElement("li");
        const medida = interpretarMedida(ingrediente.quantidade);

        // Sem número no começo (ex.: "Pinch") ou com números extras
        // na unidade (ex.: "175g/6oz"): mostra a medida original
        if (medida === null || /\d/.test(medida.unidade)) {
            item.textContent = `${ingrediente.nome}: ${ingrediente.quantidade || "Quantidade não informada"}`;
        } else {
            const novaQuantidade = multiplicar(medida.quantidade, fator);

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


// ==========================================
// 9. ESTATÍSTICAS
// ==========================================

// Média de ingredientes de uma lista de receitas
function mediaIngredientes(lista) {
    let total = 0;

    lista.forEach(receita => {
        total = somar(total, organizarIngredientes(receita).length);
    });

    return dividir(total, lista.length);
}

function calcularEstatisticas() {
    statQtdFavoritas.textContent = favoritos.length;
    statMediaFavoritas.textContent = formatar(mediaIngredientes(favoritos));
    statMediaGeral.textContent = formatar(mediaIngredientes(receitasAPI));
}


// ==========================================
// 10. LISTA DE FAVORITOS
// ==========================================

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


// ==========================================
// 11. EVENTOS E INICIALIZAÇÃO
// ==========================================

botaoCalcular.addEventListener("click", calcular);

// Ao trocar de receita, limpa o resultado e a mensagem de erro
receitaSelect.addEventListener("change", function() {
    resultado.hidden = true;
    mensagemErro.textContent = "";
});

carregarReceitas();
mostrarReceitas();
calcularEstatisticas();