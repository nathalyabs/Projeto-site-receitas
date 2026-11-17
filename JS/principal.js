
const campoBusca = document.getElementById("campoBusca");
const botaoBuscar = document.getElementById("botaoBuscar");
const botaoFavoritos = document.getElementById("botaoFavoritos");
const listaReceitas = document.getElementById("listaReceitas");
const mensagem = document.getElementById("mensagem");
const tituloLista = document.getElementById("tituloLista");

let receitas = [];
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
let mostrandoFavoritos = false;

async function buscarReceitas(nome) {

    mostrandoFavoritos = false;
    tituloLista.textContent = "Receitas";
    botaoFavoritos.textContent = "Ver favoritos";

    mensagem.textContent = "Carregando receitas...";
    listaReceitas.innerHTML = "";

    try {

        const resposta = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(nome)}`
        );

        const dados = await resposta.json();

        receitas = dados.meals || [];
        localStorage.setItem("receitasAPI", JSON.stringify(receitas));// Salva as receitas encontradas pela API para outras páginas utilizarem

        if (receitas.length === 0) {
            mensagem.textContent = "Nenhuma receita encontrada.";
        } else {
            mensagem.textContent = "";
            mostrarReceitas(receitas);
        }

    } catch (erro) {

        mensagem.textContent = "Erro ao carregar as receitas.";

        console.log("Erro:", erro);
    }
}

function mostrarReceitas(lista) {

    listaReceitas.innerHTML = "";

    lista.forEach(function(receita) {

        const cartao = document.createElement("div");
        cartao.classList.add("cartao");

        const imagem = document.createElement("img");
        imagem.src = receita.strMealThumb;
        imagem.alt = receita.strMeal;

        const nome = document.createElement("h3");
        nome.textContent = receita.strMeal;

        const categoria = document.createElement("p");
        categoria.textContent = "Categoria: " + (receita.strCategory || "Não informada");

        const origem = document.createElement("p");
        origem.textContent = "Origem: " + (receita.strArea || "Não informada");

        const botao = document.createElement("button");

        const jaFavoritado = favoritos.some(
            function(item) {
                return item.idMeal === receita.idMeal;
            }
        );

        botao.textContent = jaFavoritado
            ? "Remover dos favoritos"
            : "Adicionar aos favoritos";

        botao.addEventListener("click", function() {
            alterarFavorito(receita);
        });

        cartao.appendChild(imagem);
        cartao.appendChild(nome);
        cartao.appendChild(categoria);
        cartao.appendChild(origem);
        cartao.appendChild(botao);

        listaReceitas.appendChild(cartao);

    });
}

function alterarFavorito(receita) {

    const existe = favoritos.some(function(item) {
        return item.idMeal === receita.idMeal;
    });

    if (existe) {

        favoritos = favoritos.filter(function(item) {
            return item.idMeal !== receita.idMeal;
        });

    } else {

        favoritos.push(receita);

    }

    salvarFavoritos();

    if (mostrandoFavoritos) {
        mostrarFavoritos();
    } else {
        mostrarReceitas(receitas);
    }
}

function salvarFavoritos() {

    localStorage.setItem("favoritos", JSON.stringify(favoritos));

}

function mostrarFavoritos() {

    mostrandoFavoritos = true;

    tituloLista.textContent = "Minhas receitas favoritas";
    botaoFavoritos.textContent = "Voltar às receitas";

    listaReceitas.innerHTML = "";

    if (favoritos.length === 0) {

        mensagem.textContent = "Você ainda não possui favoritos.";

    } else {

        mensagem.textContent = "";
        mostrarReceitas(favoritos);

    }
}

botaoBuscar.addEventListener("click", function() {

    const nome = campoBusca.value.trim();

    if (nome !== "") {
        buscarReceitas(nome);
    }

});

campoBusca.addEventListener("keydown", function(evento) {

    if (evento.key === "Enter") {
        botaoBuscar.click();
    }

});

botaoFavoritos.addEventListener("click", function() {

    if (mostrandoFavoritos) {

        buscarReceitas(campoBusca.value.trim() || "chicken");

    } else {

        mostrarFavoritos();

    }

});

buscarReceitas("chicken");
