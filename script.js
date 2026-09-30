document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // ANO AUTOMÁTICO
  // ========================================

  const year = document.getElementById('year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  // ========================================
  // MENU MOBILE
  // ========================================

  const toggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (toggle && mobileNav) {

    const setMenuOpen = (open) => {

      mobileNav.classList.toggle(
        'is-open',
        open
      );

      toggle.classList.toggle(
        'is-open',
        open
      );

      toggle.setAttribute(
        'aria-expanded',
        String(open)
      );

      toggle.setAttribute(
        'aria-label',
        open
          ? 'Fechar menu'
          : 'Abrir menu'
      );

    };


    toggle.addEventListener(
      'click',
      () => {

        const aberto =
          toggle.getAttribute(
            'aria-expanded'
          ) === 'true';

        setMenuOpen(!aberto);

      }
    );


    mobileNav
      .querySelectorAll('a')
      .forEach((link) => {

        link.addEventListener(
          'click',
          () => setMenuOpen(false)
        );

      });


    document.addEventListener(
      'keydown',
      (event) => {

        if (event.key === 'Escape') {
          setMenuOpen(false);
        }

      }
    );

  }


  // ========================================
  // ANIMAÇÕES
  // ========================================

  iniciarAnimacoes();


  // ========================================
  // PROJETOS DA API
  // ========================================

  carregarProjetosAPI();


  // ========================================
  // CONTADOR DE VISITAS
  // ========================================

  carregarVisitas();


  // ========================================
  // FORMULÁRIO DE CONTATO
  // ========================================

  iniciarFormularioContato();

});


// ========================================
// ANIMAÇÕES DE ENTRADA
// ========================================

function iniciarAnimacoes() {

  const items =
    document.querySelectorAll('.reveal');


  if (
    !('IntersectionObserver' in window) ||
    window
      .matchMedia(
        '(prefers-reduced-motion: reduce)'
      )
      .matches
  ) {
    return;
  }


  try {

    const observer =
      new IntersectionObserver(
        (entries, obs) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.remove(
              'reveal-pending'
            );

            obs.unobserve(entry.target);

          });

        },
        {
          threshold: 0
        }
      );


    items.forEach((item) => {

      if (
        item.getBoundingClientRect().top >=
        window.innerHeight
      ) {

        item.classList.add(
          'reveal-pending'
        );

        observer.observe(item);

      }

    });

  } catch (error) {

    items.forEach((item) => {

      item.classList.remove(
        'reveal-pending'
      );

    });

    console.error(
      'Erro ao iniciar animações:',
      error
    );

  }

}


// ========================================
// API DE PROJETOS
// ========================================

async function carregarProjetosAPI() {

  const container =
    document.getElementById(
      'projetos-api'
    );


  if (!container) {
    return;
  }


  try {

    // GET /api/projetos

    const resposta =
      await fetch(
        '/api/projetos',
        {
          cache: 'no-store'
        }
      );


    if (!resposta.ok) {

      throw new Error(
        'Não foi possível carregar os projetos.'
      );

    }


    const projetos =
      await resposta.json();


    container.innerHTML = '';


    // Nenhum projeto cadastrado

    if (
      !Array.isArray(projetos) ||
      projetos.length === 0
    ) {

      container.innerHTML = `
        <p class="projetos-vazio">
          Nenhum projeto cadastrado no momento.
        </p>
      `;

      return;

    }


    // ========================================
    // CRIAR CADA PROJETO
    // ========================================

    projetos.forEach(
      (projeto, index) => {

        criarProjeto(
          projeto,
          index,
          container
        );

      }
    );


    // Os projetos foram adicionados
    // depois do carregamento inicial.
    // Iniciamos animação deles também.

    iniciarAnimacoes();


  } catch (error) {

    console.error(
      'Erro ao carregar projetos:',
      error
    );


    container.innerHTML = `
      <p class="projetos-erro">
        Não foi possível carregar os projetos.
      </p>
    `;

  }

}


// ========================================
// CRIAR CARD/SEÇÃO DE UM PROJETO
// ========================================

