/**
 * Bateria de testes automatizados para o backend do portfólio.
 * Executa todos os testes obrigatórios (TESTE 1 até TESTE 17).
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const jwt = require('jsonwebtoken');

let tokenValido = null;
let projetoCriadoId = null;
let falhas = 0;
let sucessos = 0;

function logPass(msg) {
    console.log(`  [PASS] ${msg}`);
    sucessos++;
}

function logFail(msg, detalhe) {
    console.error(`  [FAIL] ${msg}`);
    if (detalhe) console.error(`         Detalhe: ${detalhe}`);
    falhas++;
}

async function run() {
    console.log('====================================================');
    console.log('INICIANDO BATERIA DE TESTES DO BACKEND');
    console.log(`Alvo: ${BASE_URL}`);
    console.log('====================================================\n');

    // TESTE 1: GET /api/projetos sem login
    try {
        const res = await fetch(`${BASE_URL}/api/projetos`);
        const data = await res.json();
        if (res.status === 200 && Array.isArray(data)) {
            logPass('TESTE 1: GET /api/projetos sem login retornou 200 OK e array');
        } else {
            logFail('TESTE 1: Esperado 200 e array', `Status: ${res.status}, Body: ${JSON.stringify(data)}`);
        }
    } catch (e) {
        logFail('TESTE 1: Erro na requisição', e.message);
    }

    // TESTE 2: POST /api/projetos sem JWT
    try {
        const res = await fetch(`${BASE_URL}/api/projetos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo: 'Sem Token', descricao: 'Desc', tecnologias: 'Node' })
        });
        if (res.status === 401) {
            logPass('TESTE 2: POST /api/projetos sem JWT retornou 401 Unauthorized');
        } else {
            logFail('TESTE 2: Esperado status 401', `Status obtido: ${res.status}`);
        }
    } catch (e) {
        logFail('TESTE 2: Erro na requisição', e.message);
    }

    // TESTE 3: PUT /api/projetos/:id sem JWT
    try {
        const res = await fetch(`${BASE_URL}/api/projetos/1`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo: 'Update', descricao: 'Desc', tecnologias: 'Node' })
        });
        if (res.status === 401) {
            logPass('TESTE 3: PUT /api/projetos/:id sem JWT retornou 401 Unauthorized');
        } else {
            logFail('TESTE 3: Esperado status 401', `Status obtido: ${res.status}`);
        }
    } catch (e) {
        logFail('TESTE 3: Erro na requisição', e.message);
    }

    // TESTE 4: DELETE /api/projetos/:id sem JWT
    try {
        const res = await fetch(`${BASE_URL}/api/projetos/1`, {
            method: 'DELETE'
        });
        if (res.status === 401) {
            logPass('TESTE 4: DELETE /api/projetos/:id sem JWT retornou 401 Unauthorized');
        } else {
            logFail('TESTE 4: Esperado status 401', `Status obtido: ${res.status}`);
        }
    } catch (e) {
        logFail('TESTE 4: Erro na requisição', e.message);
    }

    // TESTE 5: login com senha incorreta
    try {
        const res = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@portifolio.com', senha: 'senha_errada_xyz' })
        });
        if (res.status === 401) {
            logPass('TESTE 5: Login com senha incorreta retornou 401 Unauthorized');
        } else {
            logFail('TESTE 5: Esperado status 401', `Status obtido: ${res.status}`);
        }
    } catch (e) {
        logFail('TESTE 5: Erro na requisição', e.message);
    }

    // TESTE 6: login correto
    try {
        const res = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@portifolio.com', senha: 'admin123' })
        });
        const data = await res.json();
        if (res.status === 200 && data.token) {
            tokenValido = data.token;
            logPass('TESTE 6: Login com credenciais corretas retornou 200 OK e token JWT');
        } else {
            logFail('TESTE 6: Esperado 200 e token', `Status: ${res.status}, Body: ${JSON.stringify(data)}`);
        }
    } catch (e) {
        logFail('TESTE 6: Erro na requisição', e.message);
    }

    // TESTE 7: POST com autenticação -> projeto criado
    try {
        const res = await fetch(`${BASE_URL}/api/projetos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValido}`
            },
            body: JSON.stringify({
                titulo: 'Projeto Teste Automatizado',
                descricao: 'Descrição do projeto de teste automatizado',
                tecnologias: 'Node.js, Express, SQLite',
                github_url: 'https://github.com/teste/projeto',
                demo_url: 'https://demo.teste.com',
                imagem_url: 'images/teste.png'
            })
        });
        const data = await res.json();
        if (res.status === 201 && data.projeto && data.projeto.id) {
            projetoCriadoId = data.projeto.id;
            logPass(`TESTE 7: POST /api/projetos com JWT criou projeto com sucesso (ID: ${projetoCriadoId})`);
        } else {
            logFail('TESTE 7: Esperado status 201 e dados do projeto', `Status: ${res.status}, Body: ${JSON.stringify(data)}`);
        }
    } catch (e) {
        logFail('TESTE 7: Erro na requisição', e.message);
    }

    // TESTE 8: PUT com autenticação -> projeto atualizado
    try {
        const res = await fetch(`${BASE_URL}/api/projetos/${projetoCriadoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValido}`
            },
            body: JSON.stringify({
                titulo: 'Projeto Teste Atualizado',
                descricao: 'Descrição atualizada com sucesso',
                tecnologias: 'Node.js, Express, SQLite, JWT',
                github_url: 'https://github.com/teste/projeto-updated',
                demo_url: 'https://demo.teste.com/updated',
                imagem_url: 'images/teste-up.png'
            })
        });
        const data = await res.json();
        if (res.status === 200 && data.message) {
            logPass(`TESTE 8: PUT /api/projetos/${projetoCriadoId} com JWT atualizou com sucesso`);
        } else {
            logFail('TESTE 8: Esperado status 200', `Status: ${res.status}, Body: ${JSON.stringify(data)}`);
        }
    } catch (e) {
        logFail('TESTE 8: Erro na requisição', e.message);
    }

    // TESTE 9: DELETE com autenticação -> projeto excluído
    try {
        const res = await fetch(`${BASE_URL}/api/projetos/${projetoCriadoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${tokenValido}`
            }
        });
        const data = await res.json();
        if (res.status === 200) {
            logPass(`TESTE 9: DELETE /api/projetos/${projetoCriadoId} com JWT excluiu com sucesso`);
        } else {
            logFail('TESTE 9: Esperado status 200', `Status: ${res.status}, Body: ${JSON.stringify(data)}`);
        }
    } catch (e) {
        logFail('TESTE 9: Erro na requisição', e.message);
    }

    // TESTE 10: POST /api/mensagens sem autenticação -> deve funcionar (público)
    let mensagemId = null;
    try {
        const res = await fetch(`${BASE_URL}/api/mensagens`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: 'Visitante Teste',
                email: 'visitante@teste.com',
                mensagem: 'Olá, parabéns pelo portfólio!'
            })
        });
        const data = await res.json();
        if (res.status === 201 && data.id) {
            mensagemId = data.id;
            logPass(`TESTE 10: POST /api/mensagens sem autenticação funcionou (201 Created, ID: ${mensagemId})`);
        } else {
            logFail('TESTE 10: Esperado status 201', `Status: ${res.status}, Body: ${JSON.stringify(data)}`);
        }
    } catch (e) {
        logFail('TESTE 10: Erro na requisição', e.message);
    }

    // TESTE 11: GET /api/mensagens sem autenticação -> 401
    try {
        const res = await fetch(`${BASE_URL}/api/mensagens`);
        if (res.status === 401) {
            logPass('TESTE 11: GET /api/mensagens sem autenticação retornou 401 Unauthorized');
        } else {
            logFail('TESTE 11: Esperado status 401', `Status obtido: ${res.status}`);
        }
    } catch (e) {
        logFail('TESTE 11: Erro na requisição', e.message);
    }

    // TESTE 12: GET /api/mensagens autenticado -> deve funcionar
    try {
        const res = await fetch(`${BASE_URL}/api/mensagens`, {
            headers: {
                'Authorization': `Bearer ${tokenValido}`
            }
        });
        const data = await res.json();
        if (res.status === 200 && Array.isArray(data) && data.length > 0) {
            logPass(`TESTE 12: GET /api/mensagens autenticado retornou 200 OK (${data.length} mensagens listadas)`);
        } else {
            logFail('TESTE 12: Esperado status 200 e lista de mensagens', `Status: ${res.status}`);
        }
    } catch (e) {
        logFail('TESTE 12: Erro na requisição', e.message);
    }

    // TESTE 13: Logout / remoção de sessão
    try {
        // Simulação do cliente: após remover o token da sessão, qualquer requisição protegida deve falhar com 401
        const res = await fetch(`${BASE_URL}/api/mensagens`, {
            headers: {
                // Token ausente (como após sessionStorage.removeItem('adminToken'))
            }
        });
        if (res.status === 401) {
            logPass('TESTE 13: Sem o token de sessão, operações restritas são bloqueadas com 401');
        } else {
            logFail('TESTE 13: Esperado status 401 sem token de sessão', `Status obtido: ${res.status}`);
        }
    } catch (e) {
        logFail('TESTE 13: Erro no teste', e.message);
    }

    // TESTE 14: Token expirado ou inválido
    try {
        // Token adulterado
        const resInvalido = await fetch(`${BASE_URL}/api/mensagens`, {
            headers: { 'Authorization': 'Bearer token_completamente_invalido_123' }
        });

        // Token expirado
        const tokenExpirado = jwt.sign(
            { role: 'admin' },
            process.env.JWT_SECRET || 'super_secreto_chave_jwt_portfolio_2026_segura',
            { expiresIn: '0s' } // Expira imediatamente
        );
        const resExpirado = await fetch(`${BASE_URL}/api/mensagens`, {
            headers: { 'Authorization': `Bearer ${tokenExpirado}` }
        });

        if (resInvalido.status === 401 && resExpirado.status === 401) {
            logPass('TESTE 14: Tokens inválidos e expirados foram rejeitados com 401 Unauthorized');
        } else {
            logFail('TESTE 14: Esperado 401 para token inválido e expirado', `Inválido: ${resInvalido.status}, Expirado: ${resExpirado.status}`);
        }
    } catch (e) {
        logFail('TESTE 14: Erro no teste', e.message);
    }

    // TESTE 15: Portfólio público (GET /api/projetos e GET /)
    try {
        // Criar um projeto real para testar carregamento dinâmico
        const resCreate = await fetch(`${BASE_URL}/api/projetos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenValido}`
            },
            body: JSON.stringify({
                titulo: 'Cinelog',
                descricao: 'Aplicação web para registro e organização de filmes assistidos.',
                tecnologias: 'HTML5, CSS3, JavaScript',
                github_url: 'https://github.com/Jmfeliciano2',
                demo_url: 'https://github.com/Jmfeliciano2',
                imagem_url: 'images/olho.png'
            })
        });
        const proj = await resCreate.json();

        // Consulta pública
        const resPublic = await fetch(`${BASE_URL}/api/projetos`);
        const list = await resPublic.json();

        const encontrou = Array.isArray(list) && list.some(p => p.titulo === 'Cinelog');
        if (encontrou) {
            logPass('TESTE 15: Portfólio público consome /api/projetos dinamicamente e localizou projeto cadastrado');
        } else {
            logFail('TESTE 15: Projeto cadastrado não encontrado na listagem pública');
        }
    } catch (e) {
        logFail('TESTE 15: Erro no teste', e.message);
    }

    // TESTE 16: Contador de visitas
    try {
        const resReg = await fetch(`${BASE_URL}/api/visita`);
        const dataReg = await resReg.json();

        const resTot = await fetch(`${BASE_URL}/api/visitas`);
        const dataTot = await resTot.json();

        if (resReg.status === 200 && resTot.status === 200 && typeof dataTot.totalVisitas === 'number' && dataTot.totalVisitas >= 1) {
            logPass(`TESTE 16: Contador de visitas registrou acesso com sucesso (Total atual: ${dataTot.totalVisitas})`);
        } else {
            logFail('TESTE 16: Falha no contador de visitas', `Reg: ${JSON.stringify(dataReg)}, Tot: ${JSON.stringify(dataTot)}`);
        }
    } catch (e) {
        logFail('TESTE 16: Erro no teste', e.message);
    }

    // TESTE 17: Arquivos estáticos / frontend integrados
    try {
        const paginas = [
            '/',
            '/index.html',
            '/style.css',
            '/script.js',
            '/admin.html',
            '/admin.css',
            '/admin.js',
            '/login.html',
            '/login.js',
            '/favicon.svg'
        ];

        let todasOk = true;
        for (const pag of paginas) {
            const res = await fetch(`${BASE_URL}${pag}`);
            if (res.status !== 200) {
                todasOk = false;
                logFail(`TESTE 17: Arquivo ${pag} retornou status ${res.status}`);
            }
        }

        if (todasOk) {
            logPass('TESTE 17: Todos os arquivos estáticos e páginas frontend respondem com status 200 OK');
        }
    } catch (e) {
        logFail('TESTE 17: Erro no teste', e.message);
    }

    console.log('\n====================================================');
    console.log(`RESULTADO FINAL: ${sucessos} SUCESSOS, ${falhas} FALHAS`);
    console.log('====================================================\n');

    if (falhas > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

run();
