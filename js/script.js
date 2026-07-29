// ================= ЯЗЫК =================
const langBtn = document.getElementById("langBtn");
let currentLang = localStorage.getItem("lang") || "ru";

function setLanguage(lang) {
  // Текстовые элементы — но пропускаем те, у кого есть дочерние элементы
  document.querySelectorAll("[data-ru]").forEach((el) => {
    // Если внутри есть дочерние теги (например span) — не трогаем textContent
    if (el.children.length === 0) {
      el.textContent = el.dataset[lang];
    }
  });

  // Плейсхолдеры input/textarea
  document.querySelectorAll("[data-placeholder-ru]").forEach((el) => {
    const key = `placeholder${lang.charAt(0).toUpperCase() + lang.slice(1)}`;
    el.placeholder = el.dataset[key];
  });

  // Кнопка submit внутри формы (span внутри button)
  document.querySelectorAll("button[type='submit'] span[data-ru]").forEach((el) => {
    el.textContent = el.dataset[lang];
  });

  langBtn.textContent = lang.toUpperCase();
  localStorage.setItem("lang", lang);
  currentLang = lang;
}

langBtn.addEventListener("click", () => {
  currentLang = currentLang === "ru" ? "uz" : "ru";
  setLanguage(currentLang);
});

setLanguage(currentLang);

// ================= ТЕМА =================
const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");

let currentTheme = localStorage.getItem("theme") || "dark";

function setTheme(theme) {
  document.body.classList.toggle("light", theme === "light");

  themeIcon.src =
    theme === "light" ? "./assets/icons/moon.svg" : "./assets/icons/sun.svg";

  localStorage.setItem("theme", theme);
}

themeBtn.addEventListener("click", () => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";

  setTheme(currentTheme);
});

setTheme(currentTheme);

// ======================== Background =============================
const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");
 
function getConfig() {
  const w = window.innerWidth;
  if (w <= 360) return { count: 60, dist: 80,  radius: 1.2 };
  if (w <= 480) return { count: 80, dist: 90,  radius: 1.4 };
  if (w <= 768) return { count: 120, dist: 100, radius: 1.6 };
  if (w <= 1024) return { count: 180, dist: 110, radius: 1.8 };
  return              { count: 200, dist: 120, radius: 2   };
}
 
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
 
resizeCanvas();
 
let points = [];
let config = getConfig();
 
function initPoints() {
  config = getConfig();
  points = [];
  for (let i = 0; i < config.count; i++) {
    points.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      dx: (Math.random() - 0.5) * 0.7,
      dy: (Math.random() - 0.5) * 0.7,
    });
  }
}
 
initPoints();
 
let resizeTimer;
window.addEventListener("resize", () => {
  resizeCanvas();
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(initPoints, 200);
});
 
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
 
  points.forEach((p) => {
    p.x += p.dx;
    p.y += p.dy;
 
    if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
 
    ctx.fillStyle = "rgba(34, 211, 238, 0.6)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, config.radius, 0, Math.PI * 2);
    ctx.fill();
  });
 
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dist = Math.hypot(
        points[i].x - points[j].x,
        points[i].y - points[j].y,
      );
      if (dist < config.dist) {
        ctx.strokeStyle = "rgba(99, 102, 241, 0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.stroke();
      }
    }
  }
 
  requestAnimationFrame(draw);
}
 
draw();

// ================= HEADER =================
const header = document.querySelector(".header");
let ticking = false;
let isScrolled = false;

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const shouldBeScrolled = window.scrollY > 60;
      if (shouldBeScrolled !== isScrolled) {
        isScrolled = shouldBeScrolled;
        header.classList.toggle("scrolled", isScrolled);
      }
      ticking = false;
    });
    ticking = true;
  }
});

// ================= АКТИВНАЯ СЕКЦИЯ В NAV =================
const navSections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav a");

