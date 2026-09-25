document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (toggle && mobileNav) {
    const setMenuOpen = (open) => {
      mobileNav.classList.toggle('is-open', open);
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };
    toggle.addEventListener('click', () => {
      setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    });
  }

  // O conteúdo fica visível por padrão, inclusive se o JavaScript não carregar.
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    try {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove('reveal-pending');
          obs.unobserve(entry.target);
        });
      }, { threshold: 0 });
      items.forEach((item) => {
        // Só anima os elementos que ainda estão abaixo da área visível.
        if (item.getBoundingClientRect().top >= window.innerHeight) {
          item.classList.add('reveal-pending');
          observer.observe(item);
        }
      });
    } catch (error) {
      items.forEach((item) => item.classList.remove('reveal-pending'));
      console.error('Erro ao iniciar animações:', error);
    }
  }

  carregarVisitas();

  const form = document.getElementById('form-contato');
  const status = document.getElementById('resposta-contato');
  if (!form || !status) return;
  const button = form.querySelector('button[type="submit"]');
  let sending = false;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    const payload = {
      nome: form.elements.namedItem('nome').value.trim(),
      email: form.elements.namedItem('email').value.trim(),
      mensagem: form.elements.namedItem('mensagem').value.trim()
    };
    if (Object.values(payload).some((value) => !value)) {
      status.textContent = 'Por favor, preencha todos os campos.';
      return;
    }

    sending = true;
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    status.textContent = 'Enviando mensagem...';
    try {
      const response = await fetch('/api/mensagens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao enviar mensagem.');
      status.textContent = data.message || 'Mensagem enviada com sucesso!';
      form.reset();
    } catch (error) {
      status.textContent = error instanceof TypeError || error instanceof SyntaxError
        ? 'Não foi possível conectar ao servidor. Tente novamente pelo site em http://localhost:3000.'
        : error.message;
    } finally {
      sending = false;
      button.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
});

async function carregarVisitas() {
  const counter = document.getElementById('contador-visitas');
  if (!counter) return;
  try {
    const registration = await fetch('/api/visita', { cache: 'no-store' });
    if (!registration.ok) throw new Error('Erro ao registrar visita.');
    const response = await fetch('/api/visitas', { cache: 'no-store' });
    if (!response.ok) throw new Error('Erro ao consultar visitas.');
    const data = await response.json();
    counter.textContent = data.totalVisitas;
  } catch (error) {
    counter.textContent = '—';
    console.error('Erro ao carregar visitas:', error);
  }
}
