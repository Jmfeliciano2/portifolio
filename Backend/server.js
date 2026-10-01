// ========================================
// VARIÁVEIS DE AMBIENTE
// ========================================

// Carrega o arquivo .env antes das outras configurações
require('dotenv').config();

// ========================================
// IMPORTAÇÕES
// ========================================

const express = require('express');
const path = require('path');
const cors = require('cors');

const db = require('./database');

// Rotas da aplicação
const authRoutes = require('./routes/auth.routes');
const projetosRoutes = require('./routes/projetos.routes');
const mensagensRoutes = require('./routes/mensagens.routes');
const visitasRoutes = require('./routes/visitas.routes');

// ========================================
// CONFIGURAÇÃO DO EXPRESS
// ========================================

const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// VERIFICAÇÃO DAS VARIÁVEIS DE AMBIENTE
// ========================================

const variaveisObrigatorias = [
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD_HASH',
    'JWT_SECRET'
];

const variaveisAusentes = variaveisObrigatorias.filter(
    (variavel) => !process.env[variavel]
);

if (variaveisAusentes.length > 0) {
    console.error('====================================================');
    console.error('ERRO: Variáveis obrigatórias ausentes no .env:');
    console.error(variaveisAusentes.join(', '));
    console.error('\nCrie ou configure o arquivo .env baseado no .env.example:');
    console.error('  ADMIN_EMAIL=...');
    console.error('  ADMIN_PASSWORD_HASH=... (gerar com: npm run gerar-hash)');
    console.error('  JWT_SECRET=...');
    console.error('====================================================');
    process.exit(1);
}

// ========================================
// MIDDLEWARES GERAIS
// ========================================

// Permite requisições Cross-Origin (CORS)
app.use(cors());

// Permite receber requisições com corpo JSON
app.use(express.json());

// Permite receber dados de formulários tradicionais
app.use(express.urlencoded({ extended: true }));

// ========================================
// ROTAS DA API REST
// ========================================

// Autenticação administrativa
// POST /api/auth/login
app.use('/api/auth', authRoutes);

// CRUD de projetos (GET público, POST/PUT/DELETE protegido com JWT)
// GET    /api/projetos
// GET    /api/projetos/:id
// POST   /api/projetos
// PUT    /api/projetos/:id
// DELETE /api/projetos/:id
app.use('/api/projetos', projetosRoutes);

// Mensagens de contato (POST público, GET protegido com JWT)
// POST /api/mensagens
// GET  /api/mensagens
app.use('/api/mensagens', mensagensRoutes);

// Contador de visitas (público)
// GET /api/visita
// GET /api/visitas
app.use('/api', visitasRoutes);

// ========================================
// FRONTEND E ARQUIVOS PÚBLICOS
// ========================================

const publicRoot = path.join(__dirname, '..');

// Página principal do portfólio
app.get('/', (req, res) => {
    res.sendFile(path.join(publicRoot, 'index.html'));
});

// Arquivos estáticos permitidos de forma explícita por segurança
const arquivosPublicos = [
    'index.html',
    'style.css',
    'script.js',
    'favicon.svg',
    'admin.html',
    'admin.css',
    'admin.js',
    'login.html',
    'login.js'
];

arquivosPublicos.forEach((file) => {
    app.get(`/${file}`, (req, res) => {
        res.sendFile(path.join(publicRoot, file));
    });
});

// Diretório de imagens estáticas
app.use(
    '/images',
    express.static(path.join(publicRoot, 'images'))
);

// ========================================
// TRATAMENTO DE ROTAS NÃO ENCONTRADAS (404)
// ========================================

// Rotas da API inexistentes retornam JSON
app.use('/api', (req, res) => {
    res.status(404).json({
        error: 'Rota da API não encontrada.'
    });
});

// Outras rotas desconhecidas
app.use((req, res) => {
    res.status(404).send('Página não encontrada.');
});

// ========================================
// INICIALIZAÇÃO DO SERVIDOR
// ========================================

// Inicia somente após o SQLite estar conectado e com as tabelas criadas
db.ready
    .then(() => {
        const server = app.listen(PORT, () => {
            console.log('======================================');
            console.log('PORTFÓLIO - SERVIDOR ONLINE');
            console.log('======================================');
            console.log(`Site:   http://localhost:${PORT}`);
            console.log(`Login:  http://localhost:${PORT}/login.html`);
            console.log(`Admin:  http://localhost:${PORT}/admin.html`);
            console.log(`API:    http://localhost:${PORT}/api/projetos`);
            console.log('======================================');
        });

        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`\n[ERRO] A porta ${PORT} já está em uso por outro processo.`);
                console.error(`Defina outra porta no .env (ex: PORT=3001) ou encerre o processo anterior.\n`);
            } else {
                console.error('Erro no servidor HTTP:', error.message);
            }
            db.close();
            process.exit(1);
        });
    })
    .catch((error) => {
        console.error(
            'Não foi possível inicializar o banco de dados:',
            error.message
        );
        process.exit(1);
    });