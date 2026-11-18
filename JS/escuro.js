const botaoEscuro = document.getElementById("botaoEscuro");
let modoEscuro = JSON.parse(localStorage.getItem("modoEscuro")) || false;

function aplicarModoEscuro() {

    if (modoEscuro) {
        document.body.classList.add("escuro");
    } else {
        document.body.classList.remove("escuro");
    }

    if (botaoEscuro !== null) {
        botaoEscuro.textContent = modoEscuro ? "Modo claro" : "Modo escuro";
    }
}

if (botaoEscuro !== null) {
    botaoEscuro.addEventListener("click", function() {
        modoEscuro = !modoEscuro;
        localStorage.setItem("modoEscuro", JSON.stringify(modoEscuro));

        aplicarModoEscuro();
    });
}

aplicarModoEscuro();
