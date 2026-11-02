# João Matheus — Portfólio React (CP3 FIAP)

Portfólio de João Matheus, estudante do **2º semestre de Engenharia de Software na FIAP**. A branch `feature/cp3-react` evolui o site original para React e Vite, usando JSX, componentes, hooks e APIs estudadas em aula, preservando o visual escuro com destaque laranja.

## Tecnologias

| Escolha                           | Motivo                                                   | Trade-off                                       |
| --------------------------------- | -------------------------------------------------------- | ----------------------------------------------- |
| React + Vite                      | Foco em JSX e componentes                                | Rotas de cliente precisam de fallback no deploy |
| React Router                      | Organiza páginas e detalhes individuais                  | Não renderiza páginas no servidor               |
| CSS puro                          | Preserva o estilo e usa conhecimentos estudados          | Mais regras manuais                             |
| `fetch`, `useState` e `useEffect` | API nativa e conceitos das aulas                         | Cache simples em memória                        |
| API pública do GitHub             | Lista repositórios reais sem cadastro fixo               | Sujeita a limite e indisponibilidade da API     |
| Supabase Auth e Postgres          | Login e dados persistentes para a área administrativa    | Exige configurar projeto, variáveis e RLS       |
| Vercel Function + Resend          | Salva mensagens no servidor e tenta notificar por e-mail | Requer credenciais e remetente verificado       |
| Vitest                            | Testa validação, autorização e API                       | Não substitui testes completos em navegador     |

## Rodar localmente

Requer Node.js 20.19 ou mais recente.

```bash
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite. A aplicação pública e a listagem do GitHub funcionam sem variáveis locais. Para habilitar o login/dashboard, copie `.env.example` para `.env.local` e preencha as variáveis públicas `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` de um projeto Supabase. Não coloque chaves privadas em variáveis `VITE_`.

O servidor Vite sozinho **não executa** `api/contact.js`; contato com persistência e e-mail precisa de `vercel dev` ou deploy da função na Vercel com as variáveis privadas configuradas.

## Supabase e administrador

1. Crie o projeto Supabase e um usuário em **Authentication > Users**. Mantenha cadastro público desabilitado.
2. Copie o UUID do usuário criado.
3. Em `supabase/schema.sql`, substitua `COLE_O_UUID_DO_DONO` pelo UUID real e execute o arquivo no SQL Editor. Ele cria tabelas, políticas RLS e registra o administrador; pode ser executado novamente.
4. Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no ambiente local. No dashboard da Vercel, também cadastre as variáveis privadas listadas abaixo.
5. Teste login com o usuário criado e confira mensagens e destaques. Não use UUID fictício nem exponha a chave `service_role`.

## Vercel e variáveis

O plugin Vercel foi localizado no catálogo, mas não está instalado/conectado; não há evidência de projeto ou deploy. Conecte a integração e verifique se há um projeto antigo antes de criar um **projeto separado** para a primeira publicação CP3 com:

- Framework Preset: Vite
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Production Branch: `main`, conforme ao requisito de deploy automático na branch principal. `feature/cp3-react` gera prévias até ser revisada e integrada à `main`.

`vercel.json` encaminha rotas da SPA para `index.html`; `api/contact.js` é a função serverless. Cadastre no painel, sem compartilhar os valores:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
```

As duas variáveis `VITE_` são públicas no bundle. `SUPABASE_SERVICE_ROLE_KEY` e `RESEND_API_KEY` são privadas de servidor. O Resend exige remetente autorizado/verificado. A mensagem é gravada antes da tentativa de e-mail, e a API retorna separadamente o resultado da notificação.

## Funcionalidades e arquitetura

Rotas: `/`, `/projetos`, `/projetos/:slug`, `/contato`, `/login`, `/dashboard` e página 404. Repositórios são carregados com `fetch`; forks e arquivados são excluídos. Há estados de carregamento, erro, lista vazia e retry. O detalhe usa o nome do repositório na URL. O tema claro/escuro persiste em `localStorage`.

```text
src/
  App.jsx                    # Rotas, navegação e tema
  Dashboard.jsx              # Mensagens e seleção de destaques
  pages/                     # Home, projetos, contato, login e 404
  components/                # Formulário, cards, lista e rota protegida
  hooks/useProjects.js       # Carregamento e estados dos projetos
  services/                  # GitHub e Supabase
  utils/                     # Validação e autorização
api/contact.js               # Função Vercel para contato
supabase/schema.sql          # Tabelas e políticas RLS
```

## Qualidade e evidências desta continuação

Executados localmente na branch `feature/cp3-react`: `npm run lint` passou; `npm test` passou com 13 testes em 3 arquivos; `npm run build` passou. O lockfile fixa as dependências; `npm audit` reportou zero vulnerabilidades após atualizar Vitest e aplicar override de minimatch. No navegador local, foram conferidos o formulário e sua validação, a lista obtida da API pública, um detalhe aberto diretamente e após atualizar a URL, e a página 404. Não foi enviado contato válido nem testado Supabase/Resend.

O GitHub Actions executa instalação, lint, testes e build. As duas execuções mais recentes consultadas para o commit `2fec2b5` passaram. A URL pública, o deploy, as rotas publicadas e a pontuação Lighthouse ainda não foram confirmados.

## Fluxo de trabalho e IA

O trabalho CP3 fica em `feature/cp3-react`; revise alterações antes de propor merge para `main`. O workflow CI não faz deploy por si só. Nesta continuação, foram usados Codex desktop (GPT-6), terminal local e conector GitHub para leitura de informações e resultados do Actions. Não foram usados agentes auxiliares nem skills de codificação. O estudante deve revisar e conseguir explicar as mudanças antes da entrega.

## Entrega

- Link do repositório e PR: https://github.com/Jmfeliciano2/portifolio/pull/1
- Deploy Vercel: o plugin está disponível, mas não instalado/conectado; depois de conectar, conferir o projeto antigo e configurar o CP3 separado
- Lighthouse mobile: pendente de medição em uma URL publicada
- Integração Supabase/Resend: pendente de credenciais e teste real
- Vídeo: deve ser gravado pelo estudante, com rosto e tela, até 8 minutos; use `ROTEIRO-VIDEO-CP3.md`

**Entrega prevista no material atual: 03/11/2026.**
