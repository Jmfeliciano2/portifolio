// ========================================
// AUTENTICAÇÃO
// ========================================

const token = sessionStorage.getItem('adminToken');

// Se não existir token, redireciona para o login imediatamente
if (!token) {
    window.location.replace('/login.html');
}

// ========================================
// ELEMENTOS DO HTML - PROJETOS
// ========================================

const form = document.getElementById('form-projeto');
const projetoId = document.getElementById('projeto-id');
const titulo = document.getElementById('titulo');
const descricao = document.getElementById('descricao');
const tecnologias = document.getElementById('tecnologias');
const githubUrl = document.getElementById('github_url');
const demoUrl = document.getElementById('demo_url');
const imagemUrl = document.getElementById('imagem_url');

const listaProjetos = document.getElementById('lista-projetos');
const contadorProjetos = document.getElementById('contador-projetos');

const btnSalvar = document.getElementById('btn-salvar');
const btnCancelar = document.getElementById('btn-cancelar');

const tituloFormulario = document.getElementById('titulo-formulario');
const mensagemFormulario = document.getElementById('mensagem-formulario');

// ========================================
// ELEMENTOS DO HTML - MENSAGENS
// ========================================

const listaMensagens = document.getElementById('lista-mensagens');
const contadorMensagens = document.getElementById('contador-mensagens');

// ========================================
// TRATAR TOKEN EXPIRADO / INVÁLIDO (401 / 403)
// ========================================

function tratarNaoAutorizado(resposta) {
    if (resposta.status === 401 || resposta.status === 403) {
        sessionStorage.removeItem('adminToken');
        window.location.replace('/login.html?sessao=expirada');
        return true;
    }
    return false;
}

// ========================================
// CARREGAR PROJETOS (GET /api/projetos - PÚBLICA)
// ========================================

async function carregarProjetos() {
    try {
        const resposta = await fetch('/api/projetos', {
            cache: 'no-store'
        });

        if (!resposta.ok) {
            throw new Error('Erro ao carregar projetos.');
        }

        const projetos = await resposta.json();
        renderizarProjetos(projetos);

    } catch (error) {
        console.error(error);
        listaProjetos.innerHTML = `
            <p class="mensagem-erro">
                Não foi possível carregar os projetos.
            </p>
        `;
    }
}

// ========================================
// RENDERIZAR PROJETOS
// ========================================

function renderizarProjetos(projetos) {
    contadorProjetos.textContent =
        `${projetos.length} projeto${projetos.length !== 1 ? 's' : ''}`;

    if (!projetos || projetos.length === 0) {
        listaProjetos.innerHTML = `
            <p class="lista-vazia">
                Nenhum projeto cadastrado.
            </p>
        `;
        return;
    }

    listaProjetos.innerHTML = '';

    projetos.forEach((projeto) => {
        const item = document.createElement('article');
        item.className = 'projeto-item';

        const nome = document.createElement('h3');
        nome.textContent = projeto.titulo;

        const texto = document.createElement('p');
        texto.textContent = projeto.descricao;

        const tech = document.createElement('span');
        tech.className = 'projeto-tecnologias';
        tech.textContent = projeto.tecnologias;

        const acoes = document.createElement('div');
        acoes.className = 'projeto-acoes';

        const editar = document.createElement('button');
        editar.type = 'button';
        editar.className = 'btn-secondary';
        editar.textContent = 'Editar';
        editar.addEventListener('click', () => {
            editarProjeto(projeto);
        });

        const excluir = document.createElement('button');
        excluir.type = 'button';
        excluir.className = 'btn-danger';
        excluir.textContent = 'Excluir';
        excluir.addEventListener('click', () => {
            excluirProjeto(projeto.id);
        });

        acoes.append(editar, excluir);
        item.append(nome, texto, tech, acoes);
        listaProjetos.appendChild(item);
    });
}

// ========================================
// CARREGAR MENSAGENS (GET /api/mensagens - PROTEGIDA COM JWT)
// ========================================

async function carregarMensagens() {
    if (!listaMensagens) return;

    try {
        const resposta = await fetch('/api/mensagens', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            cache: 'no-store'
        });

        if (tratarNaoAutorizado(resposta)) {
            return;
        }

        if (!resposta.ok) {
            throw new Error('Erro ao carregar mensagens.');
        }

        const mensagens = await resposta.json();
        renderizarMensagens(mensagens);

    } catch (error) {
        console.error(error);
        listaMensagens.innerHTML = `
            <p class="mensagem-erro">
                Não foi possível carregar as mensagens.
            </p>
        `;
    }
}

// ========================================
// RENDERIZAR MENSAGENS
// ========================================

