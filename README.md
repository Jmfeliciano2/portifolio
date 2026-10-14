# Portfólio pessoal - João Matheus

Portfólio profissional criado para apresentar projetos, stack e experiências de desenvolvimento em uma interface moderna e responsiva.

A aplicação combina frontend em HTML/CSS/JavaScript, backend em Node.js + Express e banco SQLite para armazenar projetos, mensagens e visitas. Além disso, o painel administrativo permite gerenciar os projetos cadastrados via API protegida por JWT.

---

## Funcionalidades

- Portfólio responsivo com layout moderno e navegação simples
- Seção de projetos carregada dinamicamente pela API
- Painel administrativo para criar, editar e excluir projetos
- Registro de mensagens de contato
- Contador de visitas
- Autenticação com email, senha e JWT
- Persistência em SQLite
- Seed inicial de projetos para exibir itens padrão quando o banco está vazio

---

## Tecnologias

### Frontend
- HTML5
- CSS3
- JavaScript ES6+

### Backend
- Node.js
- Express
- CORS
- JWT
- bcryptjs

### Banco de dados
- SQLite3

### Infraestrutura
- dotenv

---

## Projetos incluídos por padrão

Quando o banco de projetos está vazio, o sistema automaticamente carrega os itens cadastrados em [data/projetos.json](data/projetos.json). Isso garante que o portfólio já abra com os projetos principais já registrados.

Inclui:
- Melodia
- Maison Della Moda Rigor
- Supportflow-helpdesk

---

## Estrutura do projeto

```text
portifolio/
├── Backend/
│   ├── controllers/
│   │   ├── mensagens.controller.js
│   │   ├── projetos.controller.js
│   │   └── visitas.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── mensagens.routes.js
│   │   ├── projetos.routes.js
│   │   └── visitas.routes.js
│   ├── scripts/
│   │   ├── executar-testes.js
│   │   └── gerar-hash.js
│   ├── database.js
│   ├── server.js
│   └── database.sqlite
├── data/
│   ├── mensagens.json
│   ├── mensagens.js
│   └── projetos.json
├── images/
├── .env.example
├── .gitignore
├── admin.css
├── admin.html
├── admin.js
├── favicon.svg
├── index.html
├── login.html
├── login.js
├── package.json
├── README.md
├── script.js
├── style.css
└── LICENSE
```

---

## Como executar localmente

### 1. Instale as dependências

```bash
npm install
```

### 2. Crie o arquivo .env

Use o modelo do arquivo `.env.example` e configure:

```env
PORT=3000
ADMIN_EMAIL=seu-email@exemplo.com
ADMIN_PASSWORD_HASH=seu_hash_gerado
JWT_SECRET=sua_chave_secreta
```

### 3. Gere o hash da senha administrativa

```bash
npm run gerar-hash "suaSenhaAqui"
```

### 4. Inicie o servidor

```bash
npm start
```

### 5. Acesse

- Portfólio: http://localhost:3000
- Login admin: http://localhost:3000/login.html
- Painel admin: http://localhost:3000/admin.html

---

## API principal

### Rotas públicas
- GET /api/projetos
- GET /api/projetos/:id
- POST /api/auth/login
- POST /api/mensagens
- GET /api/visita
- GET /api/visitas

### Rotas protegidas
- POST /api/projetos
- PUT /api/projetos/:id
- DELETE /api/projetos/:id
- GET /api/mensagens

---

## Observações importantes

- O banco SQLite local é usado para persistir dados do portfólio.
- Os projetos de seed ficam em [data/projetos.json](data/projetos.json) e são inseridos automaticamente quando a tabela estiver vazia.
- O painel administrativo continua habilitado para editar ou excluir projetos após a carga inicial.

---

## Autor

João Matheus

- GitHub: https://github.com/Jmfeliciano2
- LinkedIn: https://www.linkedin.com/in/joaomatheusfeliciano/
- Email: felicianomatheus265@gmail.com

