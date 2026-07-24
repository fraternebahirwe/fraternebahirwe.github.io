// --- GESTION DU THÈME (SOMBRE / CLAIR) ---
const themeBtn = document.querySelector(".theme-btn");
const themeIcon = document.querySelector("#theme-icon");
const savedTheme = localStorage.getItem("theme");

// Application initiale du thème sauvegardé
if (savedTheme === "light") {
  document.body.classList.add("light-mode");
  if (themeIcon) themeIcon.src = "img/moon.png";
} else {
  document.body.classList.remove("light-mode");
  if (themeIcon) themeIcon.src = "img/sun.png";
}

// Bascule au clic sur le bouton
if (themeBtn && themeIcon) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
      themeIcon.src = "img/moon.png";
      localStorage.setItem("theme", "light");
    } else {
      themeIcon.src = "img/sun.png";
      localStorage.setItem("theme", "dark");
    }
  });
}

// --- GESTION DES LIENS DE NAVIGATION (ACTIVE STATE & SCROLL-SPY) ---
const navLinkElements = document.querySelectorAll(".nav-links a, .nav-link");
const sections = document.querySelectorAll("section[id]");

// Mise à jour de la classe active au clic
navLinkElements.forEach(link => {
  link.addEventListener("click", function () {
    navLinkElements.forEach(l => l.classList.remove("active"));
    this.classList.add("active");
  });
});

// Détection de la section active lors du défilement (Scroll-Spy)
window.addEventListener("scroll", () => {
  let currentSectionId = "";
  const scrollPosition = window.scrollY + 120; // Décalage pour le header fixe

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSectionId = section.getAttribute("id");
    }
  });

  if (currentSectionId) {
    navLinkElements.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active");
      }
    });
  }
});

// --- GESTION DU MENU BURGER & DRAWER MOBILE ---
const burgerBtn = document.querySelector(".burger-btn");
const navLinks = document.querySelector(".nav-links");
const allLinks = document.querySelectorAll(".nav-links a");

if (burgerBtn && navLinks) {
  // Ouverture / Fermeture manuelle
  burgerBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    burgerBtn.textContent = navLinks.classList.contains("active") ? "×" : "☰";
  });

  // Fermeture automatique lors du clic sur un lien du menu
  allLinks.forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      burgerBtn.textContent = "☰";
    });
  });
}

// --- FILTRES DE PROJETS ---
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    // 1. Réinitialisation des classes et attributs ARIA
    filterBtns.forEach(button => {
      button.classList.remove("active");
      button.setAttribute("aria-selected", "false");
    });

    // 2. Activation du bouton cliqué
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");

    const category = btn.textContent.trim().toLowerCase();

    // 3. Filtrage tolérant / inclusif des cartes
    projectCards.forEach(card => {
      const cardCategory = card.dataset.category ? card.dataset.category.toLowerCase() : "";

      if (category === "all" || cardCategory.includes(category)) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// --- VALIDATION & ENVOI DU FORMULAIRE DE CONTACT ---
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  // Marque le formulaire pour afficher les styles CSS d'erreur au premier essai invalide
  form.addEventListener("invalid", () => { form.classList.add("submitted"); }, true);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.classList.add("submitted");

    if (!form.checkValidity()) return;

    const successMessage = document.getElementById("form-success");
    const data = new FormData(form);

    fetch(form.action, {
      method: "POST",
      body: data,
      headers: { "Accept": "application/json" }
    })
    .then(response => {
      if (response.ok) {
        if (successMessage) successMessage.style.display = "block";
        form.reset();
        form.classList.remove("submitted");
      } else {
        alert("Une erreur est survenue, veuillez réessayer.");
      }
    })
    .catch(() => {
      alert("Erreur de connexion. Veuillez réessayer.");
    });
  });
});

// --- EFFET D'AUTO-COMPLÉTION (TYPING EFFECT) ---
const words = ["HTML, CSS & JS responsive web sites.", "JavaScript apps.", "clean UI."];
const elem = document.getElementById("changing-text");
let word = 0, char = 0, del = false;

if (elem) {
  (function type() {
    const cur = words[word];
    char += del ? -1 : 1;
    elem.textContent = cur.substring(0, char);

    let speed = del ? 50 : 100;

    if (!del && char === cur.length) { 
      speed = 2000; 
      del = true; 
    } else if (del && char === 0) { 
      del = false; 
      word = (word + 1) % words.length; 
      speed = 400; 
    }

    setTimeout(type, speed);
  })();
}