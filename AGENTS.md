# Instruções do projeto para IA — CP3 FIAP

## Objetivo e nível

Migrar o portfólio original de João Matheus para React sem abandonar sua identidade visual. O projeto é de um estudante do segundo semestre de Engenharia de Software: priorize JSX, componentes, props, `useState`, `useEffect`, `fetch`, `async/await`, `try/catch`, CSS e JavaScript simples.

## Tecnologias e organização

- React + Vite, React Router, CSS puro e componentes reutilizáveis.
- Coloque chamadas externas e lógica compartilhada em `services/`, `hooks/` e `utils/` quando isso melhorar a clareza.
- Mantenha o visual escuro, textos claros, acento laranja e logo JM.
- Não adicione bibliotecas ou camadas sem necessidade comprovada.

## Convenções

- Componentes e páginas em PascalCase, por exemplo `ProjectCard.jsx`.
- Hooks iniciados com `use`, por exemplo `useProjects.js`.
- Funções e variáveis em camelCase.
- Commits Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
- Não envie `.env`, senhas, tokens ou chaves secretas ao GitHub.
- Faça alterações CP3 somente em `feature/cp3-react`; nunca integre em `main` sem autorização do estudante.
- Antes de considerar uma mudança concluída, rode lint, testes e build e registre resultados reais. Faça revisão humana antes de merge ou deploy.

## Harness e revisão humana

Nesta continuação foram usados Codex desktop (GPT-6), terminal local para ler/editar/executar o projeto e o conector GitHub para consultar branch, PR, arquivos e execuções do Actions. O conector GitHub foi somente leitura nesta continuação. O plugin Vercel foi localizado no catálogo, mas não estava instalado/conectado; não houve publicação. Não foram usados agentes auxiliares nem skills específicas de codificação. A revisão humana do estudante continua necessária para aprovar decisões e a entrega.

## Segurança

- Uma rota React protegida não protege os dados: exija autenticação no provedor e políticas RLS no banco.
- `SUPABASE_SERVICE_ROLE_KEY` e `RESEND_API_KEY` são somente de servidor; nunca use `VITE_` nessas variáveis.
- Valide os dados do formulário também na função de servidor.
- Não faça envios reais de contato durante testes sem autorização e configuração de um ambiente de teste.
- Não declare e-mail, deploy ou pontuação Lighthouse comprovados sem evidência.
