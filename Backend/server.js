const http = require('http');
const fs = require('fs');
const path = require('path');

const caminhoVisitas = path.join(__dirname, '..', 'data', 'visits.json');

console.log('Arquivo de visitas:', caminhoVisitas);

const server = http.createServer((req, res) => {

    if (req.url === '/') {

        adicionarVisita();

        servirArquivo('index.html', 'text/html', res);

    } else if (req.url === '/style.css') {

        servirArquivo('style.css', 'text/css', res);

    } else if (req.url === '/script.js') {

        servirArquivo('script.js', 'text/javascript', res);

    } else if (req.url === '/api/visitas') {

        obterVisitas(res);

    } else {

        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });

        res.end('Página não encontrada');

    }

});


function adicionarVisita() {

    fs.readFile(caminhoVisitas, 'utf8', (erro, dados) => {

        if (erro) {
            console.log('Erro ao ler visitas:', erro);
            return;
        }

        const contador = JSON.parse(dados);

        contador.visitas += 1;

        fs.writeFile(
            caminhoVisitas,
            JSON.stringify(contador, null, 2),
            (erro) => {

                if (erro) {
                    console.log('Erro ao salvar visitas:', erro);
                }

            }
        );

    });

}


function obterVisitas(res) {

    fs.readFile(caminhoVisitas, 'utf8', (erro, dados) => {

        if (erro) {

            res.writeHead(500, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify({
                erro: 'Erro ao obter visitas'
            }));

            return;
        }

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        res.end(dados);

    });

}


function servirArquivo(arquivo, tipo, res) {

    const caminhoArquivo = path.join(
        __dirname,
        '..',
        arquivo
    );

    fs.readFile(caminhoArquivo, (erro, dados) => {

        if (erro) {

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


server.listen(3000, () => {

    console.log('Portfólio rodando em http://localhost:3000');

});