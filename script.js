/* =========================================
   Ayesha Bashir – Portfolio Scripts
   ========================================= */

// Tells the CSS that JavaScript is running (used by the scroll animations)
document.documentElement.classList.add("js");

/* ---------- 1. Mobile navigation toggle ---------- */
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", isOpen);
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

// Close the mobile menu after a link is clicked
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  });
});

/* ---------- 2. Dark / light mode toggle ---------- */
const themeToggle = document.getElementById("theme-toggle");

// Apply a theme and update the button label
function setTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
}

// Load the saved theme (localStorage can fail in private mode, so use try/catch)
let savedTheme = null;
try {
  savedTheme = localStorage.getItem("theme");
} catch (error) {
  savedTheme = null;
}
setTheme(savedTheme === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
  setTheme(newTheme);
  try {
    localStorage.setItem("theme", newTheme);
  } catch (error) {
    // Saving failed – the theme still works for this visit
  }
});

/* ---------- 3. Typing effect in the hero ---------- */
const roles = ["Front-End Developer", "Data Analyst", "Problem Solver"];
const typingEl = document.getElementById("typing");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let roleIndex = 0;   // which word we are on
let charIndex = 0;   // how many letters are shown
let deleting = false;

function typeLoop() {
  const currentRole = roles[roleIndex];

  if (deleting) {
    charIndex--;
  } else {
    charIndex++;
  }
  typingEl.textContent = currentRole.slice(0, charIndex);

  let delay = deleting ? 50 : 100;

  if (!deleting && charIndex === currentRole.length) {
    // Full word typed – pause, then start deleting
    delay = 1600;
    deleting = true;
  } else if (deleting && charIndex === 0) {
    // Word deleted – move to the next one
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }

  setTimeout(typeLoop, delay);
}

if (reduceMotion) {
  typingEl.textContent = roles[0]; // no animation, just show the first role
} else {
  typeLoop();
}

/* ---------- 4. Hero chart animation ---------- */
// Adding .loaded lets the CSS transition grow the bars to their height
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

/* ---------- 5. Project filter buttons ---------- */
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    // Highlight the clicked button only
    filterButtons.forEach((btn) => {
      btn.classList.remove("active");
      btn.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");

    // Show cards that match, hide the rest
    projectCards.forEach((card) => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hide", !matches);
    });
  });
});

/* ---------- 6. Contact form validation ---------- */
const form = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Show or clear an error message under a field
function setError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + "-error");
  errorEl.textContent = message;
  input.parentElement.classList.toggle("invalid", message !== "");
  input.setAttribute("aria-invalid", message !== "");
}

function validateForm() {
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();
  let isValid = true;

  if (name === "") {
    setError("name", "Enter your name.");
    isValid = false;
  } else {
    setError("name", "");
  }

  if (email === "") {
    setError("email", "Enter your email address.");
    isValid = false;
  } else if (!emailPattern.test(email)) {
    setError("email", "Enter an email like name@example.com.");
    isValid = false;
  } else {
    setError("email", "");
  }

  if (message.length < 10) {
    setError("message", "Write a message of at least 10 characters.");
    isValid = false;
  } else {
    setError("message", "");
  }

  return isValid;
}

form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading
  formStatus.textContent = "";

  if (validateForm()) {
    const firstName = form.elements.name.value.trim().split(" ")[0];
    formStatus.textContent = `Thanks, ${firstName}! Your message has been sent.`;
    form.reset();
  } else {
    // Move focus to the first field with an error
    form.querySelector(".invalid input, .invalid textarea").focus();
  }
});

/* ---------- 7. Highlight the nav link for the section on screen ---------- */
const sections = document.querySelectorAll("main section[id]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.querySelectorAll("a").forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      }
    });
  },
  { rootMargin: "-50% 0px -50% 0px" }
);

sections.forEach((section) => observer.observe(section));

/* ---------- 8. Reveal sections and fill skill bars on scroll ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add(entry.target.id === "skills" ? "in-view" : "visible");
        revealObserver.unobserve(entry.target); // animate only once
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
revealObserver.observe(document.getElementById("skills"));

/* ---------- 9. Header shadow & back-to-top button ---------- */
const header = document.getElementById("site-header");
const backToTop = document.getElementById("back-to-top");

function onScroll() {
  header.classList.toggle("scrolled", window.scrollY > 10);
  backToTop.classList.toggle("show", window.scrollY > 600);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- 10. Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
