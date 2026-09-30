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

const db = require('./database');

// Rotas dos projetos
const projetosRoutes = require('./routes/projetos.routes');

// Rotas de autenticação
const authRoutes = require('./routes/auth.routes');


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
  console.error(
    'Variáveis obrigatórias ausentes no .env:',
    variaveisAusentes.join(', ')
  );

  process.exit(1);
}


// ========================================
// MIDDLEWARES
// ========================================

// Permite receber JSON
app.use(express.json());

// Permite receber dados de formulário
app.use(
  express.urlencoded({
    extended: true
  })
);


// ========================================
// ROTAS DA API
// ========================================

// LOGIN
//
// POST /api/auth/login

app.use(
  '/api/auth',
  authRoutes
);


// PROJETOS
//
// GET    /api/projetos
// GET    /api/projetos/:id
// POST   /api/projetos
// PUT    /api/projetos/:id
// DELETE /api/projetos/:id

app.use(
  '/api/projetos',
  projetosRoutes
);


// ========================================
// FRONTEND
// ========================================

// Pasta raiz do portfólio.
//
// __dirname:
// portifolio/Backend
//
// ..:
// portifolio

const publicRoot = path.join(
  __dirname,
  '..'
);


// Página inicial
app.get('/', (req, res) => {

  res.sendFile(
    path.join(
      publicRoot,
      'index.html'
    )
  );

});


// ========================================
// ARQUIVOS PÚBLICOS
// ========================================

const arquivosPublicos = [

  'index.html',

  'style.css',

  'script.js',

  'favicon.svg',

  'admin.html',

  'admin.css',

  'admin.js',

  'login.html',

  'login.js',

  'login.html',
  
  'login.js'

];


arquivosPublicos.forEach((file) => {

  app.get(`/${file}`, (req, res) => {

    res.sendFile(
      path.join(
        publicRoot,
        file
      )
    );

  });

});


// ========================================
// IMAGENS
// ========================================

app.use(
  '/images',
  express.static(
    path.join(
      publicRoot,
      'images'
    )
  )
);


// ========================================
// VISITAS
// ========================================

// Registrar nova visita
//
// GET /api/visita

app.get(
  '/api/visita',
  (req, res) => {

    const sql = `
      INSERT INTO visitas
      DEFAULT VALUES
    `;


    db.run(
      sql,
      function (err) {

        if (err) {

          console.error(
            'Erro ao registrar visita:',
            err.message
          );


          return res
            .status(500)
            .json({
              error:
                'Erro ao registrar visita'
            });

        }


        res.json({

          message:
            'Visita registrada com sucesso!',

          id:
            this.lastID

        });

      }
    );

  }
);


// ========================================
// TOTAL DE VISITAS
// ========================================
//
// GET /api/visitas

app.get(
  '/api/visitas',
  (req, res) => {

    const sql = `
      SELECT COUNT(*) AS total
      FROM visitas
    `;


    db.get(
      sql,
      [],
      (err, row) => {

        if (err) {

          console.error(
            'Erro ao buscar visitas:',
            err.message
          );


          return res
            .status(500)
            .json({
              error:
                'Erro ao buscar visitas'
            });

        }


        res.json({

          totalVisitas:
            row
              ? row.total
              : 0

        });

      }
    );

  }
);


// ========================================
// MENSAGENS
// ========================================
//
// POST /api/mensagens
//
// Salva uma mensagem enviada
// pelo formulário do portfólio.

app.post(
  '/api/mensagens',
  (req, res) => {

    const body =
      req.body || {};


    const fields = [
      'nome',
      'email',
      'mensagem'
    ];


    // Verifica campos vazios
    if (
      fields.some(
        (field) =>
          typeof body[field] !== 'string' ||
          !body[field].trim()
      )
    ) {

      return res
        .status(400)
        .json({

          error:
            'Por favor, preencha todos os campos.'

        });

    }


    const [
      nome,
      email,
      mensagem
    ] = fields.map(
      (field) =>
        body[field].trim()
    );


    // ========================================
    // VALIDAR E-MAIL
    // ========================================

    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
      !emailValido.test(email)
    ) {

      return res
        .status(400)
        .json({

          error:
            'Informe um e-mail válido.'

        });

    }


    // ========================================
    // INSERIR NO SQLITE
    // ========================================

    const sql = `
      INSERT INTO mensagens
      (
        nome,
        email,
        mensagem
      )
      VALUES (?, ?, ?)
    `;


    db.run(
      sql,
      [
        nome,
        email,
        mensagem
      ],
      function (err) {

        if (err) {

          console.error(
            'Erro ao salvar mensagem:',
            err.message
          );


          return res
            .status(500)
            .json({

              error:
                'Erro ao salvar mensagem no banco de dados'

            });

        }


        res
          .status(201)
          .json({

            message:
              'Mensagem enviada com sucesso!',

            id:
              this.lastID

          });

      }
    );

  }
);


// ========================================
// LISTAR MENSAGENS
// ========================================
//
// GET /api/mensagens

app.get(
  '/api/mensagens',
  (req, res) => {

    const sql = `
      SELECT *
      FROM mensagens
      ORDER BY data_envio DESC
    `;


    db.all(
      sql,
      [],
      (err, rows) => {

        if (err) {

          console.error(
            'Erro ao buscar mensagens:',
            err.message
          );


          return res
            .status(500)
            .json({

              error:
                'Erro ao buscar mensagens'

            });

        }


        res.json(rows);

      }
    );

  }
);


// ========================================
// ROTA 404 PARA API
// ========================================

app.use(
  '/api',
  (req, res) => {

    res
      .status(404)
      .json({

        error:
          'Rota da API não encontrada.'

      });

  }
);


// ========================================
// INICIAR SERVIDOR
// ========================================

// O servidor somente começa a aceitar
// requisições depois que o SQLite estiver pronto.

db.ready
  .then(() => {

    app.listen(
      PORT,
      (error) => {

        if (error) {

          console.error(
            `Não foi possível iniciar na porta ${PORT}:`,
            error.message
          );


          db.close();

          process.exitCode = 1;

          return;

        }


        console.log(
          '======================================'
        );

        console.log(
          'PORTFÓLIO INICIADO'
        );

        console.log(
          '======================================'
        );

        console.log(
          `Site: http://localhost:${PORT}`
        );

        console.log(
          `Login: http://localhost:${PORT}/login.html`
        );

        console.log(
          `Admin: http://localhost:${PORT}/admin.html`
        );

        console.log(
          `API: http://localhost:${PORT}/api/projetos`
        );

        console.log(
          '======================================'
        );

      }
    );

  })
  .catch((error) => {

    console.error(
      'Não foi possível inicializar o banco de dados:',
      error.message
    );

    process.exitCode = 1;

  });