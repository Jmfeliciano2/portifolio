# CP3 — Plano de implementação e entrevista

## Estado original
O repositório contém site estático com HTML, CSS e JS, backend Express, SQLite e painel administrativo. A versão React deve aproveitar o conteúdo e estilo, e migrar componentes gradualmente.

## Stack recomendada
React + Vite / JSX; React Router; CSS puro; useState e useEffect; fetch GitHub API; Supabase Auth/Postgres para dados persistentes na Vercel; função serverless Vercel para formulário e Resend para e-mail; Vitest para testes; GitHub Flow para branches e commits; lint, Prettier e Husky para verificação antes do commit.

## Checklist obrigatório
- [ ] React e Vite rodando localmente
- [ ] Links individuais /projetos/:slug, 404 e fallback de rotas na Vercel
- [ ] GitHub API como única fonte dos repositórios exibidos
- [ ] Skeleton, erro, estado vazio e botão de reenvio
- [ ] Formulário: validação por campo e envio sem duplicar
- [ ] Salvar mensagens e notificar por e-mail
- [ ] Login do dono com acesso real protegido também no backend/banco
- [ ] Dashboard: listar mensagens, marcar respondida e selecionar destaques
- [ ] Tema persistente entre visitas
- [ ] Mobile e desktop com componentes reutilizados
- [ ] Imagens dimensionadas, lazy loading e dashboard React.lazy
- [ ] Cache de projetos entre rotas
- [ ] Lighthouse mobile >= 80 comprovado
- [ ] Testes automáticos de formulário e dashboard
- [ ] Deploy na Vercel ligado à branch main
- [ ] Branches, commits organizados e PRs
- [ ] README, AGENTS.md e .env.example atualizados
- [ ] Vídeo <= 8 minutos no YouTube não listado, com rosto e tela

## Escolhas e trade-offs
- Vite em vez de Next.js: menos conceitos, mas requer configurar fallback das rotas.
- CSS puro em vez de Tailwind: reutiliza a estética e aulas, mas estilos manuais.
- fetch em vez de Axios: API nativa já estudada, mas mais tratamento manual.
- React Router em vez de Next Router: pequeno e simples, mas sem renderização no servidor.
- Supabase em vez de SQLite na Vercel: oferece persistência e autenticação gerenciadas, mas depende de serviço externo.
- Sem 3D: melhora simplicidade, acessibilidade e desempenho.

## Roteiro do vídeo (até 8 minutos)
0:00-0:45 apresentação e objetivo;
0:45-2:10 páginas, navegação, estados de carregamento e projetos GitHub;
2:10-3:20 fluxo React -> API GitHub e formulário -> API -> banco/e-mail;
3:20-4:30 stack, alternativas e perdas aceitas;
4:30-5:45 dashboard, tema, segurança e testes;
5:45-6:45 estrutura components/pages/services/hooks, branches e deploy;
6:45-7:45 harness: modelo, arquivo AGENTS.md, configurações reais, prompts, revisão humana;
7:45-8:00 conclusão.

Não apresentar como implementado nenhum item ainda marcado pendente.
