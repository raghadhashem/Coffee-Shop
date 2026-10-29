/**
 * BREW & BEAN - ABOUT US JAVASCRIPT (about.js)
 *
 * Features:
 * 1. Mobile Menu Toggle & Overlay Management
 * 2. Header Scroll Effect (Sticky & Glassmorphism Blur)
 * 3. Scroll Reveal Animations (IntersectionObserver)
 * 4. Interactive Feature Card Lift & Touch Support
 * 5. Smooth Anchor Scroll Handling
 */

document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------------------------------------------------
  // 1. MOBILE NAVIGATION DRAWER
  // -------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains("active");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    hamburgerBtn.classList.add("active");
    mobileMenu.classList.add("active");
    mobileOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    hamburgerBtn.classList.remove("active");
    mobileMenu.classList.remove("active");
    mobileOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", toggleMenu);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", closeMenu);
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close mobile menu on Escape key
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      mobileMenu &&
      mobileMenu.classList.contains("active")
    ) {
      closeMenu();
    }
  });

  // -------------------------------------------------------------------------
  // 2. HEADER SCROLL EFFECT
  // -------------------------------------------------------------------------
  const header = document.querySelector(".header");

  function checkHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", checkHeaderScroll, { passive: true });
  checkHeaderScroll(); // Initialize on page load

  // -------------------------------------------------------------------------
  // 3. SCROLL REVEAL (INTERSECTION OBSERVER)
  // -------------------------------------------------------------------------
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add("revealed"));
  }

  // -------------------------------------------------------------------------
  // 4. INTERACTIVE 3D TILT ON FEATURE CARDS (DESKTOP)
  // -------------------------------------------------------------------------
  const featureCards = document.querySelectorAll(".feature-card");

  featureCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      if (window.innerWidth < 992) return; // Disable on touch/small screens
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within card
      const y = e.clientY - rect.top; // y position within card

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6; // Max 6deg
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // -------------------------------------------------------------------------
  // 5. SMOOTH IN-PAGE ANCHOR SCROLL
  // -------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });
});
