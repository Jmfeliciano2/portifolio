const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// DATABASE_PATH permite testar sem alterar o banco real do portfólio.
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'database.sqlite');
let db;
const ready = new Promise((resolve, reject) => {
  db = new sqlite3.Database(dbPath, (error) => {
    if (error) return reject(error);
    db.exec(`
      CREATE TABLE IF NOT EXISTS visitas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data_visita DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS mensagens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL,
        mensagem TEXT NOT NULL,
        data_envio DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `, (error) => {
      if (error) {
        db.close(() => reject(error));
        return;
      }
      resolve();
    });
  });
});

// Mantém a interface db.run/get/all usada nas rotas.
db.ready = ready;
module.exports = db;
