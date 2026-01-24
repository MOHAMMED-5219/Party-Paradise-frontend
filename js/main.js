// API Base URL
const API_URL = 'https://party-paradise-backend-mr44.onrender.com/api';

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const bookingModal = document.getElementById('bookingModal');
const closeModal = document.querySelector('.close');
const contactForm = document.getElementById('contactForm');
const bookingForm = document.getElementById('bookingForm');
const packagesContainer = document.getElementById('packagesContainer');

// Mobile Menu Toggle
hamburger?.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  hamburger.classList.toggle('active');
});

// Close mobile menu
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
  });
});

// ================= CONTACT FORM (FIXED + WHATSAPP) =================
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    message: document.getElementById('message').value
  };

  const messageDiv = document.getElementById('formMessage');

  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      messageDiv.textContent = 'Thank you! We will contact you soon.';
      messageDiv.className = 'form-message success';
      contactForm.reset();

      // ✅ WHATSAPP REDIRECT (CUSTOMER → OWNER)
      const ownerNumber = "919739685219";

      const whatsappMessage =
        "Thank you for contacting Party Paradise 🎉\n\n" +
        "We have received your enquiry and will call you soon.\n\n" +
        "– Team Party Paradise";

      setTimeout(() => {
        window.open(
          `https://wa.me/${ownerNumber}?text=${encodeURIComponent(whatsappMessage)}`,
          "_blank"
        );
      }, 1000);

    } else {
      messageDiv.textContent = 'Something went wrong. Please try again.';
      messageDiv.className = 'form-message error';
    }

    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 5000);

  } catch (error) {
    console.error(error);
    messageDiv.textContent = 'Error sending message. Please try again.';
    messageDiv.className = 'form-message error';
  }
});

// ================= BOOKING FORM (UNCHANGED) =================
bookingForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    packageId: document.getElementById('packageId').value,
    name: document.getElementById('bookingName').value,
    email: document.getElementById('bookingEmail').value,
    phone: document.getElementById('bookingPhone').value,
    eventDate: document.getElementById('eventDate').value,
    location: document.getElementById('location').value,
    specialRequests: document.getElementById('specialRequests').value
  };

  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    const messageDiv = document.getElementById('bookingMessage');

    if (response.ok) {
      messageDiv.textContent = 'Booking confirmed! We will contact you shortly.';
      messageDiv.className = 'form-message success';
      bookingForm.reset();
    } else {
      messageDiv.textContent = 'Booking failed. Please try again.';
      messageDiv.className = 'form-message error';
    }
  } catch (error) {
    console.error(error);
  }
});
