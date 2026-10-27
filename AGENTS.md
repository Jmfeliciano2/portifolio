# Instruções do projeto para IA — CP3 FIAP

Objetivo: migrar o portfólio existente de João Matheus para React sem abandonar sua identidade visual.

## Nível e tecnologias
- Segundo semestre de Engenharia de Software. Priorizar JSX, componentes, props, useState, useEffect, fetch, async/await e try/catch.
- React + Vite, React Router, CSS puro e componentes reutilizáveis.
- APIs e lógica devem ficar fora dos componentes visuais, em services/ e hooks/.
- Manter a identidade atual: fundo escuro, textos claros, acento laranja e logo JM.

## Convenções
- Componentes e páginas: PascalCase, ex.: ProjectCard.jsx.
- Hooks: começam com use, ex.: useProjects.js.
- Funções e variáveis: camelCase.
- Branch por funcionalidade: feature/rotas, feature/github, feature/contato, feature/dashboard.
- Commits Conventional Commits: feat:, fix:, docs:, refactor:, test:, chore:.
- Não enviar .env, senhas, tokens ou chaves secretas para o GitHub.
- Executar lint, testes, build e revisar manualmente antes de integrar à main.
- Nunca afirmar que métricas Lighthouse ou e-mails funcionam sem testar.

## Harness
Ferramenta usada nesta etapa: ChatGPT, modelo GPT-6, com conector GitHub.
Instruções versionadas: este AGENTS.md.
O conector GitHub foi usado para ler os arquivos, criar a branch feature/cp3-react, criar commits e abrir o Pull Request.
Codex é uma opção para edições futuras, mas não deve ser apresentado como usado sem realmente utilizá-lo.
Não foram configurados agentes auxiliares ou skills específicas de codificação neste repositório.
O estudante deve revisar, entender e conseguir explicar cada alteração gerada pela IA.

## Segurança
Proteção de rota React sozinha não protege dados. Exigir autenticação no provedor e regras do banco (RLS).
A chave service_role não pode aparecer no frontend nem em variáveis VITE_.
Mensagens do formulário exigem validação também no servidor.
