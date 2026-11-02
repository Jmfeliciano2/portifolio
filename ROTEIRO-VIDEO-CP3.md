# Roteiro de vídeo — Entrevista técnica CP3 (até 8 minutos)

**O estudante deve gravar a própria apresentação, com rosto e tela durante todo o vídeo. Mostre somente fluxos que realmente testou e não revele credenciais.**

## 0:00–0:40 | Apresentação

"Olá, sou João Matheus, estudante do segundo semestre de Engenharia de Software da FIAP. Neste CP3, evoluí o portfólio estático para React e Vite. Vou demonstrar o que testei localmente e explicar as integrações que ainda precisam de configuração externa."

**Tela:** página inicial local ou publicada, conforme estiver funcionando no dia. Se usar local, diga que é local.

## 0:40–1:50 | Portfólio e navegação

"Os projetos vêm da API pública do GitHub usando fetch. O código filtra repositórios arquivados e forks. Também há detalhes por projeto, navegação de contato e página 404. O tema pode alternar entre claro e escuro e fica salvo no navegador."

**Telas:** home, lista carregada, detalhe do repositório /projetos/follow-up aberto diretamente e após atualizar, contato com validação inválida e rota 404. Não envie um contato válido durante a gravação sem ambiente de teste configurado.

## 1:50–2:55 | React e organização

"main.jsx inicia o React. App.jsx organiza rotas e navegação. ProjectList passa dados por props para ProjectCard; useProjects cuida do carregamento, erro e tentativa novamente; services/github.js isola o acesso à API."

**Telas:** árvore src/, ProjectList.jsx, ProjectCard.jsx, useProjects.js e services/github.js.

## 2:55–4:00 | Formulário e API

"O formulário valida os campos no navegador e envia um POST para /api/contact. A função de servidor valida novamente, salva a mensagem no Supabase e só depois tenta enviar o e-mail pelo Resend. A interface distingue mensagem salva de notificação enviada. O Vite sozinho não executa essa função; ela depende da Vercel e de credenciais configuradas."

**Telas:** ContactForm.jsx, validação local e api/contact.js. Diga claramente se o endpoint não foi testado em produção.

## 4:00–5:00 | Login, dashboard e segurança

"A rota administrativa verifica a sessão e se o ID do usuário foi cadastrado como administrador. O banco também usa políticas RLS, então esconder a tela não é a única proteção. Sem configurar o Supabase e o UUID real, não devo afirmar que o login ou as operações foram testados."

**Telas:** ProtectedRoute.jsx, src/utils/auth.js, Dashboard.jsx e supabase/schema.sql. Só mostre login/dashboard real se você tiver testado com Supabase.

## 5:00–5:50 | Testes e qualidade

"Na revisão local desta versão, lint passou, o build passou e os 13 testes Vitest passaram. Eles cobrem validação, regra de administrador, estado inicial da rota e respostas de método e validação da API. Isso não substitui a prova de persistência, e-mail ou testes reais no banco."

**Tela:** executar npm run lint, npm test, npm run build, ou mostrar os resultados desta revisão. Para o GitHub Actions, mostre o commit e execução correspondente; não trate verificações de um commit antigo como validação das últimas mudanças locais.

## 5:50–6:35 | GitHub Flow e Vercel

"A versão React está na branch feature/cp3-react e o PR está aberto como rascunho. Não houve merge automático para main. O primeiro deploy desta versão deve ser feito em um projeto Vercel separado, usando Vite e a branch CP3 como branch de produção."

**Tela:** branch, PR e configurações da Vercel somente se já estiverem disponíveis. Se ainda estiver pendente, explique o que falta. Não diga que existe URL de produção sem confirmar.

## 6:35–7:30 | Performance e harness de IA

"O dashboard é carregado sob demanda e os bundles são gerados pelo Vite. Ainda preciso medir Lighthouse mobile numa URL publicada; por isso não vou apresentar uma pontuação. Nesta continuação usei Codex desktop GPT-6, terminal local e conector GitHub de leitura. Não usei agentes auxiliares nem skills de codificação. As instruções estão em AGENTS.md, e a revisão humana do estudante continua necessária."

**Telas:** AGENTS.md, tamanho do build e relatório Lighthouse apenas se houver medição real.

## 7:30–8:00 | Encerramento

"Esse projeto me ajudou a praticar React, consumo de APIs, estados, validação e organização. As próximas etapas são configurar e testar Supabase/Resend, publicar em projeto Vercel separado, medir desempenho e concluir a apresentação."

## Checklist de gravação

- [ ] Confirmar se a demonstração é local ou URL pública real.
- [ ] Conferir rotas, detalhe, refresh e 404.
- [ ] Não enviar dados reais sem ambiente de teste autorizado.
- [ ] Não revelar .env, tokens, chaves ou dados pessoais de terceiros.
- [ ] Mostrar somente testes e pontuações realmente executados.
- [ ] Gravar rosto e tela por todo o vídeo e manter duração de até 8 minutos.
- [ ] Publicar como não listado, copiar o link e entregar pelo canal solicitado pela FIAP.