window.addEventListener("scroll", () => {
  let current = "";

  navSections.forEach((section) => {
    const sectionTop = section.offsetTop - 80;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

// ================= NAV SCROLL INDICATORS =================
const navEl = document.querySelector(".nav");
const navWrapper = document.querySelector(".nav-wrapper");

function updateNavScrollIndicators() {
  if (!navEl || !navWrapper) return;
  const { scrollLeft, scrollWidth, clientWidth } = navEl;
  navWrapper.classList.toggle("can-scroll-left", scrollLeft > 2);
  navWrapper.classList.toggle(
    "can-scroll-right",
    scrollLeft < scrollWidth - clientWidth - 2,
  );
}

if (navEl) {
  navEl.addEventListener("scroll", updateNavScrollIndicators, {
    passive: true,
  });
  window.addEventListener("resize", updateNavScrollIndicators);
  updateNavScrollIndicators();
}

// ================= АВТО-ЦЕНТРИРОВАНИЕ АКТИВНОЙ ССЫЛКИ =================
function scrollActiveNavIntoView() {
  const activeLink = document.querySelector(".nav a.active");
  if (activeLink && navEl) {
    const target =
      activeLink.offsetLeft -
      navEl.clientWidth / 2 +
      activeLink.offsetWidth / 2;
    navEl.scrollTo({ left: target, behavior: "smooth" });
  }
}

window.addEventListener(
  "scroll",
  () => {
    setTimeout(scrollActiveNavIntoView, 50);
  },
  { passive: true },
);

// ============ TERMINAL TYPEWRITER ============
const lines = [
  { tokens: [{ c: "cmt", t: "// NexCode — production build" }] },
  { tokens: [] }, // empty line
  {
    tokens: [
      { c: "kw", t: "import" },
      { c: "plain", t: " { createApp } " },
      { c: "kw", t: "from" },
      { c: "str", t: ' "nexcode/core"' },
    ],
  },
  {
    tokens: [
      { c: "kw", t: "import" },
      { c: "plain", t: " { deploy }  " },
      { c: "kw", t: "from" },
      { c: "str", t: ' "nexcode/deploy"' },
    ],
  },
  { tokens: [] },
  {
    tokens: [
      { c: "kw", t: "const" },
      { c: "plain", t: " app = " },
      { c: "fn", t: "createApp" },
      { c: "plain", t: "({" },
    ],
  },
  {
    tokens: [
      { c: "plain", t: "  " },
      { c: "prop", t: "name" },
      { c: "plain", t: ":    " },
      { c: "str", t: '"NexCode"' },
      { c: "plain", t: "," },
    ],
  },
  {
    tokens: [
      { c: "plain", t: "  " },
      { c: "prop", t: "version" },
      { c: "plain", t: ": " },
      { c: "str", t: '"2.4.1"' },
      { c: "plain", t: "," },
    ],
  },
  {
    tokens: [
      { c: "plain", t: "  " },
      { c: "prop", t: "pages" },
      { c: "plain", t: ":   " },
      { c: "num", t: "12" },
      { c: "plain", t: "," },
    ],
  },
  {
    tokens: [
      { c: "plain", t: "  " },
      { c: "prop", t: "features" },
      { c: "plain", t: ": " },
      { c: "num", t: "48" },
      { c: "plain", t: "," },
    ],
  },
  { tokens: [{ c: "plain", t: "})" }] },
  { tokens: [] },
  {
    tokens: [
      { c: "kw", t: "await" },
      { c: "plain", t: " " },
      { c: "fn", t: "deploy" },
      { c: "plain", t: "(app, {" },
    ],
  },
  {
    tokens: [
      { c: "plain", t: "  " },
      { c: "prop", t: "env" },
      { c: "plain", t: ":    " },
      { c: "str", t: '"production"' },
      { c: "plain", t: "," },
    ],
  },
  {
    tokens: [
      { c: "plain", t: "  " },
      { c: "prop", t: "region" },
      { c: "plain", t: ": " },
      { c: "str", t: '"uz-tashkent"' },
      { c: "plain", t: "," },
    ],
  },
  { tokens: [{ c: "plain", t: "})" }] },
  { tokens: [] },
  { tokens: [{ c: "ok", t: "// ✓ Build complete" }] },
  { tokens: [{ c: "ok", t: "// ✓ Deployed → nexcode.uz" }] },
  {
    tokens: [
      { c: "dim", t: "$ " },
      { c: "plain", t: "" },
      { c: "cursor", t: "" },
    ],
  },
];

const codeArea = document.getElementById("codeArea");
const gutter = document.getElementById("gutter");

function buildLine(lineData) {
  const div = document.createElement("div");
  div.className = "code-line";
  lineData.tokens.forEach((tok) => {
    if (tok.c === "cursor") {
      const cur = document.createElement("span");
      cur.className = "cursor-blink";
      div.appendChild(cur);
    } else {
      const s = document.createElement("span");
      s.className = tok.c;
      s.textContent = tok.t;
      div.appendChild(s);
    }
  });
  return div;
}

function buildGutterNum(n) {
  const s = document.createElement("span");
  s.textContent = n;
  return s;
}

let animTimeout;

function runAnimation() {
  codeArea.innerHTML = "";
  gutter.innerHTML = "";

  const elems = [];
  lines.forEach((l, i) => {
    const lineEl = buildLine(l);
    codeArea.appendChild(lineEl);
    gutter.appendChild(buildGutterNum(i + 1));
    elems.push(lineEl);
  });

  elems.forEach((el, i) => {
    animTimeout = setTimeout(
      () => {
        el.classList.add("visible");
      },
      120 * i + 300,
    );
  });

  // restart cycle
  animTimeout = setTimeout(
    () => {
      runAnimation();
    },
    120 * lines.length + 3500,
  );
}

runAnimation();

// ================= WORD SWITCHER =================
const words = document.querySelectorAll(".word-switcher .word");
let wordIdx = 0;

setInterval(() => {
  const current = words[wordIdx];

  // Анимация ухода
  current.style.opacity = "0";
  current.style.transform = "translateY(-10px)";

  setTimeout(() => {
    current.classList.remove("active");
    current.style.opacity = "";
    current.style.transform = "";

    wordIdx = (wordIdx + 1) % words.length;

    const next = words[wordIdx];
    next.classList.add("active");
    // Текст ставим по текущему языку
    next.textContent = next.dataset.current || next.textContent;

    requestAnimationFrame(() => {
      next.style.opacity = "1";
      next.style.transform = "translateY(0)";
    });
  }, 400);
}, 2000);

// ================= FAQ LANG =================
const faqData = {
  ru: [
    {
      q: "Сколько времени занимает разработка сайта?",
      a: "Лендинг — от 5 рабочих дней, корпоративный сайт — от 2 недель, сложные веб-приложения — от 4 недель. Точные сроки обсуждаем на этапе брифинга.",
      t: "10:32",
    },

    {
      q: "Сколько стоит разработка сайта под ключ?",
      a: "Лендинг — от $500, корпоративный сайт — от $1 500, интернет-магазин — от $2 500. Для точной оценки нужно обсудить ваш проект — напишите нам!",
      t: "10:34",
    },

    {
      q: "На каких технологиях вы разрабатываете?",
      a: "Мы используем React, Next.js, Vue, Node.js, Python. Для CMS — WordPress, Strapi, Sanity. Выбор стека зависит от ваших задач и бизнес-целей.",
      t: "10:37",
    },

    {
      q: "Есть ли поддержка после запуска сайта?",
      a: "Да! После сдачи проекта — 30 дней бесплатной поддержки. Далее доступны гибкие тарифы сопровождения. Всегда на связи.",
      t: "10:40",
    },

    {
      q: "Сколько правок включено в проект?",
      a: "В каждый проект включено 3 раунда правок. Мелкие корректировки — бесплатно. Крупные изменения обсуждаем отдельно.",
      t: "10:43",
    },
  ],

  uz: [
    {
      q: "Sayt yaratish qancha vaqt oladi?",
      a: "Landing page — 5 ish kunidan, korporativ sayt — 2 haftadan, murakkab web-ilovalar — 4 haftadan boshlanadi.",
      t: "10:32",
    },

    {
      q: "Sayt yaratish narxi qancha?",
      a: "Landing — $500 dan, korporativ sayt — $1500 dan, internet do‘kon — $2500 dan boshlanadi.",
      t: "10:34",
    },

    {
      q: "Qaysi texnologiyalarda ishlaysiz?",
      a: "Biz React, Next.js, Vue, Node.js va Python ishlatamiz. CMS uchun WordPress va Strapi.",
      t: "10:37",
    },

    {
      q: "Sayt ishga tushgandan keyin support bormi?",
      a: "Ha! Loyihadan keyin 30 kun bepul support mavjud. Keyin esa qo‘llab-quvvatlash tariflari mavjud.",
      t: "10:40",
    },

    {
      q: "Loyihaga nechta o‘zgartirish kiradi?",
      a: "Har bir loyihaga 3 ta revision kiritilgan. Kichik o‘zgarishlar bepul amalga oshiriladi.",
      t: "10:43",
    },
  ],
};

// ================= CURRENT FAQ =================
let faqs = faqData[localStorage.getItem("lang") || "ru"];

// ================= ELEMENTS =================
const faqSection = document.querySelector(".faq-section");

const chatBody = document.getElementById("chatBody");

// ================= ICON =================
const ico = `
  <svg viewBox="0 0 24 24">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
  </svg>
`;

// ================= SCROLL =================
const sb = () => {
  chatBody.scrollTop = chatBody.scrollHeight;
};

// ================= APPEND =================
function appendShow(el) {
  chatBody.appendChild(el);

  sb();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.add("show");

      sb();
    });
  });
}

