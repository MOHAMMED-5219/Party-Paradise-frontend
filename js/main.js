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

// Smooth Scrolling
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - 70,
        behavior: 'smooth'
      });
    }
  });
});

// Navbar shadow
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  navbar.style.boxShadow =
    window.scrollY > 50
      ? '0 5px 20px rgba(0,0,0,0.1)'
      : '0 2px 10px rgba(0,0,0,0.1)';
});

// Load Packages
async function loadPackages() {
  try {
    const res = await fetch(`${API_URL}/packages`);
    const packages = await res.json();
    packages.length ? displayPackages(packages) : displayDefaultPackages();
  } catch {
    displayDefaultPackages();
  }
}

function displayDefaultPackages() {
  displayPackages([
    { _id: 'basic', name: 'Basic Package', price: 299, features: ['Balloon Decorations','Table Setup','Lighting','Photo Backdrop'] },
    { _id: 'premium', name: 'Premium Package', price: 599, features: ['Premium Balloons','Lighting','Photo Booth','6 Hours Service'] },
    { _id: 'luxury', name: 'Luxury Package', price: 999, features: ['Designer Setup','Luxury Decor','Coordinator','8 Hours Service'] }
  ]);
}

function displayPackages(packages) {
  packagesContainer.innerHTML = '';
  packages.forEach(pkg => {
    packagesContainer.innerHTML += `
      <div class="package-card">
        <h3>${pkg.name}</h3>
        <p>₹${pkg.price}</p>
        <ul>${pkg.features.map(f => `<li>${f}</li>`).join('')}</ul>
        <button onclick="openBookingModal('${pkg._id}')">Book Now</button>
      </div>
    `;
  });
}

// Open Booking Modal
function openBookingModal(id) {
  document.getElementById('packageId').value = id;
  bookingModal.style.display = 'block';
}

// Close Modal
closeModal?.addEventListener('click', () => bookingModal.style.display = 'none');

// ==========================
// CONTACT FORM + WHATSAPP
// ==========================
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = nameInput = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;

  const data = {
    name,
    email: document.getElementById('email').value,
    phone,
    message: document.getElementById('message').value
  };

  await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  // ✅ WhatsApp auto-open (customer side)
  const msg = `Hi ${name} 👋
Thanks for contacting Party Paradise 🎉
We will call you shortly.`;

  window.open(
    `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`,
    "_blank"
  );

  contactForm.reset();
});

// ==========================
// BOOKING FORM + WHATSAPP
// ==========================
bookingForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('bookingName').value;
  const phone = document.getElementById('bookingPhone').value;

  const data = {
    packageId: document.getElementById('packageId').value,
    name,
    email: document.getElementById('bookingEmail').value,
    phone,
    eventDate: document.getElementById('eventDate').value,
    location: document.getElementById('location').value,
    specialRequests: document.getElementById('specialRequests').value
  };

  await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  // ✅ WhatsApp auto-open (customer)
  const msg = `Hi ${name} 👋
Your booking request is received 🎉
Party Paradise will contact you soon.`;

  window.open(
    `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`,
    "_blank"
  );

  bookingForm.reset();
  bookingModal.style.display = 'none';
});

// HERO BACKGROUND SLIDER
const hero = document.querySelector(".hero");
const heroImages = [
  "images/hero/hero1.jpg",
  "images/hero/hero2.jpg",
  "images/hero/hero3.jpg",
  "images/hero/hero4.jpg"
];
let i = 0;
hero.style.backgroundImage = `url(${heroImages[0]})`;
setInterval(() => {
  i = (i + 1) % heroImages.length;
  hero.style.backgroundImage = `url(${heroImages[i]})`;
}, 2000);

document.addEventListener('DOMContentLoaded', loadPackages);
