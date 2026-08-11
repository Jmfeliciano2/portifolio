
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initTypingEffect();
  initScrollReveal();
  initBackToTop();
  initParticles();
});


function initNavbar() {
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  const handleScroll = () => {
    navbar.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.classList.toggle("is-active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll(".navbar__link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.classList.remove("is-active");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initTypingEffect() {
  const target = document.getElementById("typing-text");
  if (!target) return;

  const phrases = [
    "Desenvolvedor Frontend",
    "Estudante de Tecnologia",
    "Sempre Aprendendo",
  ];

  const TYPING_SPEED = 90;
  const DELETING_SPEED = 45;
  const PAUSE_AFTER_TYPING = 1800;
  const PAUSE_AFTER_DELETING = 400;

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


function initScrollReveal() {
  const fadeElements = document.querySelectorAll(".fade-in");
  const skillBars = document.querySelectorAll(".skill-card__bar-fill");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        const bar = entry.target.querySelector(".skill-card__bar-fill");
        if (bar) animateBar(bar);

        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  fadeElements.forEach((el) => observer.observe(el));

  skillBars.forEach((bar) => {
    if (!bar.closest(".fade-in")) {
      const barObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateBar(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      barObserver.observe(bar);
    }
  });
}

function animateBar(bar) {
  const progress = bar.getAttribute("data-progress") || "0";
  requestAnimationFrame(() => {
    bar.style.width = `${progress}%`;
  });
}

/* ------------------------------------------------------------
   4. BOTÃO "VOLTAR AO TOPO"
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

function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let width, height;
  let animationId;

  const PARTICLE_COLOR = "rgba(140, 150, 255, 0.55)";
  const LINE_COLOR = "rgba(140, 150, 255,";
  const MAX_DISTANCE = 130;
  const SPEED = 0.25;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const count = Math.min(90, Math.floor((width * height) / 16000));
    particles = Array.from({ length: count }, createParticle);
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      radius: Math.random() * 1.6 + 0.6,
    };
  }

  function update() {
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < MAX_DISTANCE) {
          const opacity = 1 - distance / MAX_DISTANCE;
          ctx.strokeStyle = `${LINE_COLOR} ${opacity * 0.25})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    ctx.fillStyle = PARTICLE_COLOR;
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function loop() {
    update();
    draw();
    animationId = requestAnimationFrame(loop);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      loop();
    }
  });

  window.addEventListener("resize", resize);

  resize();
  loop();
}