// ================= TYPING =================
function showTyping(side) {
  return new Promise((resolve) => {
    const isRight = side === "right";

    const el = document.createElement("div");

    el.className = "typing-wrap " + side;

    const av = isRight ? ` ` : `<div class="client-av">${ico}</div>`;

    const bc = isRight ? "typing-bubble-ms" : "typing-bubble-client";

    el.innerHTML = `
      ${av}

      <div class="${bc}">
        <div class="td"></div>
        <div class="td"></div>
        <div class="td"></div>
      </div>
    `;

    appendShow(el);

    setTimeout(() => {
      el.classList.remove("show");

      setTimeout(() => {
        el.remove();

        resolve();
      }, 180);
    }, 1400);
  });
}

// ================= MESSAGE =================
function showMessage(side, bubbleClass, avatar, text, time) {
  return new Promise((resolve) => {
    const el = document.createElement("div");

    el.className = "msg-wrap " + side;

    el.innerHTML = `
      ${avatar}

      <div class="msg-col">

        <div class="${bubbleClass}">
          ${text}
        </div>

        <span class="msg-time">
          ${time}
        </span>

      </div>
    `;

    appendShow(el);

    setTimeout(resolve, 350);
  });
}

// ================= SHOW PAIR =================
async function showPair(idx) {
  const { q, a, t } = faqs[idx];

  // typing клиента
  await showTyping("left");

  // вопрос
  await showMessage(
    "left",
    "bubble-client",
    `<div class="client-av">${ico}</div>`,
    q,
    t,
  );

  // пауза
  await new Promise((r) => setTimeout(r, 500));

  // typing ответа
  await showTyping("right");

  // ответ
  await showMessage(
    "right",
    "bubble-answer",
    `<div class="ms-av">NC</div>`,
    a,
    t,
  );
}

