// ==========================================
// 1. ELEMENTOS DO HTML
// ==========================================

// Endereço que recebe o POST (finge que salva e responde 201)
const URL_CONTATO = "https://jsonplaceholder.typicode.com/posts";

const formulario = document.getElementById("formularioContato");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoTelefone = document.getElementById("telefone");
const campoAssunto = document.getElementById("assunto");
const campoPessoas = document.getElementById("pessoas");
const campoMensagem = document.getElementById("mensagem");
const botaoEnviar = document.getElementById("botaoEnviar");
const avisoErro = document.getElementById("avisoErro");
const confirmacao = document.getElementById("confirmacao");


// ==========================================
// 2. VALIDAÇÃO
// ==========================================

// Marca o campo com a classe .erro (a borda fica vermelha) e mostra o aviso
function marcarErro(campo, texto) {
    campo.classList.add("erro");
    avisoErro.textContent = texto;
}

// Devolve true se o formulário está certo e false se tem algum erro
function validarFormulario() {

    const obrigatorios = [campoNome, campoEmail, campoAssunto, campoMensagem];
    let tudoPreenchido = true;

    // Limpa os avisos da tentativa anterior
    avisoErro.textContent = "";
    campoTelefone.classList.remove("erro");
    campoPessoas.classList.remove("erro");

    obrigatorios.forEach(function(campo) {
        campo.classList.remove("erro");

        if (campo.value.trim() === "") {
            campo.classList.add("erro");
            tudoPreenchido = false;
        }
    });

    if (!tudoPreenchido) {
        avisoErro.textContent = "Preencha os campos obrigatórios.";
        return false;
    }

    if (!campoEmail.value.includes("@") || !campoEmail.value.includes(".")) {
        marcarErro(campoEmail, "Digite um e-mail válido.");
        return false;
    }

    // Telefone é opcional, mas se preencher precisa ter DDD + número (10 ou 11 dígitos)
    const digitos = campoTelefone.value.replace(/\D/g, "");

    if (campoTelefone.value.trim() !== "" && digitos.length < 10) {
        marcarErro(campoTelefone, "Digite o telefone com DDD.");
        return false;
    }

    // Número de pessoas também é opcional
    const pessoas = Number(campoPessoas.value);

    if (campoPessoas.value !== "" && (pessoas < 1 || pessoas > 50)) {
        marcarErro(campoPessoas, "Digite um número de pessoas entre 1 e 50.");
        return false;
    }

    if (campoMensagem.value.trim().length < 10) {
        marcarErro(campoMensagem, "A mensagem precisa ter pelo menos 10 letras.");
        return false;
    }

    return true;
}


// ==========================================
// 3. ENVIO (POST)
// ==========================================

async function enviarFormulario(evento) {

    // Não deixa a página recarregar
    evento.preventDefault();

    confirmacao.textContent = "";
    confirmacao.classList.remove("sucesso");

    if (!validarFormulario()) {
        return;
    }

    // Monta o objeto que vai virar JSON
    const dados = {
        title: campoAssunto.value,
        body: campoMensagem.value.trim(),
        userId: 1,
        nome: campoNome.value.trim(),
        email: campoEmail.value.trim(),
        telefone: campoTelefone.value.trim(),
        pessoas: campoPessoas.value
    };

    botaoEnviar.disabled = true;
    confirmacao.textContent = "Enviando...";

    try {

        const resposta = await fetch(URL_CONTATO, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        // Confere o status antes de ler o JSON
        if (!resposta.ok) {
            throw new Error("Status " + resposta.status);
        }

        const resultado = await resposta.json();

        confirmacao.textContent = "Mensagem enviada com sucesso! Status: " + resposta.status + " (Created). Código do envio: " + resultado.id;
        confirmacao.classList.add("sucesso");

        // Limpa o formulário
        formulario.reset();

    } catch (erro) {

        confirmacao.textContent = "";
        avisoErro.textContent = "Não foi possível enviar a mensagem agora (" + erro.message + "). Tente de novo.";
    }

    botaoEnviar.disabled = false;
}


// ==========================================
// 4. EVENTOS
// ==========================================

formulario.addEventListener("submit", enviarFormulario);

// Quando sai do campo de e-mail, já avisa se está errado
campoEmail.addEventListener("blur", function() {

    campoEmail.classList.remove("erro");

    if (campoEmail.value.trim() !== "" && !campoEmail.value.includes("@")) {
        marcarErro(campoEmail, "Digite um e-mail válido.");
    }
});

// Ao começar a digitar, tira a borda vermelha do campo
formulario.addEventListener("input", function(evento) {
    evento.target.classList.remove("erro");
});
