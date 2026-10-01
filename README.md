# Portfólio João Matheus

Portfólio pessoal e profissional desenvolvido para apresentar projetos, habilidades e experiências na área de desenvolvimento de software.

A aplicação une uma interface moderna, minimalista e responsiva no frontend com uma API REST completa, autenticação segura com JWT e bcrypt, e persistência de dados em SQLite no backend.

---

##  Tecnologias

### Frontend
- **HTML5** (Semântica e acessibilidade)
- **CSS3** (Design responsivo, variáveis CSS, grid e flexbox)
- **JavaScript ES6+** (Manipulação do DOM, Fetch API assíncrona, eventos)

### Backend
- **Node.js** (Ambiente de execução)
- **Express** (Framework HTTP e roteamento de APIs REST)
- **CORS** (Controle de acesso de requisições cross-origin)

### Banco de Dados
- **SQLite3** (Banco de dados relacional embutido e veloz)

### Segurança
- **bcryptjs** (Hash unidirecional com salt rounds para senhas administrativas)
- **JSON Web Token (JWT)** (Autenticação Stateless com expiração automática de 2h para rotas protegidas)
- **dotenv** (Isolamento de credenciais e variáveis de ambiente)

---

##  Funcionalidades

- **Portfólio Responsivo:** Navegação fluida para desktop, tablets e smartphones, com menu mobile interativo e animações de scroll.
- **Projetos Dinâmicos:** A vitrine pública consome a API REST (`GET /api/projetos`) em tempo real, eliminando dados estáticos no HTML.
- **CRUD Completo de Projetos:** Criação, visualização detalhada, atualização e remoção de projetos pelo painel administrativo.
- **Painel Administrativo (`/admin.html`):**
  - Gerenciamento simplificado de projetos em catálogo.
  - Visualização de todas as mensagens recebidas de visitantes.
  - Controle de logout e tratamento automático de sessões expiradas.
- **Autenticação Segura (`/login.html`):**
  - Verificação de e-mail e senha com hash bcrypt.
  - Emissão de token JWT assinado para requisições autenticadas.
  - Botão interativo para mostrar/ocultar senha e alertas didáticos contra colagem de hashes.
- **Formulário de Contato:** Validação de formato de e-mail, sanitização contra campos vazios e gravação segura no SQLite.
- **Contador de Visitas:** Registro automático de novos acessos e exibição do contador na página inicial.
- **Segurança da Informação:**
  - Consultas SQL 100% parametrizadas (`?`) contra SQL Injection.
  - Rotas administrativas bloqueadas com middleware de autorização Bearer Token (HTTP 401 / 403).
  - Bloqueio de download de arquivos confidenciais (`.env`, `database.sqlite`, `package.json`).
  - Prevenção de XSS na renderização do DOM através de nós de texto seguros (`textContent`).

---

##  Estrutura do Projeto

```text
portifolio/
├── Backend/
│   ├── controllers/
│   │   ├── mensagens.controller.js  # Regras de negócio de mensagens (envio e listagem)
│   │   ├── projetos.controller.js   # CRUD completo e validações de projetos
│   │   └── visitas.controller.js    # Registro e contagem de acessos
│   ├── middleware/
│   │   └── auth.middleware.js       # Middleware de validação do token JWT Bearer
│   ├── routes/
│   │   ├── auth.routes.js           # Rota de login (/api/auth/login)
│   │   ├── mensagens.routes.js      # Rotas de mensagens (/api/mensagens)
│   │   ├── projetos.routes.js       # Rotas de projetos (/api/projetos)
│   │   └── visitas.routes.js        # Rotas de visitas (/api/visita e /api/visitas)
│   ├── scripts/
│   │   ├── gerar-hash.js            # Script utilitário para gerar hashes bcrypt
│   │   └── executar-testes.js       # Suíte automatizada de testes de integração
│   ├── database.js                  # Inicialização e schemas do SQLite
│   ├── database.sqlite              # Arquivo de dados SQLite (ignorado no Git)
│   └── server.js                    # Ponto de entrada do servidor Express
├── images/
│   └── olho.png                     # Ícones e assets estáticos
├── .env.example                     # Modelo documentado de variáveis de ambiente
├── .gitignore                       # Arquivos e pastas excluídos do versionamento
├── admin.css                        # Estilos do painel administrativo
├── admin.html                       # Página do painel administrativo
├── admin.js                         # Lógica do painel (consumo de APIs protegidas com JWT)
├── favicon.svg                      # Favicon do site
├── index.html                       # Página principal pública do portfólio
├── login.html                       # Página de login do administrador
├── login.js                         # Lógica de login e armazenamento do token
├── package.json                     # Metadados e dependências do projeto
├── README.md                        # Documentação do projeto
├── script.js                        # Lógica da vitrine pública e envio de mensagens
└── style.css                        # Estilos da página principal
```