// ================= RUN =================
let isFaqRunning = false;

async function runAll() {
  if (isFaqRunning) return;

  isFaqRunning = true;

  chatBody.innerHTML = '<div class="chat-spacer"></div>';

  for (let i = 0; i < faqs.length; i++) {
    await showPair(i);

    if (i < faqs.length - 1) {
      await new Promise((r) => setTimeout(r, 700));
    }
  }

  isFaqRunning = false;
}

// ================= CHANGE LANG =================
function updateFaqLanguage(lang) {
  faqs = faqData[lang];

  if (faqStarted) {
    runAll();
  }
}

// ================= START ON VIEW =================
let faqStarted = false;

const faqObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !faqStarted) {
        faqStarted = true;

        runAll();

        faqObserver.unobserve(faqSection);
      }
    });
  },
  {
    threshold: 0.15,
  },
);

faqObserver.observe(faqSection);

// ================= ФОРМА КОНТАКТОВ =================
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = contactForm.querySelector('input[type="text"]');
    const telInput = contactForm.querySelector('input[type="tel"]');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    if (!nameInput.value.trim() || !telInput.value.trim()) {
      showFormMessage("Пожалуйста, заполните все поля.", "error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Отправляем...";

    // Заглушка — замените на реальный fetch/API
    setTimeout(() => {
      showFormMessage(
        "Спасибо! Мы свяжемся с вами в ближайшее время.",
        "success",
      );
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = "Отправить";
    }, 1000);
  });
}

function showFormMessage(text, type) {
  const msg = document.querySelector(".form-message");
  if (!msg) return;
  msg.textContent = text;
  msg.className = "form-message " + type;
  setTimeout(() => {
    msg.className = "form-message";
  }, 4000);
}

// ================= АНИМАЦИЯ КАРТОЧЕК УСЛУГ =================
const serviceCards = document.querySelectorAll(".service-card");

const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        cardObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 },
);

serviceCards.forEach((card) => cardObserver.observe(card));

// ================= АНИМАЦИЯ СЕКЦИЙ =================
if ("IntersectionObserver" in window) {
  document.documentElement.classList.add("js-observer");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          sectionObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  document.querySelectorAll("section").forEach((section) => {
    sectionObserver.observe(section);
  });
}

