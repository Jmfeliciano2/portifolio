# João Matheus - Portfólio

Portfólio pessoal desenvolvido para apresentar meus projetos, habilidades e experiências na área de desenvolvimento de software.

O projeto foi construído com foco em design minimalista, responsividade e integração entre frontend e backend utilizando Node.js e SQLite.

---

## Tecnologias utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express
- SQLite
- sqlite3

### Ferramentas
- Git
- GitHub

---

## Funcionalidades

### Interface
- Design responsivo
- Menu mobile
- Animações suaves
- Seção de projetos
- Seção de stack tecnológica
- Seção de contato

### Backend
- Contador de visitas
- Formulário de contato
- API para mensagens
- API para visitas
- Armazenamento em banco de dados SQLite

---

## Estrutura do projeto

```text
portifolio/
│
├── Backend/
│   ├── server.js
│   ├── database.js
│   └── database.sqlite (criado automaticamente)
│
├── data/
│   └── arquivos legados (não usados pela API)
│
├── images/
│   └── olho.png
│
├── index.html
├── style.css
├── script.js
├── package.json
├── package-lock.json
└── README.md
```

---

## Banco de Dados

O projeto utiliza SQLite com duas tabelas:

### mensagens

| Campo | Tipo |
|---------|--------|
| id | INTEGER |
| nome | TEXT |
| email | TEXT |
| mensagem | TEXT |
| data_envio | DATETIME |

### visitas

| Campo | Tipo |
|---------|--------|
| id | INTEGER |
| data_visita | DATETIME |

---

## APIs

### Obter número de visitas

```http
GET /api/visitas
```

Exemplo:

```json
{
  "totalVisitas": 120
}
```

---

### Enviar mensagem

```http
POST /api/mensagens
```

Exemplo:

```json
{
  "nome": "João",
  "email": "email@teste.com",
  "mensagem": "Olá!"
}
```

---

### Listar mensagens

```http
GET /api/mensagens
```

---

## Como executar

### Clonar o projeto

```bash
git clone https://github.com/Jmfeliciano2/portifolio.git
```

Entrar na pasta:

```bash
cd portifolio
```

Instalar dependências:

```bash
npm install
```

Iniciar servidor:

```bash
npm start
```

Abrir no navegador:

```text
http://localhost:3000
```

---

## Projetos em destaque

### Cinelog
Aplicação web para registro e organização de filmes assistidos.

### AgroSat
Projeto acadêmico para monitoramento agrícola utilizando sensores e Arduino.

### Vinheria Agnello
Website responsivo para apresentação institucional e catálogo.

---

## Objetivos do projeto

- Evoluir conhecimentos em frontend
- Aplicar conceitos de backend com Node.js
- Utilizar banco de dados SQLite
- Trabalhar com APIs
- Aprimorar organização de projetos

---

## Contato

GitHub:
https://github.com/Jmfeliciano2

LinkedIn:
https://www.linkedin.com/in/joaomatheusfeliciano/

E-mail:
felicianomatheus265@gmail.com
## Execução local e diagnóstico

Use `npm start` e abra http://localhost:3000. O Live Server do VS Code e a abertura direta de `index.html` não executam a API Express.

O servidor cria as tabelas `visitas` e `mensagens` antes de aceitar requisições. Não é necessário enviar a primeira mensagem para criar a tabela. Os dados existentes são preservados. No SQLite Viewer, abra `Backend/database.sqlite` e atualize a visualização; esse arquivo é binário e não deve ser editado como texto.

O frontend registra uma visita por carregamento com `GET /api/visita`, consulta `GET /api/visitas` e envia o formulário para `POST /api/mensagens`. A confirmação de envio aparece abaixo do botão. Dados inválidos recebem HTTP 400 e mensagens salvas recebem HTTP 201.

Para testes isolados, a variável `DATABASE_PATH` permite escolher outro banco; `PORT` permite mudar a porta. O padrão continua sendo `Backend/database.sqlite` e a porta 3000.

`GET /api/mensagens` continua disponível para consulta local, sem autenticação. Antes de publicar o projeto, proteja essa rota para que os dados de contato não fiquem públicos.
