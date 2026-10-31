# Autoavaliação crítica — CP3 Portfolio / Stack e Harness Engineering

Esta avaliação considera os requisitos do enunciado e o código da branch `feature/cp3-react`. Não considera como comprovado o que depende de credenciais, execução no navegador, deploy, Lighthouse ou vídeo.

## Nota estimada nesta etapa: 6,0 / 10

É uma estimativa conservadora de correção por professor/IA, não uma nota oficial. A implementação de código está avançada, mas o enunciado exige também comprovação de execução, publicação e apresentação.

## Avaliação por requisito

| Requisito | Avaliação do código | Situação para correção |
| --- | --- | --- |
| 1. Rotas | React Router com home, projetos, detalhe por slug, contato, login, dashboard e 404. Rewrite Vercel configurado. | Implementado no código; testar URL direta e refresh após deploy. |
| 2. Estados | Hook de projetos com loading, erro, vazio, skeleton e retry; formulário bloqueia envio repetido. | Implementado; testar API indisponível e retorno vazio. |
| 3. GitHub | Repositórios públicos vêm de fetch na API do GitHub; cards mostram descrição, linguagem e atualização. Cache compartilha Promise entre páginas. | Implementado; depende do limite/disponibilidade da API. |
| 4. Contato | Validação no cliente e servidor, API serverless salva no Supabase e tenta notificar via Resend. | Parcial até configurar chaves, remetente verificado e testar e-mail real. |
| 5. Dashboard | Login Supabase, verificação de usuário administrador, listagem, respondida e destaques. RLS restringe ao UUID cadastrado. | Código implementado; precisa criar o usuário, cadastrar UUID e testar políticas. |
| 6. Tema | Claro/escuro salvo em localStorage. | Implementado no código; testar entre visitas. |
| 7. Interface | CSS responsivo, componentes reaproveitados e identidade visual própria. | Parcial: precisa validar em aparelhos/tamanhos reais e revisar acessibilidade. |
| 8. Performance | Dashboard com React.lazy, cache GitHub e skeleton com espaço reservado. | Parcial: ainda não há relatório Lighthouse mobile ≥80; não há evidência de medição. |
| 9. Testes | Vitest testa validação e a regra de autorização de administrador. | Parcial: a regra é testada isoladamente, não há teste de renderização/navegação da rota protegida. |
| 10. Deploy | Configuração de rewrite e workflow de CI. | Pendente: não há URL Vercel comprovada nem prova de deploy automático da main. CI não é deploy. |
| 11. Versionamento | Branch feature/cp3-react, commits com Conventional Commits, PR e Husky/lint-staged. | Parcial: branch existe, mas o histórico não está distribuído ao longo do prazo e o fluxo completo de várias features/PRs não foi demonstrado. |
| 12. Arquitetura | Pastas pages, components, hooks, services e utils; README e AGENTS.md. | Implementado em boa parte; ainda há arquivos extensos e oportunidade de dividir componentes. |

## Pontos que podem reduzir a nota em uma avaliação automática

1. **Deploy ausente:** o professor pediu link Vercel funcional e publicação automática a cada push na main. Workflow de lint/test/build não substitui deploy.
2. **Lighthouse não medido:** a meta de 80 no mobile é objetiva. Sem relatório ou URL, a IA corretora não deve presumir que foi atingida.
3. **Integrações externas sem evidência:** Supabase e Resend exigem credenciais e configuração. Código presente não prova envio real de e-mail nem persistência.
4. **Teste do dashboard:** os testes cobrem a função de autorização, mas um avaliador mais rigoroso pode exigir teste do componente ProtectedRoute redirecionando para /login.
5. **Histórico de commits:** o requisito pede histórico distribuído ao longo do prazo. Não é correto criar commits retroativos para simular datas; continue trabalhando com commits reais e pequenos.
6. **Vídeo:** não há gravação nem link não listado. O vídeo é parte obrigatória da entrega e precisa mostrar rosto e tela por até 8 minutos.
7. **Harness:** AGENTS.md registra ChatGPT GPT-6 e conector GitHub realmente utilizados. Não foram configurados agentes adicionais, skills de codificação ou MCPs próprios. Não afirmar que existem.

## Melhorias já feitas nesta revisão

- .gitignore agora exclui .env, .env.* e arquivos locais, mantendo .env.example.
- RLS passou a exigir o UUID do dono na tabela admin_users para ler/alterar mensagens e editar destaques.
- A rota protegida confere se o usuário autenticado está cadastrado como administrador.
- Testes da regra de acesso cobrem usuário sem sessão, usuário sem permissão e administrador.
- A seleção vazia de destaques agora é respeitada, em vez de mostrar automaticamente os três primeiros.
- Retry do GitHub força nova requisição em vez de reutilizar a Promise com falha.
- Dashboard ganhou tratamento de erros e bloqueio de ações repetidas.
- Rewrite da Vercel foi simplificado para o padrão catch-all de SPA.

## Plano de fechamento — prioridade

1. Configurar Supabase: criar conta do dono, copiar UUID, executar schema com UUID real, verificar RLS.
2. Configurar Vercel e variáveis de ambiente; publicar e testar /projetos/nome-do-repo, /dashboard e 404 diretamente.
3. Configurar Resend com remetente autorizado e enviar mensagem real; confirmar registro no banco e e-mail.
4. Executar `npm run lint`, `npm test` e `npm run build`; confirmar último GitHub Actions verde.
5. Rodar Lighthouse em mobile e anexar a evidência; corrigir até atingir 80 ou mais.
6. Testar layout em celular e desktop, estados de API, login e dashboard.
7. Gravar o vídeo com webcam e tela, dentro de 8 minutos, e publicar como não listado.
8. Revisar o PR e só então integrar à main.

## Adequação ao conteúdo das aulas

O projeto usa JSX para escrever a interface em componentes, conforme a apostila de JSX; usa useState para estados que atualizam a tela, conforme o slide de Hooks; e usa fetch, endpoints HTTP e try/catch na integração com a API do GitHub, conforme o material de APIs. React Router, componentização e props também aparecem entre os tópicos listados no material de Hooks. A arquitetura foi mantida em nível explicável para o segundo semestre, sem introduzir Redux, TypeScript, arquitetura distribuída ou outras abstrações desnecessárias.

## Observação

A nota pode subir significativamente quando as etapas de publicação, integração real, Lighthouse, testes e vídeo forem comprovadas. Não apresente como concluído aquilo que ainda depende dessas verificações.
