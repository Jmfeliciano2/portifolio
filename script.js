document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");
  const year = document.getElementById("year");

  year.textContent = new Date().getFullYear();

  toggle?.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });

  mobileNav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
    });
  });

  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach(item => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  items.forEach(item => observer.observe(item));
});

async function carregarVisitas() {

  try {

    const resposta = await fetch('/api/visitas');

    const dados = await resposta.json();

    document.getElementById('contador-visitas').textContent =
      dados.visitas;

  } catch (erro) {

    console.error('Erro ao carregar visitas:', erro);

  }

}

carregarVisitas();

const formulario = document.getElementById('form-contato');

if (formulario) {

  formulario.addEventListener('submit', async (evento) => {

    evento.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const mensagem = document.getElementById('mensagem').value;

    const resposta = await fetch('/api/contato', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        nome,
        email,
        mensagem
      })

    });

    const dados = await resposta.json();

    document.getElementById('resposta-contato').textContent =
      dados.mensagem;

    if (resposta.ok) {
      formulario.reset();
    }

  });

}