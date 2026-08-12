/* ============================================================
   PORTFÓLIO — SCRIPT.JS
   Índice:
   1. Menu mobile (drawer)
   2. Scrollspy — marca seção ativa na sidebar e na tab bar
   3. Efeito de digitação no "papel" do hero
   4. Fade-in ao rolar
   5. Barras de habilidade estilo terminal ([■■■□□] 60%)
   6. Botão "voltar ao topo"
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initDrawer();
  initScrollSpy();
  initTypingEffect();
  initScrollReveal();
  initSkillBars();
  initBackToTop();
});

/* ------------------------------------------------------------
   1. MENU MOBILE (DRAWER)
------------------------------------------------------------ */
function initDrawer() {
  const sidebar = document.getElementById("sidebar");
  const toggle = document.getElementById("drawerToggle");
  const closeBtn = document.getElementById("drawerClose");
  const overlay = document.getElementById("drawerOverlay");

  function openDrawer() {
    sidebar.classList.add("is-open");
    overlay.classList.add("is-visible");
    toggle.setAttribute("aria-expanded", "true");
  }

  function closeDrawer() {
    sidebar.classList.remove("is-open");
    overlay.classList.remove("is-visible");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", openDrawer);
  closeBtn.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);

  // Fecha o menu ao navegar para uma seção (útil no mobile)
  sidebar.querySelectorAll(".tree-item").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });
}

/* ------------------------------------------------------------
   2. SCROLLSPY — sincroniza sidebar + tab bar com a seção visível
------------------------------------------------------------ */
function initScrollSpy() {
  const sections = document.querySelectorAll(".panel[id]");
  const treeItems = document.querySelectorAll(".tree-item");
  const tabs = document.querySelectorAll(".tab");

  if (!sections.length) return;

  const setActive = (id) => {
    treeItems.forEach((item) => {
      item.classList.toggle("is-active", item.dataset.target === id);
    });
    tabs.forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.target === id);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ------------------------------------------------------------
   3. EFEITO DE DIGITAÇÃO — valor de "papel" no objeto do hero
------------------------------------------------------------ */
function initTypingEffect() {
  const target = document.getElementById("typingRole");
  if (!target) return;

  const phrases = [
    "Desenvolvedor Frontend",
    "Estudante na FIAP",
    "Sempre Aprendendo",
  ];

  const TYPING_SPEED = 85;
  const DELETING_SPEED = 40;
  const PAUSE_AFTER_TYPING = 1700;
  const PAUSE_AFTER_DELETING = 350;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      charIndex++;
      target.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(tick, PAUSE_AFTER_TYPING);
        return;
      }
      setTimeout(tick, TYPING_SPEED);
    } else {
      charIndex--;
      target.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, PAUSE_AFTER_DELETING);
        return;
      }
      setTimeout(tick, DELETING_SPEED);
    }
  }

  tick();
}

/* ------------------------------------------------------------
   4. FADE-IN AO ROLAR
------------------------------------------------------------ */
function initScrollReveal() {
  const fadeElements = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  fadeElements.forEach((el) => observer.observe(el));
}

/* ------------------------------------------------------------
   5. BARRAS DE HABILIDADE ESTILO TERMINAL
   Renderiza algo como: [■■■■■■■□□□] 70%
   e anima a contagem quando o card entra na tela.
------------------------------------------------------------ */
function initSkillBars() {
  const bars = document.querySelectorAll(".skill-rule__bar[data-progress]");
  if (!bars.length) return;

  const TOTAL_SEGMENTS = 10;
  const DURATION = 900; // ms

  function renderBar(valueEl, progress) {
    const filled = Math.round((progress / 100) * TOTAL_SEGMENTS);
    const empty = TOTAL_SEGMENTS - filled;
    valueEl.textContent = `[${"■".repeat(filled)}${"□".repeat(empty)}] ${progress}%`;
  }

  function animateBar(bar) {
    const target = Number(bar.getAttribute("data-progress")) || 0;
    const valueEl = bar.querySelector("[data-bar]");
    if (!valueEl) return;

    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / DURATION);
      const current = Math.round(progress * target);
      renderBar(valueEl, current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateBar(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  bars.forEach((bar) => {
    // Estado inicial (antes de animar) para quem tem JS desativado ou aguarda o scroll
    const valueEl = bar.querySelector("[data-bar]");
    if (valueEl) renderBar(valueEl, 0);
    observer.observe(bar);
  });
}

/* ------------------------------------------------------------
   6. BOTÃO "VOLTAR AO TOPO"
------------------------------------------------------------ */
function initBackToTop() {
  const button = document.getElementById("backToTop");
  if (!button) return;

  window.addEventListener(
    "scroll",
    () => {
      button.classList.toggle("is-visible", window.scrollY > 500);
    },
    { passive: true }
  );

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
