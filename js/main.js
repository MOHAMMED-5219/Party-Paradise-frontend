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

// Close mobile menu when clicking on a link
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
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// Load Packages
async function loadPackages() {
    try {
        const response = await fetch(`${API_URL}/packages`);
        const packages = await response.json();
        
        if (packages.length > 0) {
            displayPackages(packages);
        } else {
            // Display default packages if none in database
            displayDefaultPackages();
        }
    } catch (error) {
        console.error('Error loading packages:', error);
        displayDefaultPackages();
    }
}

function displayDefaultPackages() {
    const defaultPackages = [
        {
            _id: 'basic',
            name: 'Basic Package',
            price: 299,
            features: [
                'Balloon Decorations',
                'Table Setup',
                'Basic Lighting',
                'Photo Backdrop',
                '4 Hours Service'
            ]
        },
        {
            _id: 'premium',
            name: 'Premium Package',
            price: 599,
            features: [
                'Premium Balloon Arrangements',
                'Elegant Table Settings',
                'Professional Lighting',
                'Custom Photo Booth',
                'Floral Centerpieces',
                '6 Hours Service',
                'Free Consultation'
            ]
        },
        {
            _id: 'luxury',
            name: 'Luxury Package',
            price: 999,
            features: [
                'Designer Balloon Installations',
                'Luxury Table Settings',
                'Advanced Lighting System',
                'Premium Photo Booth',
                'Exotic Floral Arrangements',
                'Custom Props & Accessories',
                '8 Hours Service',
                'Dedicated Event Coordinator',
                'Free Setup & Cleanup'
            ]
        }
    ];
    
    displayPackages(defaultPackages);
}

function displayPackages(packages) {
    packagesContainer.innerHTML = '';
    
    packages.forEach(pkg => {
        const packageCard = document.createElement('div');
        packageCard.className = 'package-card';
        
        const featuresHTML = pkg.features.map(feature => 
            `<li><i class="fas fa-check"></i> ${feature}</li>`
        ).join('');
        
        packageCard.innerHTML = `
            <div class="package-header">
                <h3>${pkg.name}</h3>
                <div class="package-price">$${pkg.price}</div>
            </div>
            <div class="package-body">
                <ul class="package-features">
                    ${featuresHTML}
                </ul>
                <button class="btn btn-primary" onclick="openBookingModal('${pkg._id}', '${pkg.name}')">
                    Book Now
                </button>
            </div>
        `;
        
        packagesContainer.appendChild(packageCard);
    });
}

// Open Booking Modal
function openBookingModal(packageId, packageName) {
    document.getElementById('packageId').value = packageId;
    bookingModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close Modal
closeModal?.addEventListener('click', () => {
    bookingModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
        bookingModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Contact Form Submission
contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };
    
    try {
        const response = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        const messageDiv = document.getElementById('formMessage');
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

    // 1 second delay so user can see success message
    setTimeout(() => {
        window.location.href =
          `https://wa.me/${ownerNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    }, 1000);
}
 else {
            messageDiv.textContent = 'Something went wrong. Please try again.';
            messageDiv.className = 'form-message error';
        }
        
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    } catch (error) {
        console.error('Error:', error);
        const messageDiv = document.getElementById('formMessage');
        messageDiv.textContent = 'Error sending message. Please try again.';
        messageDiv.className = 'form-message error';
    }
});

// Booking Form Submission
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        const messageDiv = document.getElementById('bookingMessage');
        if (response.ok) {
            messageDiv.textContent = 'Booking confirmed! We will contact you shortly.';
            messageDiv.className = 'form-message success';
            bookingForm.reset();
            
            setTimeout(() => {
                bookingModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                messageDiv.style.display = 'none';
            }, 5000);
        } else {
            messageDiv.textContent = 'Booking failed. Please try again.';
            messageDiv.className = 'form-message error';
        }
    } catch (error) {
        console.error('Error:', error);
        const messageDiv = document.getElementById('bookingMessage');
        messageDiv.textContent = 'Error processing booking. Please try again.';
        messageDiv.className = 'form-message error';
    }
});

// Set minimum date for event booking to today
const eventDateInput = document.getElementById('eventDate');
if (eventDateInput) {
    const today = new Date().toISOString().split('T')[0];
    eventDateInput.setAttribute('min', today);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPackages();
});

// Animation on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .package-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});


// HERO BACKGROUND SLIDER
const hero = document.querySelector(".hero");

const heroImages = [
  "images/hero/hero1.jpg",
  "images/hero/hero2.jpg",
  "images/hero/hero3.jpg",
  "images/hero/hero4.jpg"
];

let currentIndex = 0;

// initial image
hero.style.backgroundImage = `url(${heroImages[currentIndex]})`;

setInterval(() => {
  currentIndex = (currentIndex + 1) % heroImages.length;
  hero.style.backgroundImage = `url(${heroImages[currentIndex]})`;
}, 2000); // 1000ms = 1 second