function criarProjeto(
  projeto,
  index,
  container
) {

  // 1 vira 01
  // 2 vira 02
  // etc.

  const numero =
    String(index + 1)
      .padStart(2, '0');


  // ========================================
  // ARTICLE
  // ========================================

  const article =
    document.createElement(
      'article'
    );


  article.className =
    index === 0
      ? 'project project--first reveal'
      : 'project reveal';


  // ========================================
  // NÚMERO
  // ========================================

  const numeroProjeto =
    document.createElement(
      'div'
    );


  numeroProjeto.className =
    'project-number';


  numeroProjeto.textContent =
    numero;


  // ========================================
  // CONTEÚDO PRINCIPAL
  // ========================================

  const main =
    document.createElement(
      'div'
    );


  main.className =
    'project-main';


  // Tecnologias

  const meta =
    document.createElement(
      'p'
    );


  meta.className =
    'project-meta';


  meta.textContent =
    projeto.tecnologias ||
    'Projeto de desenvolvimento';


  // Título

  const titulo =
    document.createElement(
      'h3'
    );


  titulo.textContent =
    projeto.titulo ||
    'Projeto';


  // Descrição

  const descricao =
    document.createElement(
      'p'
    );


  descricao.textContent =
    projeto.descricao ||
    'Sem descrição disponível.';


  main.appendChild(meta);

  main.appendChild(titulo);

  main.appendChild(descricao);


  // ========================================
  // LINKS
  // ========================================

  const links =
    document.createElement(
      'div'
    );


  links.className =
    'project-api-links';


  // GitHub

  if (projeto.github_url) {

    const github =
      document.createElement(
        'a'
      );


    github.href =
      projeto.github_url;


    github.target =
      '_blank';


    github.rel =
      'noopener noreferrer';


    github.textContent =
      'Abrir repositório ↗';


    links.appendChild(
      github
    );

  }


  // Demo online

  if (projeto.demo_url) {

    const demo =
      document.createElement(
        'a'
      );


    demo.href =
      projeto.demo_url;


    demo.target =
      '_blank';


    demo.rel =
      'noopener noreferrer';


    demo.textContent =
      'Ver projeto ↗';


    links.appendChild(
      demo
    );

  }


  if (links.children.length > 0) {

    main.appendChild(
      links
    );

  }


  // ========================================
  // LATERAL
  // ========================================

  const aside =
    document.createElement(
      'div'
    );


  aside.className =
    'project-aside';


  const stackTitulo =
    document.createElement(
      'span'
    );


  stackTitulo.textContent =
    'STACK';


  const stackTexto =
    document.createElement(
      'p'
    );


  stackTexto.textContent =
    projeto.tecnologias ||
    'Tecnologias do projeto';


  aside.appendChild(
    stackTitulo
  );


  aside.appendChild(
    stackTexto
  );


  // ========================================
  // MONTAGEM
  // ========================================

  article.appendChild(
    numeroProjeto
  );


  article.appendChild(
    main
  );


  article.appendChild(
    aside
  );


  container.appendChild(
    article
  );

}


// ========================================
// CONTADOR DE VISITAS
// ========================================

async function carregarVisitas() {

  const counter =
    document.getElementById(
      'contador-visitas'
    );


  if (!counter) {
    return;
  }


  try {

    // Registra a visita

    const registration =
      await fetch(
        '/api/visita',
        {
          cache: 'no-store'
        }
      );


    if (!registration.ok) {

      throw new Error(
        'Erro ao registrar visita.'
      );

    }


    // Consulta total

    const response =
      await fetch(
        '/api/visitas',
        {
          cache: 'no-store'
        }
      );


    if (!response.ok) {

      throw new Error(
        'Erro ao consultar visitas.'
      );

    }


    const data =
      await response.json();


    counter.textContent =
      data.totalVisitas ?? 0;


  } catch (error) {

    counter.textContent = '—';


    console.error(
      'Erro ao carregar visitas:',
      error
    );

  }

}


// ========================================
// FORMULÁRIO DE CONTATO
// ========================================

function iniciarFormularioContato() {

  const form =
    document.getElementById(
      'form-contato'
    );


  const status =
    document.getElementById(
      'resposta-contato'
    );


  if (!form || !status) {
    return;
  }


  const button =
    form.querySelector(
      'button[type="submit"]'
    );


  let sending = false;


  form.addEventListener(
    'submit',
    async (event) => {

      event.preventDefault();


      if (
        sending ||
        !form.reportValidity()
      ) {
        return;
      }


      // ========================================
      // DADOS
      // ========================================

      const payload = {

        nome:
          form.elements
            .namedItem('nome')
            .value
            .trim(),

        email:
          form.elements
            .namedItem('email')
            .value
            .trim(),

        mensagem:
          form.elements
            .namedItem('mensagem')
            .value
            .trim()

      };


      if (
        Object
          .values(payload)
          .some(
            (value) => !value
          )
      ) {

        status.textContent =
          'Por favor, preencha todos os campos.';

        return;

      }


      sending = true;

      button.disabled = true;


      form.setAttribute(
        'aria-busy',
        'true'
      );


      status.textContent =
        'Enviando mensagem...';


      try {

        // POST /api/mensagens

        const response =
          await fetch(
            '/api/mensagens',
            {

              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body:
                JSON.stringify(
                  payload
                )

            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.error ||
            'Erro ao enviar mensagem.'
          );

        }


        status.textContent =
          data.message ||
          'Mensagem enviada com sucesso!';


        form.reset();


      } catch (error) {

        if (
          error instanceof TypeError ||
          error instanceof SyntaxError
        ) {

          status.textContent =
            'Não foi possível conectar ao servidor.';

        } else {

          status.textContent =
            error.message;

        }

      } finally {

        sending = false;

        button.disabled = false;

        form.removeAttribute(
          'aria-busy'
        );

      }

    }
  );

}