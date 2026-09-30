// ========================================
// AUTENTICAÇÃO
// ========================================

const token = sessionStorage.getItem('adminToken');

// Se não existir token, volta para o login
if (!token) {
    window.location.replace('/login.html');
}


// ========================================
// ELEMENTOS DO HTML
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

const tituloFormulario =
    document.getElementById('titulo-formulario');

const mensagemFormulario =
    document.getElementById('mensagem-formulario');


// ========================================
// TRATAR TOKEN EXPIRADO / INVÁLIDO
// ========================================

function tratarNaoAutorizado(resposta) {

    if (resposta.status === 401 || resposta.status === 403) {

        sessionStorage.removeItem('adminToken');

        alert(
            'Sua sessão expirou ou não é mais válida. Faça login novamente.'
        );

        window.location.replace('/login.html');

        return true;
    }

    return false;
}


// ========================================
// BUSCAR PROJETOS
// GET /api/projetos
// ROTA PÚBLICA
// ========================================

async function carregarProjetos() {

    try {

        const resposta = await fetch(
            '/api/projetos',
            {
                cache: 'no-store'
            }
        );

        if (!resposta.ok) {
            throw new Error(
                'Erro ao carregar projetos.'
            );
        }

        const projetos =
            await resposta.json();

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
// MOSTRAR PROJETOS
// ========================================

function renderizarProjetos(projetos) {

    contadorProjetos.textContent =
        `${projetos.length} projeto${projetos.length !== 1 ? 's' : ''}`;

    if (projetos.length === 0) {

        listaProjetos.innerHTML = `
            <p class="lista-vazia">
                Nenhum projeto cadastrado.
            </p>
        `;

        return;
    }

    listaProjetos.innerHTML = '';

    projetos.forEach((projeto) => {

        const item =
            document.createElement('article');

        item.className =
            'projeto-item';


        // Título

        const nome =
            document.createElement('h3');

        nome.textContent =
            projeto.titulo;


        // Descrição

        const texto =
            document.createElement('p');

        texto.textContent =
            projeto.descricao;


        // Tecnologias

        const tech =
            document.createElement('span');

        tech.className =
            'projeto-tecnologias';

        tech.textContent =
            projeto.tecnologias;


        // Área dos botões

        const acoes =
            document.createElement('div');

        acoes.className =
            'projeto-acoes';


        // ========================================
        // BOTÃO EDITAR
        // ========================================

        const editar =
            document.createElement('button');

        editar.type = 'button';

        editar.className =
            'btn-secondary';

        editar.textContent =
            'Editar';

        editar.addEventListener(
            'click',
            () => {

                editarProjeto(projeto);

            }
        );


        // ========================================
        // BOTÃO EXCLUIR
        // ========================================

        const excluir =
            document.createElement('button');

        excluir.type =
            'button';

        excluir.className =
            'btn-danger';

        excluir.textContent =
            'Excluir';

        excluir.addEventListener(
            'click',
            () => {

                excluirProjeto(
                    projeto.id
                );

            }
        );


        acoes.append(
            editar,
            excluir
        );


        item.append(
            nome,
            texto,
            tech,
            acoes
        );


        listaProjetos.appendChild(
            item
        );
    });
}


// ========================================
// CREATE / UPDATE
//
// POST /api/projetos
// PUT  /api/projetos/:id
//
// AMBOS PROTEGIDOS COM JWT
// ========================================

form.addEventListener(
    'submit',
    async (event) => {

        event.preventDefault();


        // ========================================
        // DADOS DO FORMULÁRIO
        // ========================================

        const dados = {

            titulo:
                titulo.value.trim(),

            descricao:
                descricao.value.trim(),

            tecnologias:
                tecnologias.value.trim(),

            github_url:
                githubUrl.value.trim(),

            demo_url:
                demoUrl.value.trim(),

            imagem_url:
                imagemUrl.value.trim()

        };


        // ========================================
        // VERIFICAR SE É CREATE OU UPDATE
        // ========================================

        const id =
            projetoId.value;

        const editando =
            Boolean(id);


        // Se estiver editando:
        //
        // PUT /api/projetos/1
        //
        // Se for novo:
        //
        // POST /api/projetos

        const url =
            editando
                ? `/api/projetos/${id}`
                : '/api/projetos';


        const metodo =
            editando
                ? 'PUT'
                : 'POST';


        try {

            btnSalvar.disabled =
                true;


            // ========================================
            // POST / PUT COM TOKEN JWT
            // ========================================

            const resposta =
                await fetch(
                    url,
                    {

                        method: metodo,

                        headers: {

                            'Content-Type':
                                'application/json',

                            // TOKEN JWT
                            'Authorization':
                                `Bearer ${token}`

                        },

                        body:
                            JSON.stringify(
                                dados
                            )

                    }
                );


            // Verifica token inválido/expirado

            if (
                tratarNaoAutorizado(
                    resposta
                )
            ) {
                return;
            }


            const resultado =
                await resposta.json();


            if (!resposta.ok) {

                throw new Error(
                    resultado.error ||
                    'Não foi possível salvar.'
                );

            }


            // ========================================
            // SUCESSO
            // ========================================

            mostrarMensagem(

                editando

                    ? 'Projeto atualizado com sucesso!'

                    : 'Projeto cadastrado com sucesso!',

                'sucesso'

            );


            limparFormulario();


            await carregarProjetos();


        } catch (error) {

            mostrarMensagem(
                error.message,
                'erro'
            );


        } finally {

            btnSalvar.disabled =
                false;

        }

    }
);


// ========================================
// EDITAR
// ========================================

function editarProjeto(projeto) {

    projetoId.value =
        projeto.id;


    titulo.value =
        projeto.titulo;


    descricao.value =
        projeto.descricao;


    tecnologias.value =
        projeto.tecnologias;


    githubUrl.value =
        projeto.github_url || '';


    demoUrl.value =
        projeto.demo_url || '';


    imagemUrl.value =
        projeto.imagem_url || '';


    tituloFormulario.textContent =
        'Editar projeto';


    btnSalvar.textContent =
        'Salvar alterações';


    btnCancelar.classList.remove(
        'hidden'
    );


    window.scrollTo({

        top: 0,

        behavior: 'smooth'

    });
}


// ========================================
// DELETE
//
// DELETE /api/projetos/:id
//
// PROTEGIDO COM JWT
// ========================================

async function excluirProjeto(id) {

    const confirmou =
        confirm(
            'Tem certeza que deseja excluir este projeto?'
        );


    if (!confirmou) {
        return;
    }


    try {

        // ========================================
        // DELETE COM TOKEN JWT
        // ========================================

        const resposta =
            await fetch(
                `/api/projetos/${id}`,
                {

                    method: 'DELETE',

                    headers: {

                        // TOKEN JWT
                        'Authorization':
                            `Bearer ${token}`

                    }

                }
            );


        // Token inválido ou expirado

        if (
            tratarNaoAutorizado(
                resposta
            )
        ) {
            return;
        }


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(

                resultado.error ||

                'Não foi possível excluir.'

            );

        }


        mostrarMensagem(

            'Projeto excluído com sucesso!',

            'sucesso'

        );


        await carregarProjetos();


    } catch (error) {

        mostrarMensagem(
            error.message,
            'erro'
        );

    }
}


// ========================================
// CANCELAR EDIÇÃO
// ========================================

btnCancelar.addEventListener(
    'click',
    () => {

        limparFormulario();

        mensagemFormulario.textContent =
            '';

    }
);


// ========================================
// LIMPAR FORMULÁRIO
// ========================================

function limparFormulario() {

    form.reset();


    projetoId.value =
        '';


    tituloFormulario.textContent =
        'Cadastrar projeto';


    btnSalvar.textContent =
        'Cadastrar projeto';


    btnCancelar.classList.add(
        'hidden'
    );
}


// ========================================
// MENSAGENS
// ========================================

function mostrarMensagem(
    texto,
    tipo
) {

    mensagemFormulario.textContent =
        texto;


    mensagemFormulario.className =
        tipo === 'sucesso'

            ? 'mensagem-sucesso'

            : 'mensagem-erro';

}


// ========================================
// LOGOUT
// ========================================

const btnLogout =
    document.getElementById(
        'btn-logout'
    );


if (btnLogout) {

    btnLogout.addEventListener(
        'click',
        () => {

            // Apaga o JWT

            sessionStorage.removeItem(
                'adminToken'
            );


            // Volta para login

            window.location.replace(
                '/login.html'
            );

        }
    );

}


// ========================================
// INICIALIZAÇÃO
// ========================================

carregarProjetos();