/* ============================================================
   AHMED ADEL — PORTFOLIO SCRIPT
   Features: Custom cursor, typing animation, navbar scroll,
   skill bar animation, scroll reveal, project filter,
   contact form, back-to-top, year update.
============================================================ */

"use strict";

/* ── DOM REFERENCES ─────────────────────────────────────── */
const cursor         = document.getElementById("cursor");
const cursorFollower = document.getElementById("cursorFollower");
const navbar         = document.getElementById("navbar");
const hamburger      = document.getElementById("hamburger");
const navLinks       = document.getElementById("navLinks");
const typedTextEl    = document.getElementById("typedText");
const filterBtns     = document.querySelectorAll(".filter-btn");
const projectCards   = document.querySelectorAll(".project-card");
const skillFills     = document.querySelectorAll(".skill-fill");
const revealEls      = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");
const contactForm    = document.getElementById("contactForm");
const formSuccess    = document.getElementById("formSuccess");
const backToTop      = document.getElementById("backToTop");
const yearEl         = document.getElementById("year");

/* ── YEAR ────────────────────────────────────────────────── */
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── CUSTOM CURSOR ───────────────────────────────────────── */
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Dot follows instantly
  cursor.style.left = mouseX + "px";
  cursor.style.top  = mouseY + "px";
});

// Follower ring uses lerp for smoothness
function animateCursor() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;

  cursorFollower.style.left = followerX + "px";
  cursorFollower.style.top  = followerY + "px";

  requestAnimationFrame(animateCursor);
}
animateCursor();

// Expand cursor on interactive elements
const interactiveEls = document.querySelectorAll("a, button, input, textarea, .filter-btn, .skill-icon-item");
interactiveEls.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(2)";
    cursorFollower.style.transform = "translate(-50%, -50%) scale(1.5)";
    cursorFollower.style.borderColor = "rgba(0, 255, 163, 0.8)";
  });
  el.addEventListener("mouseleave", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1)";
    cursorFollower.style.transform = "translate(-50%, -50%) scale(1)";
    cursorFollower.style.borderColor = "rgba(0, 255, 163, 0.5)";
  });
});

/* ── TYPING ANIMATION ────────────────────────────────────── */
const phrases = [
  "Frontend Developer",
  "Cybersecurity Enthusiast",
  "UI/UX Designer",
  "Problem Solver",
  "Security-Aware Coder",
];

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
let typingTimer = null;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    // Remove one char
    typedTextEl.textContent = currentPhrase.slice(0, --charIndex);
  } else {
    // Add one char
    typedTextEl.textContent = currentPhrase.slice(0, ++charIndex);
  }

  let delay = isDeleting ? 60 : 110;

  if (!isDeleting && charIndex === currentPhrase.length) {
    // Pause at end of word
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Move to next phrase
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  typingTimer = setTimeout(typeEffect, delay);
}

// Start typing after a brief delay
setTimeout(typeEffect, 800);

/* ── NAVBAR: SCROLL EFFECT ───────────────────────────────── */
function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

/* ── HAMBURGER MENU ──────────────────────────────────────── */
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("open");
  document.body.style.overflow = navLinks.classList.contains("open") ? "hidden" : "";
});

// Close nav when a link is clicked
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("open");
    document.body.style.overflow = "";
  });
});

/* ── BACK TO TOP ─────────────────────────────────────────── */
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function handleBackToTop() {
  if (window.scrollY > 500) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
}

/* ── SCROLL REVEAL ───────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Keep observing (don't unobserve) so re-entering re-animates
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

revealEls.forEach((el) => revealObserver.observe(el));

/* ── SKILL BARS ANIMATION ────────────────────────────────── */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger each fill bar slightly
        skillFills.forEach((fill, i) => {
          setTimeout(() => fill.classList.add("animated"), i * 80);
        });
        skillObserver.disconnect(); // Only animate once
      }
    });
  },
  { threshold: 0.3 }
);

const skillsSection = document.getElementById("skills");
if (skillsSection) skillObserver.observe(skillsSection);

/* ── PROJECT FILTER ──────────────────────────────────────── */
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Update active button
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    projectCards.forEach((card) => {
      if (filter === "all" || card.dataset.category === filter) {
        // Show: remove hidden and fade in
        card.classList.remove("hidden");
        card.style.animation = "none";
        card.offsetHeight; // reflow
        card.style.animation = "fadeInUp 0.4s ease forwards";
      } else {
        // Hide with fade out
        card.style.animation = "fadeOutDown 0.3s ease forwards";
        setTimeout(() => card.classList.add("hidden"), 280);
      }
    });
  });
});

