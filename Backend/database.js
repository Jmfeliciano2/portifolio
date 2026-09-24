const Database = require('better-sqlite3');
const path = require('path');

const caminhoBanco = path.join(
    __dirname,
    '..',
    'data',
    'portfolio.db'
);

const db = new Database(caminhoBanco);

// Criar tabela de mensagens
db.exec(`
    CREATE TABLE IF NOT EXISTS mensagens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL,
        mensagem TEXT NOT NULL,
        data DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Criar tabela de visitas
db.exec(`
    CREATE TABLE IF NOT EXISTS visitas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

console.log('Banco SQLite conectado.');

module.exports = db;