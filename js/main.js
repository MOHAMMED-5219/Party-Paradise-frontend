// ================= CONFIG =================
const API_URL = "https://party-paradise-backend-mr44.onrender.com/api";

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = Array.from(document.querySelectorAll("section[id]")).filter(
    (section) => section.id !== "home" || section.classList.contains("hero")
  );
  const hero = document.querySelector(".hero");
  const heroBackgroundA = document.querySelector(".hero-background-a");
  const heroBackgroundB = document.querySelector(".hero-background-b");
  const bookingModal = document.getElementById("bookingModal");
  const bookingForm = document.getElementById("bookingForm");
  const bookingMessage = document.getElementById("bookingMessage");
  const bookingSubmit = bookingForm?.querySelector(".btn-submit");
  const openBookingButtons = document.querySelectorAll("[data-open-booking]");
  const closeBookingButton = bookingModal?.querySelector(".close");
  const contactForm = document.getElementById("contactForm");
  const contactMessage = document.getElementById("formMessage");
  const contactSubmit = contactForm?.querySelector(".btn-submit");
  const revealTargets = Array.from(document.querySelectorAll(
    ".services, .gallery, .contact, .footer, .package-card, .service-card, .gallery-item, .contact-info, .contact-form"
  ));

  const heroImages = [
    "gallery/event2.jpeg",
    "gallery/event1.jpeg",
    "gallery/event3.jpeg",
    "gallery/Birthday/b1.jpg",
    "gallery/Birthday/b2.jpg",
  ];
  let heroIndex = 0;
  let heroShowingA = true;

  if (heroBackgroundA) {
    heroBackgroundA.style.backgroundImage = `url('${heroImages[0]}')`;
  }
  if (heroBackgroundB) {
    heroBackgroundB.style.backgroundImage = `url('${heroImages[1] || heroImages[0]}')`;
  }

  const openModal = () => {
    if (!bookingModal) return;
    bookingModal.classList.add("is-open");
    document.body.classList.add("nav-open");
    const firstField = bookingModal.querySelector("input, textarea, button");
    window.setTimeout(() => firstField?.focus(), 50);
  };

  const closeModal = () => {
    if (!bookingModal) return;
    bookingModal.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  };

  const setMessage = (element, type, text) => {
    if (!element) return;
    element.className = `form-message ${type} is-visible`;
    element.textContent = text;
  };

  const setLoadingState = (button, loading) => {
    if (!button) return;
    button.classList.toggle("is-loading", loading);
    button.disabled = loading;
  };

  const toggleMobileMenu = (open) => {
    if (!navMenu || !hamburger) return;
    navMenu.classList.toggle("active", open);
    hamburger.classList.toggle("active", open);
    document.body.classList.toggle("nav-open", open);
  };

  const updateActiveLink = () => {
    const scrollPosition = window.scrollY + 120;

    navLinks.forEach((link) => link.classList.remove("active"));

    let activeSectionId = "home";

    sections.forEach((section) => {
      if (scrollPosition >= section.offsetTop) {
        activeSectionId = section.id;
      }
    });

    const activeLink = navLinks.find((link) => link.getAttribute("href") === `#${activeSectionId}`);
    activeLink?.classList.add("active");
  };

  const updateNavbar = () => {
    navbar?.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  const advanceHero = () => {
    if (!hero || !heroBackgroundA || !heroBackgroundB) return;
    heroIndex = (heroIndex + 1) % heroImages.length;
    const nextIndex = (heroIndex + 1) % heroImages.length;
    const nextBackground = heroShowingA ? heroBackgroundB : heroBackgroundA;
    const currentBackground = heroShowingA ? heroBackgroundA : heroBackgroundB;

    nextBackground.style.backgroundImage = `url('${heroImages[heroIndex]}')`;
    hero.classList.add("hero-fading");

    window.setTimeout(() => {
      currentBackground.style.backgroundImage = `url('${heroImages[nextIndex]}')`;
      hero.classList.remove("hero-fading");
      heroShowingA = !heroShowingA;
      heroIndex = nextIndex;
    }, 1200);
  };

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -10% 0px" }
  );

  revealTargets.forEach((target) => {
    if (target && !target.classList.contains("hero") && !target.classList.contains("footer")) {
      target.classList.add("section-reveal");
      revealObserver.observe(target);
    }
  });

  hamburger?.addEventListener("click", () => {
    const isOpen = navMenu?.classList.contains("active");
    toggleMobileMenu(!isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => toggleMobileMenu(false));
  });

  openBookingButtons.forEach((button) => {
    button.addEventListener("click", openModal);
  });

  closeBookingButton?.addEventListener("click", closeModal);

  bookingModal?.addEventListener("click", (event) => {
    if (event.target === bookingModal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
      toggleMobileMenu(false);
    }
  });

  window.addEventListener("scroll", () => {
    updateNavbar();
    updateActiveLink();
  }, { passive: true });

  updateNavbar();
  updateActiveLink();

  window.setInterval(advanceHero, 7000);

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.getElementById("name")?.value.trim();
      const email = document.getElementById("email")?.value.trim();
      const phone = document.getElementById("phone")?.value.trim();
      const message = document.getElementById("message")?.value.trim();

      setLoadingState(contactSubmit, true);
      setMessage(contactMessage, "info", "Sending your message...");

      try {
        const response = await fetch(`${API_URL}/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, phone, message }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setMessage(contactMessage, "success", "Thank you. We have received your message and will contact you soon.");
          contactForm.reset();
        } else {
          setMessage(contactMessage, "error", "Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("FRONTEND ERROR:", error);
        setMessage(contactMessage, "error", "Server error. Please try again later.");
      } finally {
        setLoadingState(contactSubmit, false);
      }
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const payload = {
        packageId: document.getElementById("packageId")?.value,
        name: document.getElementById("bookingName")?.value.trim(),
        email: document.getElementById("bookingEmail")?.value.trim(),
        phone: document.getElementById("bookingPhone")?.value.trim(),
        eventDate: document.getElementById("eventDate")?.value,
        location: document.getElementById("location")?.value.trim(),
        specialRequests: document.getElementById("specialRequests")?.value.trim(),
      };

      setLoadingState(bookingSubmit, true);
      setMessage(bookingMessage, "info", "Submitting your booking...");

      try {
        const response = await fetch(`${API_URL}/booking`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setMessage(bookingMessage, "success", "Your booking request was sent successfully.");
          bookingForm.reset();
          window.setTimeout(closeModal, 900);
        } else {
          setMessage(bookingMessage, "error", result.message || "Unable to submit booking. Please try again.");
        }
      } catch (error) {
        console.error("BOOKING ERROR:", error);
        setMessage(bookingMessage, "error", "Server error. Please try again later.");
      } finally {
        setLoadingState(bookingSubmit, false);
      }
    });
  }
});