// Inject filter keyframes dynamically
const filterStyle = document.createElement("style");
filterStyle.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeOutDown {
    from { opacity: 1; transform: translateY(0); }
    to   { opacity: 0; transform: translateY(20px); }
  }
`;
document.head.appendChild(filterStyle);

/* ── CONTACT FORM ────────────────────────────────────────── */
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name    = contactForm.name.value.trim();
    const email   = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    // Basic validation
    if (!name || !email || !message) {
      shakeForm(contactForm);
      return;
    }
    if (!isValidEmail(email)) {
      shakeForm(contactForm.email);
      return;
    }

    // Simulate submission (no real backend)
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.textContent = "Sending…";
    submitBtn.disabled = true;

    setTimeout(() => {
      formSuccess.classList.add("visible");
      contactForm.reset();
      submitBtn.innerHTML = '<i class="ri-send-plane-line"></i> Send Message';
      submitBtn.disabled = false;

      // Hide success message after 5 seconds
      setTimeout(() => formSuccess.classList.remove("visible"), 5000);
    }, 1200);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeForm(el) {
  el.style.animation = "shake 0.4s ease";
  el.addEventListener("animationend", () => (el.style.animation = ""), { once: true });
}

// Shake keyframe
const shakeStyle = document.createElement("style");
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX(8px); }
    60%      { transform: translateX(-5px); }
    80%      { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);

/* ── MAIN SCROLL HANDLER ─────────────────────────────────── */
window.addEventListener("scroll", () => {
  handleNavbarScroll();
  handleBackToTop();
}, { passive: true });

// Run once on load
handleNavbarScroll();
handleBackToTop();

/* ── SMOOTH ANCHOR SCROLL ────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top: targetTop, behavior: "smooth" });
  });
});

/* ── ACTIVE NAV LINK HIGHLIGHT ON SCROLL ────────────────── */
const sections = document.querySelectorAll("section[id]");

function highlightActiveNav() {
  const scrollPos = window.scrollY + navbar.offsetHeight + 100;

  sections.forEach((section) => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute("id");
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);

    if (link) {
      if (scrollPos >= top && scrollPos < bottom) {
        link.style.color = "var(--accent)";
      } else {
        link.style.color = "";
      }
    }
  });
}

window.addEventListener("scroll", highlightActiveNav, { passive: true });

/* ── PARALLAX: HERO ORBS ─────────────────────────────────── */
const orb1 = document.querySelector(".orb-1");
const orb2 = document.querySelector(".orb-2");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  if (orb1) orb1.style.transform = `translateY(${scrollY * 0.15}px)`;
  if (orb2) orb2.style.transform = `translateY(${-scrollY * 0.1}px)`;
}, { passive: true });

/* ── HERO CODE CARD TILT ─────────────────────────────────── */
const codeCard = document.querySelector(".hero-code-card");

if (codeCard) {
  codeCard.addEventListener("mousemove", (e) => {
    const rect = codeCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    codeCard.style.transform = `
      translateY(-50%)
      perspective(800px)
      rotateY(${x * 10}deg)
      rotateX(${-y * 8}deg)
      scale(1.02)
    `;
  });
  codeCard.addEventListener("mouseleave", () => {
    codeCard.style.transform = "translateY(-50%)";
  });
}

/* ── SERVICE CARD GLOWING HOVER ──────────────────────────── */
document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  });
});

/* Append glow style for service cards */
const cardGlowStyle = document.createElement("style");
cardGlowStyle.textContent = `
  .service-card::after {
    content: '';
    position: absolute;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(0,255,163,0.06), transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    left: var(--mouse-x, -200px);
    top: var(--mouse-y, -200px);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    opacity: 0;
  }
  .service-card:hover::after { opacity: 1; }
`;
document.head.appendChild(cardGlowStyle);

/* ── CONSOLE EASTER EGG ──────────────────────────────────── */
console.log(
  "%c< Ahmed Adel />",
  "color: #00ffa3; font-size: 18px; font-weight: bold; font-family: JetBrains Mono, monospace;"
);
console.log(
  "%cFrontend Developer | Cybersecurity Enthusiast\n\nLooking for a talented dev? Let's connect! 📩",
  "color: #7a8a9a; font-family: monospace;"
);
