const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares para permitir envio de JSON e dados de formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Publicar apenas o frontend; o banco e os arquivos do backend são privados.
const publicRoot = path.join(__dirname, '..');
app.get('/', (req, res) => res.sendFile(path.join(publicRoot, 'index.html')));
['index.html', 'style.css', 'script.js', 'favicon.svg'].forEach((file) => {
  app.get(`/${file}`, (req, res) => res.sendFile(path.join(publicRoot, file)));
});
app.use('/images', express.static(path.join(publicRoot, 'images')));

// Rota para registrar uma nova visita ao acessar o site
app.get('/api/visita', (req, res) => {
  const sql = `INSERT INTO visitas DEFAULT VALUES`;
  db.run(sql, function (err) {
    if (err) {
      console.error('Erro ao registrar visita:', err.message);
      return res.status(500).json({ error: 'Erro ao registrar visita' });
    }
    res.json({ message: 'Visita registrada com sucesso!', id: this.lastID });
  });
});

// Rota para buscar o total de visitas (opcional para o dashboard)
app.get('/api/visitas', (req, res) => {
  const sql = `SELECT COUNT(*) AS total FROM visitas`;
  db.get(sql, [], (err, row) => {
    if (err) {
      console.error('Erro ao buscar visitas:', err.message);
      return res.status(500).json({ error: 'Erro ao buscar visitas' });
    }
    res.json({ totalVisitas: row ? row.total : 0 });
  });
});

// Rota para salvar mensagens enviadas pelo formulário de contato
app.post('/api/mensagens', (req, res) => {
  const body = req.body || {};
  const fields = ['nome', 'email', 'mensagem'];
  if (fields.some((field) => typeof body[field] !== 'string' || !body[field].trim())) {
    return res.status(400).json({ error: 'Por favor, preencha todos os campos.' });
  }
  const [nome, email, mensagem] = fields.map((field) => body[field].trim());

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Informe um e-mail válido.' });
  }

  const sql = `INSERT INTO mensagens (nome, email, mensagem) VALUES (?, ?, ?)`;
  db.run(sql, [nome, email, mensagem], function (err) {
    if (err) {
      console.error('Erro ao salvar mensagem:', err.message);
      return res.status(500).json({ error: 'Erro ao salvar mensagem no banco de dados' });
    }

    res.status(201).json({
      message: 'Mensagem enviada com sucesso!',
      id: this.lastID
    });
  });
});

// Rota para listar todas as mensagens recebidas
app.get('/api/mensagens', (req, res) => {
  const sql = `SELECT * FROM mensagens ORDER BY data_envio DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar mensagens:', err.message);
      return res.status(500).json({ error: 'Erro ao buscar mensagens' });
    }
    res.json(rows);
  });
});

// Aceitar requisições somente após a criação das duas tabelas.
db.ready.then(() => {
  app.listen(PORT, (error) => {
    if (error) {
      console.error(`Não foi possível iniciar na porta ${PORT}:`, error.message);
      db.close();
      process.exitCode = 1;
      return;
    }
    console.log(`Portfólio rodando em http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Não foi possível inicializar o banco de dados:', error.message);
  process.exitCode = 1;
});
