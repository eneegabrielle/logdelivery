const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navPanel = document.querySelector("[data-nav-panel]");
const backTop = document.querySelector("[data-back-top]");
const heroBg = document.querySelector(".hero-bg");

const setHeaderState = () => {
  const isScrolled = window.scrollY > 24;
  header.classList.toggle("scrolled", isScrolled);
  backTop.classList.toggle("visible", window.scrollY > 620);
  if (heroBg) {
    heroBg.style.setProperty("--parallax", `${Math.min(window.scrollY * 0.18, 110)}px`);
  }
};

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

menuToggle.addEventListener("click", () => {
  const isOpen = navPanel.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});

navPanel.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navPanel.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const counters = new WeakSet();
const animateCounter = (element) => {
  if (counters.has(element)) return;
  counters.add(element);
  const target = Number(element.dataset.counter);
  const duration = 1400;
  const started = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - started) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.floor(target * eased)}+`;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    entry.target.querySelectorAll("[data-counter]").forEach(animateCounter);
    if (entry.target.matches("[data-counter]")) animateCounter(entry.target);
  });
}, { threshold: 0.18 });

document.querySelectorAll(".reveal, [data-counter]").forEach((element) => observer.observe(element));

document.querySelectorAll("details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll("details").forEach((current) => {
      if (current !== detail) current.removeAttribute("open");
    });
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const id = anchor.getAttribute("href");
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
