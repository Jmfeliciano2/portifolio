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
- HTTP Module
- SQLite
- better-sqlite3

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
├── backend/
│   ├── server.js
│   └── database.js
│
├── data/
│   └── portfolio.db
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
| data | DATETIME |

### visitas

| Campo | Tipo |
|---------|--------|
| id | INTEGER |
| data | DATETIME |

---

## APIs

### Obter número de visitas

```http
GET /api/visitas
```

Exemplo:

```json
{
  "visitas": 120
}
```

---

### Enviar mensagem

```http
POST /api/contato
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