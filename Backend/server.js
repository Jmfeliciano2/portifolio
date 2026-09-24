const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./database');


// ========================================
// SERVIR ARQUIVOS
// ========================================

function servirArquivo(arquivo, tipo, res) {

    const caminhoArquivo = path.join(
        __dirname,
        '..',
        arquivo
    );

    fs.readFile(caminhoArquivo, (erro, dados) => {

        if (erro) {

            console.log(
                'Erro ao carregar arquivo:',
                arquivo
            );

            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            res.end('Arquivo não encontrado');

            return;
        }

        res.writeHead(200, {
            'Content-Type': tipo
        });

        res.end(dados);
    });
}


// ========================================
// CONTADOR DE VISITAS
// ========================================

function adicionarVisita() {

    try {

        const inserir = db.prepare(`
            INSERT INTO visitas DEFAULT VALUES
        `);

        inserir.run();

    } catch (erro) {

        console.log(
            'Erro ao registrar visita:',
            erro
        );
    }
}


function obterVisitas(res) {

    try {

        const resultado = db.prepare(`
            SELECT COUNT(*) AS visitas
            FROM visitas
        `).get();

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        res.end(
            JSON.stringify(resultado)
        );

    } catch (erro) {

        console.log(
            'Erro ao obter visitas:',
            erro
        );

        res.writeHead(500, {
            'Content-Type': 'application/json'
        });

        res.end(
            JSON.stringify({
                erro: 'Erro ao obter visitas'
            })
        );
    }
}


// ========================================
// RECEBER MENSAGEM DO FORMULÁRIO
// ========================================

function receberContato(req, res) {

    let corpo = '';

    req.on('data', (parte) => {

        corpo += parte;

    });


    req.on('end', () => {

        try {

            const dados = JSON.parse(corpo);


            // Verificar se todos os campos foram preenchidos

            if (
                !dados.nome ||
                !dados.email ||
                !dados.mensagem
            ) {

                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });

                res.end(
                    JSON.stringify({
                        mensagem: 'Preencha todos os campos.'
                    })
                );

                return;
            }


            // Inserir mensagem no SQLite

            const inserir = db.prepare(`
                INSERT INTO mensagens (
                    nome,
                    email,
                    mensagem
                )
                VALUES (?, ?, ?)
            `);


            inserir.run(
                dados.nome,
                dados.email,
                dados.mensagem
            );


            // Resposta para o frontend

            res.writeHead(201, {
                'Content-Type': 'application/json'
            });

            res.end(
                JSON.stringify({
                    mensagem: 'Mensagem enviada com sucesso!'
                })
            );


        } catch (erro) {

            console.log(
                'Erro ao salvar mensagem:',
                erro
            );


            res.writeHead(500, {
                'Content-Type': 'application/json'
            });


            res.end(
                JSON.stringify({
                    mensagem: 'Erro ao salvar mensagem.'
                })
            );
        }

    });
}


// ========================================
// OBTER TODAS AS MENSAGENS
// ========================================

function obterMensagens(res) {

    try {

        const mensagens = db.prepare(`
            SELECT
                id,
                nome,
                email,
                mensagem,
                data
            FROM mensagens
            ORDER BY id DESC
        `).all();


        res.writeHead(200, {
            'Content-Type': 'application/json'
        });


        res.end(
            JSON.stringify(mensagens)
        );


    } catch (erro) {

        console.log(
            'Erro ao obter mensagens:',
            erro
        );


        res.writeHead(500, {
            'Content-Type': 'application/json'
        });


        res.end(
            JSON.stringify({
                erro: 'Erro ao obter mensagens'
            })
        );
    }
}


// ========================================
// SERVIDOR
// ========================================

const server = http.createServer((req, res) => {


    // ====================================
    // PÁGINA PRINCIPAL
    // ====================================

    if (
        req.url === '/' &&
        req.method === 'GET'
    ) {

        adicionarVisita();

        servirArquivo(
            'index.html',
            'text/html',
            res
        );


        // ====================================
        // CSS
        // ====================================

    } else if (
        req.url === '/style.css' &&
        req.method === 'GET'
    ) {

        servirArquivo(
            'style.css',
            'text/css',
            res
        );


        // ====================================
        // JAVASCRIPT
        // ====================================

    } else if (
        req.url === '/script.js' &&
        req.method === 'GET'
    ) {

        servirArquivo(
            'script.js',
            'text/javascript',
            res
        );


        // ====================================
        // IMAGEM DO OLHO
        // ====================================

    } else if (
        req.url === '/images/olho.png' &&
        req.method === 'GET'
    ) {

        servirArquivo(
            'images/olho.png',
            'image/png',
            res
        );


        // ====================================
        // API - VISITAS
        // ====================================

    } else if (
        req.url === '/api/visitas' &&
        req.method === 'GET'
    ) {

        obterVisitas(res);


        // ====================================
        // API - CONTATO
        // ====================================

    } else if (
        req.url === '/api/contato' &&
        req.method === 'POST'
    ) {

        receberContato(req, res);


        // ====================================
        // API - MENSAGENS
        // ====================================

    } else if (
        req.url === '/api/mensagens' &&
        req.method === 'GET'
    ) {

        obterMensagens(res);


        // ====================================
        // ROTA NÃO ENCONTRADA
        // ====================================

    } else {

        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });

        res.end('Página não encontrada');
    }

});


// ========================================
// INICIAR SERVIDOR
// ========================================

server.listen(3000, () => {

    console.log(
        'Portfólio rodando em http://localhost:3000'
    );

});