function renderizarMensagens(mensagens) {
    if (contadorMensagens) {
        contadorMensagens.textContent =
            `${mensagens.length} mensagem${mensagens.length !== 1 ? 's' : ''}`;
    }

    if (!mensagens || mensagens.length === 0) {
        listaMensagens.innerHTML = `
            <p class="lista-vazia">
                Nenhuma mensagem recebida no momento.
            </p>
        `;
        return;
    }

    listaMensagens.innerHTML = '';

    mensagens.forEach((msg) => {
        const item = document.createElement('article');
        item.className = 'mensagem-item';

        const cabecalho = document.createElement('div');
        cabecalho.className = 'mensagem-cabecalho';

        const autor = document.createElement('span');
        autor.className = 'mensagem-autor';
        autor.textContent = msg.nome;

        const emailLink = document.createElement('a');
        emailLink.className = 'mensagem-email';
        emailLink.href = `mailto:${encodeURIComponent(msg.email)}`;
        emailLink.textContent = msg.email;

        const dataFormatada = msg.data_envio
            ? new Date(msg.data_envio).toLocaleString('pt-BR')
            : 'Data não informada';

        const data = document.createElement('span');
        data.className = 'mensagem-data';
        data.textContent = dataFormatada;

        cabecalho.append(autor, emailLink, data);

        const corpo = document.createElement('p');
        corpo.className = 'mensagem-texto';
        corpo.textContent = msg.mensagem;

        item.append(cabecalho, corpo);
        listaMensagens.appendChild(item);
    });
}

// ========================================
// CREATE / UPDATE PROJETO (PROTEGIDAS COM JWT)
// POST /api/projetos
// PUT  /api/projetos/:id
// ========================================

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const dados = {
        titulo: titulo.value.trim(),
        descricao: descricao.value.trim(),
        tecnologias: tecnologias.value.trim(),
        github_url: githubUrl.value.trim(),
        demo_url: demoUrl.value.trim(),
        imagem_url: imagemUrl.value.trim()
    };

    const id = projetoId.value;
    const editando = Boolean(id);
    const url = editando ? `/api/projetos/${id}` : '/api/projetos';
    const metodo = editando ? 'PUT' : 'POST';

    try {
        btnSalvar.disabled = true;

        const resposta = await fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dados)
        });

        if (tratarNaoAutorizado(resposta)) {
            return;
        }

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.error || 'Não foi possível salvar o projeto.');
        }

        mostrarMensagem(
            editando
                ? 'Projeto atualizado com sucesso!'
                : 'Projeto cadastrado com sucesso!',
            'sucesso'
        );

        limparFormulario();
        await carregarProjetos();

    } catch (error) {
        mostrarMensagem(error.message, 'erro');
    } finally {
        btnSalvar.disabled = false;
    }
});

// ========================================
// PREPARAR EDIÇÃO
// ========================================

function editarProjeto(projeto) {
    projetoId.value = projeto.id;
    titulo.value = projeto.titulo;
    descricao.value = projeto.descricao;
    tecnologias.value = projeto.tecnologias;
    githubUrl.value = projeto.github_url || '';
    demoUrl.value = projeto.demo_url || '';
    imagemUrl.value = projeto.imagem_url || '';

    tituloFormulario.textContent = 'Editar projeto';
    btnSalvar.textContent = 'Salvar alterações';
    btnCancelar.classList.remove('hidden');

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ========================================
// EXCLUIR PROJETO (PROTEGIDA COM JWT)
// DELETE /api/projetos/:id
// ========================================

async function excluirProjeto(id) {
    const confirmou = confirm('Tem certeza que deseja excluir este projeto?');
    if (!confirmou) {
        return;
    }

    try {
        const resposta = await fetch(`/api/projetos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (tratarNaoAutorizado(resposta)) {
            return;
        }

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.error || 'Não foi possível excluir o projeto.');
        }

        mostrarMensagem('Projeto excluído com sucesso!', 'sucesso');
        await carregarProjetos();

    } catch (error) {
        mostrarMensagem(error.message, 'erro');
    }
}

// ========================================
// CANCELAR EDIÇÃO
// ========================================

btnCancelar.addEventListener('click', () => {
    limparFormulario();
    mensagemFormulario.textContent = '';
});

// ========================================
// LIMPAR FORMULÁRIO
// ========================================

function limparFormulario() {
    form.reset();
    projetoId.value = '';
    tituloFormulario.textContent = 'Cadastrar projeto';
    btnSalvar.textContent = 'Cadastrar projeto';
    btnCancelar.classList.add('hidden');
}

// ========================================
// MENSAGENS DE STATUS DO FORMULÁRIO
// ========================================

function mostrarMensagem(texto, tipo) {
    mensagemFormulario.textContent = texto;
    mensagemFormulario.className =
        tipo === 'sucesso' ? 'mensagem-sucesso' : 'mensagem-erro';
}

// ========================================
// LOGOUT
// ========================================

const btnLogout = document.getElementById('btn-logout');

if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        sessionStorage.removeItem('adminToken');
        window.location.replace('/login.html');
    });
}

// ========================================
// INICIALIZAÇÃO
// ========================================

carregarProjetos();
carregarMensagens();