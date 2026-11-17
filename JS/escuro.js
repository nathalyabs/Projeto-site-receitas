// ==========================================
// MODO ESCURO (usado em todas as páginas)
// ==========================================

const botaoEscuro = document.getElementById("botaoEscuro");

// Lê do localStorage se o modo escuro estava ligado (se não tiver nada salvo, fica false)
let modoEscuro = JSON.parse(localStorage.getItem("modoEscuro")) || false;


// ==========================================
// APLICAR O MODO NA PÁGINA
// ==========================================

function aplicarModoEscuro() {

    // A classe .escuro no body muda as cores (veja o CSS)
    if (modoEscuro) {
        document.body.classList.add("escuro");
    } else {
        document.body.classList.remove("escuro");
    }

    // Só mexe no botão se ele existir na página
    if (botaoEscuro !== null) {
        botaoEscuro.textContent = modoEscuro ? "Modo claro" : "Modo escuro";
    }
}


// ==========================================
// EVENTOS E INICIALIZAÇÃO
// ==========================================

if (botaoEscuro !== null) {
    botaoEscuro.addEventListener("click", function() {

        // Troca: se estava ligado desliga, se estava desligado liga
        modoEscuro = !modoEscuro;

        // Salva a escolha para continuar assim depois de recarregar
        localStorage.setItem("modoEscuro", JSON.stringify(modoEscuro));

        aplicarModoEscuro();
    });
}

aplicarModoEscuro();
