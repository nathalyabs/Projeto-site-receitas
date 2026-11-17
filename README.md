# Site de Receitas

Projeto Final - RA 3. Site de receitas que busca dados reais da API pública TheMealDB, tem um formulário que envia dados por POST e fica publicado no GitHub Pages.

**Tema:** receitas
**Site publicado:** (colocar aqui o link do GitHub Pages)

## Integrantes e o que cada um fez

<!-- Trocar pelos nomes de verdade e conferir o que cada uma fez -->

| Integrante | O que fez |
|---|---|
| [Nome da integrante 1] | API e página Receitas: busca, cartões e favoritos |
| [Nome da integrante 2] | Página Ferramentas: calculadora de porções e estatísticas (TDE 01) |
| [Nome da integrante 3] | Estrutura e visual: página inicial, HTML semântico, CSS compartilhado, modo escuro com localStorage, página de contato e POST no JSONPlaceholder |

## Páginas e arquivos

| Página | HTML | JavaScript |
|---|---|---|
| Início | `HTML/index.html` | `JS/escuro.js` |
| Receitas | `HTML/receitas.html` | `JS/principal.js` |
| Ferramentas | `HTML/ferramentas.html` | `JS/ferramentas.js` |
| Contato | `HTML/contato.html` | `JS/escuro.js`, `JS/contato.js` |

Todas as páginas usam o mesmo `CSS/style.css`. O `JS/escuro.js` cuida do modo escuro.

## API usada

| Uso | Método | Endereço |
|---|---|---|
| Buscar receitas | GET | `https://www.themealdb.com/api/json/v1/1/search.php?s=chicken` |
| Enviar o formulário de contato | POST | `https://jsonplaceholder.typicode.com/posts` |

O POST envia um JSON com `title` (assunto), `body` (mensagem), `userId`, `nome`, `email`, `telefone` e `pessoas`. O JSONPlaceholder finge que salva e devolve o status **201**, que aparece na tela como confirmação.

## localStorage

| Chave | O que guarda |
|---|---|
| `favoritos` | Receitas favoritas |
| `receitasAPI` | Última lista de receitas buscada (usada na página Ferramentas) |
| `modoEscuro` | `true` ou `false` |

## TDE 01

*A preencher (nome de cada função, o que recebe, o que devolve e onde é usada).*

## TDE 02

*A preencher (mínimo 3 erros reais, sendo 1 de lógica, com o antes e depois do código, 1 print de breakpoint e 1 erro investigado na aba Network).*
