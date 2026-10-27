# Roteiro de vídeo — Entrevista técnica CP3 (até 8 minutos)
**Grave sua webcam e sua tela simultaneamente durante TODO o vídeo. Não leia afirmações de funcionalidades sem testá-las.**

## 0:00–0:45 | Apresentação
"Olá, sou João Matheus, estudante do segundo semestre de Engenharia de Software da FIAP. Para esse checkpoint, evoluí meu portfólio original de HTML, CSS e JavaScript para React. A proposta é mostrar meus projetos e explicar as decisões de engenharia e como usei IA no processo."

**Na tela:** home do portfólio.

## 0:45–2:00 | Demonstração
"Os projetos são buscados automaticamente da API do GitHub usando fetch e async/await, conceitos que vimos em aula. Não preciso cadastrar manualmente cada repositório. Ao clicar em um projeto, a URL mostra seu nome, e a página carrega os detalhes. Também tratei os estados de carregamento, erro e ausência de dados, além de criar uma página 404. O tema fica salvo em localStorage."

**Na tela:** projetos, detalhe, atualização da URL e tema. Se o deploy não estiver pronto, mostre a versão local.

## 2:00–3:10 | Arquitetura
"Organizei o frontend com React e Vite. O main.jsx inicia a aplicação; o App.jsx organiza as rotas; services/github.js fica responsável pela API; utils/validation.js valida o formulário e Dashboard.jsx contém a parte administrativa. Separar essas responsabilidades evita misturar tudo em um componente."

**Na tela:** árvore de arquivos no VS Code. Desenhe: React → API do GitHub; formulário → Vercel → Supabase + Resend; dashboard → Supabase Auth + banco.

## 3:10–4:25 | Escolhas e trocas
"Escolhi Vite em vez de Next.js por ser mais direto para aprender React e JSX. Usei CSS puro em vez de Tailwind para aproveitar meus conhecimentos e preservar meu visual. Escolhi fetch em vez de Axios porque é nativo e foi ensinado em aula. O React Router organiza as páginas, mas precisei configurar redirecionamento da Vercel para links diretos. Para o dashboard, o Supabase simplifica login e dados em produção, embora dependa de configuração externa. Também dispensei elementos 3D para priorizar desempenho."

## 4:25–5:35 | Qualidade, segurança e performance
"Os hooks useState e useEffect controlam o formulário e as requisições. O botão é desativado durante o envio. A área administrativa exige login e o banco usa políticas RLS; esconder a rota sozinho não é suficiente para proteger dados. O dashboard é carregado somente quando necessário usando React.lazy. Os testes Vitest verificam a validação e o bloqueio de acesso."
**Na tela:** testes e status do GitHub Actions. Mostre o resultado real do Lighthouse mobile, sem inventar nota.

## 5:35–6:30 | Branch até deploy
"Utilizei uma branch separada, feature/cp3-react, com commits que seguem um padrão como feat:, fix: e docs:. Antes de integrar na main, faço revisão e verificações. O fluxo previsto é branch, alterações, testes, Pull Request, revisão e merge; quando a main é atualizada, a Vercel realiza o deploy automaticamente após configurar a integração."

**Na tela:** branch, PR e Vercel quando estiver conectado. Não diga que o deploy está ativo antes de configurá-lo.

## 6:30–7:40 | Harness de IA
"Usei ChatGPT com o modelo GPT-6 e o conector GitHub para ler o repositório existente e preparar alterações sem perder o histórico. Versionei no AGENTS.md instruções para a IA seguir: nomes em PascalCase, hooks começando com use, separação entre interface e chamadas de API, cuidado com senhas, padrão dos commits e uso de branches. Também incluí documentação e verificações automáticas. A escolha foi usar IA como apoio e revisar pessoalmente cada decisão, em vez de só aceitar código sem entender."

**Na tela:** AGENTS.md, README, commits, PR e GitHub Actions.

## 7:40–8:00 | Encerramento
"O projeto mostra minha evolução em frontend e integração com APIs, além de organização e boas práticas de engenharia. Obrigado pela oportunidade de apresentar meu trabalho."

---

## Checklist antes de gravar
- [ ] Abrir a URL real da Vercel (página e rotas diretas)
- [ ] Testar login, mensagens, destaques e e-mail
- [ ] Executar testes e verificar resultado do Lighthouse mobile
- [ ] Apresentar o modelo/ferramenta realmente usados e os arquivos de instrução
- [ ] Conferir webcam e captura da tela
- [ ] Publicar como **não listado** e copiar o link para o Teams