// ================= КАРУСЕЛЬ ОТЗЫВОВ =================
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".reviews-track");
  const reviewCards = document.querySelectorAll(".review-card");
  const nextBtn = document.querySelector(".reviews-btn.next");
  const prevBtn = document.querySelector(".reviews-btn.prev");

  if (!track || reviewCards.length === 0 || !nextBtn || !prevBtn) return;

  const gap = 20;
  const visible = 3;
  let sliderIndex = visible;

  const cardsArray = Array.from(reviewCards);

  cardsArray.slice(-visible).forEach((card) => {
    track.prepend(card.cloneNode(true));
  });

  cardsArray.slice(0, visible).forEach((card) => {
    track.appendChild(card.cloneNode(true));
  });

  const allCards = document.querySelectorAll(".review-card");

  function getCardWidth() {
    return allCards[0].offsetWidth + gap;
  }

  function setPosition(animate = true) {
    track.style.transition = animate ? "transform 0.5s ease" : "none";
    track.style.transform = `translateX(-${sliderIndex * getCardWidth()}px)`;
  }

  setPosition(false);

  nextBtn.addEventListener("click", () => {
    sliderIndex++;
    setPosition(true);
    if (sliderIndex >= allCards.length - visible) {
      setTimeout(() => {
        sliderIndex = visible;
        setPosition(false);
      }, 500);
    }
  });

  prevBtn.addEventListener("click", () => {
    sliderIndex--;
    setPosition(true);
    if (sliderIndex < visible) {
      setTimeout(() => {
        sliderIndex = allCards.length - visible * 2;
        setPosition(false);
      }, 500);
    }
  });

  let autoPlay = setInterval(() => nextBtn.click(), 3000);

  track.addEventListener("mouseenter", () => clearInterval(autoPlay));
  track.addEventListener("mouseleave", () => {
    autoPlay = setInterval(() => nextBtn.click(), 3000);
  });

  window.addEventListener("resize", () => setPosition(false));
});


// ================= БУРГЕР-МЕНЮ =================
(function () {
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileNav = document.getElementById("mobileNav");
 
  if (!burgerBtn || !mobileNav) return;
 
  function closeMenu() {
    burgerBtn.classList.remove("open");
    mobileNav.classList.remove("open");
    burgerBtn.setAttribute("aria-expanded", "false");
    mobileNav.setAttribute("aria-hidden", "true");
  }
 
  function openMenu() {
    burgerBtn.classList.add("open");
    mobileNav.classList.add("open");
    burgerBtn.setAttribute("aria-expanded", "true");
    mobileNav.setAttribute("aria-hidden", "false");
  }
 
  burgerBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    mobileNav.classList.contains("open") ? closeMenu() : openMenu();
  });
 
  // Закрыть при клике на пункт меню
  mobileNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });
 
  // Закрыть при клике вне меню
  document.addEventListener("click", function (e) {
    if (!burgerBtn.contains(e.target) && !mobileNav.contains(e.target)) {
      closeMenu();
    }
  });
 
  // Закрыть при скролле
  window.addEventListener("scroll", closeMenu, { passive: true });
 
  // ── Активная ссылка в мобильном меню при скролле ──
  const mobileNavLinks = mobileNav.querySelectorAll("a");
 
  window.addEventListener("scroll", function () {
    let current = "";
    document.querySelectorAll("section[id]").forEach(function (section) {
      if (window.scrollY >= section.offsetTop - 80) {
        current = section.getAttribute("id");
      }
    });
    mobileNavLinks.forEach(function (link) {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  });
 
  // ── Синхронизация языка с мобильным меню ──
  // Патчим setLanguage: после смены языка обновляем [data-ru]/[data-uz]
  // в мобильном меню (они уже там есть, оригинальный setLanguage их охватит
  // автоматически, т.к. querySelector("[data-ru]") — глобальный).
  // Но на случай если мобильное меню добавлено в DOM позже —
  // вызываем setLanguage ещё раз с текущим языком при открытии меню.
  const _originalOpenMenu = openMenu;
  openMenu = function () {
    _originalOpenMenu();
    // Обновляем текст ссылок по текущему языку
    mobileNav.querySelectorAll("[data-ru]").forEach(function (el) {
      if (el.children.length === 0 && el.dataset[currentLang]) {
        el.textContent = el.dataset[currentLang];
      }
    });
  };
 
})(); 