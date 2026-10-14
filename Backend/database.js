const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// DATABASE_PATH permite testar sem alterar o banco real do portfólio.
const dbPath =
  process.env.DATABASE_PATH ||
  path.join(__dirname, 'database.sqlite');

const projetosSeedPath = path.join(__dirname, '..', 'data', 'projetos.json');
let db;

async function carregarProjetosIniciais() {
  const sqlContagem = 'SELECT COUNT(*) AS total FROM projetos';

  const contagem = await new Promise((resolve, reject) => {
    db.get(sqlContagem, (err, row) => {
      if (err) return reject(err);
      resolve(row?.total || 0);
    });
  });

  if (Number(contagem) > 0) {
    return;
  }

  let projetos = [];

  try {
    const conteudo = fs.readFileSync(projetosSeedPath, 'utf8');
    projetos = JSON.parse(conteudo);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
    return;
  }

  if (!Array.isArray(projetos) || projetos.length === 0) {
    return;
  }

  const sqlInsert = `
    INSERT INTO projetos (
      titulo,
      descricao,
      tecnologias,
      github_url,
      demo_url,
      imagem_url
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

  for (const projeto of projetos) {
    await new Promise((resolve, reject) => {
      db.run(
        sqlInsert,
        [
          projeto.titulo,
          projeto.descricao,
          projeto.tecnologias || '',
          projeto.github_url || null,
          projeto.demo_url || null,
          projeto.imagem_url || null
        ],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  }
}

const ready = new Promise((resolve, reject) => {
  db = new sqlite3.Database(dbPath, (error) => {

    if (error) {
      return reject(error);
    }

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

      CREATE TABLE IF NOT EXISTS projetos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        tecnologias TEXT NOT NULL,
        github_url TEXT,
        demo_url TEXT,
        imagem_url TEXT,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
      );

    `, async (error) => {

      if (error) {
        db.close(() => reject(error));
        return;
      }

      try {
        await carregarProjetosIniciais();
        resolve();
      } catch (seedError) {
        db.close(() => reject(seedError));
      }
    });
  });
});

db.ready = ready;

module.exports = db;