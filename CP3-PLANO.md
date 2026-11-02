# CP3 — Plano de implementação e entrevista

## Contexto

O repositório original contém o portfólio estático e backend legado. A branch `feature/cp3-react` mantém esses arquivos e implementa a versão React/Vite. O enunciado original da CP3 não foi localizado no repositório; os documentos existentes são referências, e requisitos que precisam dele permanecem sujeitos à confirmação.

## Stack e escolhas

React + Vite / JSX, React Router, CSS puro, `useState`, `useEffect`, `fetch`, Supabase Auth/Postgres, função serverless Vercel, Resend e Vitest. Vite e CSS puro mantêm o trabalho próximo do conteúdo estudado. Supabase e Vercel simplificam persistência/deploy, mas dependem de contas e configuração externa. Não foram adicionadas arquiteturas complexas.

## Estado e evidências atuais

- [x] React/Vite inicia localmente; a página local respondeu HTTP 200.
- [x] Rotas de projetos, detalhe, contato, login, dashboard e 404 estão no React Router; detalhe direto e refresh e a rota 404 foram conferidos no navegador local.
- [x] Projetos vêm da API pública do GitHub; lista carregada no navegador, filtrando forks e arquivados.
- [x] Estados de carregamento, erro, vazio e retry presentes no carregamento dos projetos.
- [x] Contato valida no cliente e servidor; testes do endpoint cobrem método, JSON inválido, dados inválidos e tamanho. Sem credenciais, banco/e-mail reais não foram testados.
- [x] A rota administrativa confere sessão e cadastro de administrador; o banco mantém políticas RLS. Login e permissões reais aguardam configuração Supabase.
- [x] Tema em `localStorage`; layout responsivo e movimento reduzido definidos em CSS. Teste em aparelho real pendente.
- [x] `npm run lint`, `npm test` (13 testes) e `npm run build` passaram nesta continuação.
- [ ] Configurar projeto Supabase, cadastrar UUID real e verificar as políticas no ambiente remoto.
- [ ] Configurar Resend com remetente autorizado e confirmar envio real.
- [ ] Criar um projeto Vercel separado, com branch de produção `main`, com `feature/cp3-react` usada para prévias até a integração aprovada, variáveis e URL pública; testar URLs diretamente.
- [ ] Executar Lighthouse mobile em publicação e corrigir o que a medição indicar.
- [ ] Gravar e publicar pelo estudante o vídeo de até 8 minutos.

## Entrevista técnica

Explique como `main.jsx` inicia a aplicação; `App.jsx` monta as rotas e tema; `ProjectList` e `ProjectCard` apresentam dados com props; `useProjects` controla os estados; `services/github.js` usa `fetch` e cache; `ContactForm` valida e chama `POST /api/contact`; a função grava com Supabase antes da tentativa Resend; `ProtectedRoute` verifica administrador e RLS protege as tabelas no banco.

## Ordem de fechamento

1. Configurar Supabase e confirmar RLS usando a conta do dono.
2. Configurar Vercel em projeto separado, produção pela branch CP3, e testar todas as rotas publicadas.
3. Configurar Resend e validar persistência e notificação reais.
4. Reexecutar lint, testes e build após qualquer ajuste.
5. Medir Lighthouse mobile com URL pública; não estimar pontuação.
6. Revisar código/documentação e PR; não fazer merge na `main` sem autorização.
7. Gravar o vídeo; não apresentar integrações ou deploy como comprovados antes de testá-los.

## Roteiro do vídeo (até 8 minutos)

Use o roteiro detalhado em `ROTEIRO-VIDEO-CP3.md`. O vídeo deve mostrar a interface, código, testes e evidências reais. O estudante deve gravar sua própria apresentação.