---

##  Modelagem do Banco de Dados (SQLite)

O banco é criado e configurado automaticamente na primeira execução através do script `Backend/database.js`.

### Tabela `projetos`
| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | INTEGER PRIMARY KEY AUTOINCREMENT | Identificador único do projeto |
| `titulo` | TEXT NOT NULL | Título do projeto |
| `descricao` | TEXT NOT NULL | Descrição detalhada |
| `tecnologias` | TEXT NOT NULL | Lista de tecnologias (ex: Node.js, Express) |
| `github_url` | TEXT | Link do repositório no GitHub (opcional) |
| `demo_url` | TEXT | Link do projeto online / deploy (opcional) |
| `imagem_url` | TEXT | Caminho da imagem de capa (opcional) |
| `data_criacao` | DATETIME DEFAULT CURRENT_TIMESTAMP | Data e hora de criação |

### Tabela `mensagens`
| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | INTEGER PRIMARY KEY AUTOINCREMENT | Identificador da mensagem |
| `nome` | TEXT NOT NULL | Nome do remetente |
| `email` | TEXT NOT NULL | E-mail de contato do remetente |
| `mensagem` | TEXT NOT NULL | Conteúdo da mensagem |
| `data_envio` | DATETIME DEFAULT CURRENT_TIMESTAMP | Data e hora do envio |

### Tabela `visitas`
| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | INTEGER PRIMARY KEY AUTOINCREMENT | Identificador do acesso |
| `data_visita` | DATETIME DEFAULT CURRENT_TIMESTAMP | Registro de data e hora da visita |

---

##  Referência da API REST

### Rotas Públicas

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/projetos` | Retorna todos os projetos cadastrados em ordem decrescente |
| `GET` | `/api/projetos/:id` | Retorna os dados de um projeto específico pelo seu ID |
| `POST` | `/api/auth/login` | Autentica o administrador e devolve o JWT |
| `POST` | `/api/mensagens` | Recebe mensagens de contato enviadas pelo portfólio |
| `GET` | `/api/visita` | Registra um novo acesso ao site |
| `GET` | `/api/visitas` | Retorna a quantidade total de visitas |

### Rotas Protegidas (Requerem cabeçalho `Authorization: Bearer <TOKEN>`)

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/projetos` | Cadastra um novo projeto |
| `PUT` | `/api/projetos/:id` | Atualiza as informações de um projeto existente |
| `DELETE` | `/api/projetos/:id` | Remove um projeto do catálogo |
| `GET` | `/api/mensagens` | Retorna todas as mensagens de contato enviadas por visitantes |

---

##  Como Executar Localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/Jmfeliciano2/portifolio.git
cd portifolio
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Gerar a senha do administrador
Execute o gerador de hash embutido passando a senha que deseja usar para login:
```bash
npm run gerar-hash "suaSenhaAqui"
```
O terminal exibirá a linha pronta com o hash bcrypt (ex: `$2b$10$...`).

### 4. Configurar as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:
```env
PORT=3000
ADMIN_EMAIL=seu-email@exemplo.com
ADMIN_PASSWORD_HASH=cole_aqui_o_hash_gerado_no_passo_anterior
JWT_SECRET=coloque_aqui_uma_chave_secreta_longa_e_aleatoria
```

> **Atenção:** O arquivo `.env` contém credenciais e está listado no `.gitignore`. Nunca o envie para repositórios públicos.

### 5. Iniciar o servidor
```bash
npm start
```

### 6. Acessar no navegador
- **Portfólio:** [http://localhost:3000](http://localhost:3000)
- **Login Administrativo:** [http://localhost:3000/login.html](http://localhost:3000/login.html)
- **Painel Administrativo:** [http://localhost:3000/admin.html](http://localhost:3000/admin.html)

---

## Testes Automatizados

O projeto inclui uma suíte completa de testes de integração cobrindo 17 cenários (autenticação, CRUD, rotas protegidas, validações, casos de borda e sanitização).

Com o servidor rodando, execute:
```bash
node Backend/scripts/executar-testes.js
```

Todos os testes validam o comportamento esperado dos endpoints HTTP e códigos de status (200, 201, 400, 401, 403, 404).

---

##  Autor

**João Matheus**  
- **GitHub:** [https://github.com/Jmfeliciano2](https://github.com/Jmfeliciano2)  
- **LinkedIn:** [https://www.linkedin.com/in/joaomatheusfeliciano/](https://www.linkedin.com/in/joaomatheusfeliciano/)  
- **E-mail:** [felicianomatheus265@gmail.com](mailto:felicianomatheus265@gmail.com)  
