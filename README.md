# João Matheus — Portfólio React (CP3 FIAP)

Portfólio de João Matheus, estudante do **2º semestre de Engenharia de Software na FIAP**. Esta branch migra o visual e o conteúdo do site original para React, usando os temas das aulas: JSX, componentes, props, hooks useState e integração com APIs via fetch/async-await/try-catch.

**Importante:** esta é uma branch de implementação. O site da `main` permanece na versão original até que o aluno teste e aprove as alterações. O deploy na Vercel, as credenciais e o vídeo precisam ser configurados pelo aluno.

## Tecnologias

| Escolha | Por que | Alternativa / perda aceita |
| --- | --- | --- |
| React + Vite | Foco em JSX e componentes, sem backend acoplado | Next.js incluiria mais recursos, mas exige novos conceitos |
| React Router | Rotas claras e páginas individuais | Rotas no cliente precisam de rewrite na Vercel |
| CSS puro | Preserva o visual e usa conhecimentos já estudados | Mais regras manuais que Tailwind |
| fetch + useEffect/useState | Conteúdo das aulas, sem instalar Axios/Query | Cache básico em memória, sem invalidação sofisticada |
| API do GitHub | Repositórios reais, sem cadastro manual | Sujeita a limite de requisições e indisponibilidade |
| Supabase (Auth + Postgres) | Banco online e login persistentes | Serviço adicional e configuração de RLS |
| Resend + função Vercel | E-mail enviado do servidor com chave privada | Exige domínio remetente verificado |
| Vitest | Testes básicos de validação e autorização | Não substitui testes de navegador |
| GitHub Flow | Cada recurso em branch, PR para main | Mais etapas que commits diretos |

## Rodar localmente

1. Instale Node.js 20.19 ou mais recente.
2. Execute `npm install` na pasta do projeto.
3. Copie `.env.example` para `.env.local`, preenchendo as duas variáveis `VITE_SUPABASE_*` com os valores **públicos** do seu Supabase.
4. No SQL Editor do Supabase, execute `supabase/schema.sql`. Crie seu usuário do dashboard em **Authentication > Users** e desabilite cadastros públicos. As políticas do exemplo pressupõem apenas a conta administrativa autorizada.
5. Rode `npm run dev`, abra o endereço indicado pelo Vite.
6. Verifique: `npm test`, `npm run lint`, `npm run build`.

### Importante sobre contato

O `npm run dev` do Vite **não** executa a função `/api/contact`. Para testar o formulário com backend, use a função no ambiente da Vercel ou `vercel dev`, após configurar Supabase e Resend.

Na Vercel, importe este repositório, escolha **Vite**, Build Command `npm run build`, Output Directory `dist` e configure:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
```

`SUPABASE_SERVICE_ROLE_KEY` e `RESEND_API_KEY` são **secretas**, apenas no servidor. Não use prefixo `VITE_` para essas chaves. Configure um endereço remetente autorizado/verificado no Resend para o e-mail chegar. O formulário salva a mensagem antes de tentar notificar por e-mail e diferencia sucesso do armazenamento de sucesso do e-mail.

## Funcionalidades e arquitetura

```text
src/
  main.jsx                  # Entrada React
  App.jsx                   # Rotas e tema
  Dashboard.jsx             # Painel com React.lazy
  styles.css                # Identidade visual
  pages/                    # Home, Projects, ProjectDetails, Contact, Login, NotFound
  components/               # ProjectCard, ProjectList, ContactForm, ProtectedRoute
  hooks/useProjects.js      # Estados de carregamento/erro/dados
  services/github.js        # fetch GitHub + cache
  services/supabase.js      # Conexão e destaques
  utils/validation.js       # Validação formulário
  utils/auth.js             # Verificação de autenticação
  utils/*.test.js           # Testes automatizados
api/contact.js              # API serverless: salva mensagem e envia e-mail
supabase/schema.sql         # Tabelas + políticas RLS
public/favicon.svg          # Identidade original
AGENTS.md                   # Instruções da IA versionadas
CP3-PLANO.md                # Checklist e roteiro
ROTEIRO-VIDEO-CP3.md        # Roteiro de apresentação
vercel.json                 # Fallback de rotas no React Router
```

Fluxo de dados: navegador React → GitHub API (projetos); navegador → `/api/contact` Vercel → Supabase / Resend (contato); dashboard com autenticação Supabase → tabelas com RLS (mensagens e destaque).

As rotas `/`, `/projetos`, `/projetos/:slug`, `/contato`, `/login`, `/dashboard` e 404 estão incluídas. Os repositórios da API contêm nome, descrição, linguagem e última atualização. A busca de projetos compartilha uma Promise em memória, evitando novo fetch entre páginas na mesma visita. O tema usa localStorage. O dashboard tem carregamento sob demanda. Os projetos destacados usam tabela Supabase, com fallback para os três primeiros do GitHub.

## Workflow e IA

**GitHub Flow:** `feature/nome-da-funcionalidade` → commits Conventional Commits → pull request → revisão → `main` → deploy automático conectado à Vercel.

Prefixos: `feat:`, `fix:`, `docs:`, `test:`, `style:`, `refactor:`, `chore:`. Componentes React em PascalCase, funções em camelCase e hooks começam em `use`. Serviços externos separados dos elementos visuais quando possível. Há configuração de ESLint, Prettier, Husky e lint-staged (é preciso `npm install` para instalar hooks). Leia `AGENTS.md` para as instruções dadas à IA.

**Harness usado nesta etapa:** ChatGPT com modelo GPT-6, conector GitHub, regras versionadas em `AGENTS.md` e revisão do estudante. Codex é uma opção futura, mas não foi usado nesta etapa. Nenhum agente auxiliar ou skill de codificação adicional foi configurado.

## Testes e requisitos que precisam de comprovação

Há testes automáticos para validação do formulário e verificação de sessão. É necessário executar e comprovar os testes (não foram executados neste ambiente). O alvo **Lighthouse mobile ≥80** precisa ser medido após deploy real com Chrome Lighthouse ou PageSpeed Insights. Também precisam ser testados envio de e-mail com domínio verificado, persistência de mensagens, login, políticas RLS, atualização direta da rota por link e deploy a cada push na `main`.

### Entrega até 03/11/2026

- Link público do repositório GitHub.
- Link funcional da Vercel (não confundir com GitHub Pages).
- Vídeo no YouTube como **não listado**, máximo de 8 minutos, com rosto e tela visíveis, mostrando stack, alternativas, trade-offs, estrutura, fluxo de branches/deploy e o harness de IA real.

## Histórico

Os arquivos da versão antiga (HTML/JS, Express/SQLite) foram mantidos no repositório para referência, mas não fazem parte do build Vite. A versão anterior continua acessível no histórico Git.

## Autor

João Matheus — [GitHub](https://github.com/Jmfeliciano2) · [LinkedIn](https://www.linkedin.com/in/joaomatheusfeliciano/)
