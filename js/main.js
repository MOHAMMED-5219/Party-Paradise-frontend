// ================= CONFIG =================
const API_URL = "https://party-paradise-apggecgjd3hcaaes.centralindia-01.azurewebsites.net/api";

// =====================================================
// PRELOADER
// =====================================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            // Fire a welcoming confetti burst
            if (typeof confetti !== 'undefined') {
                const duration = 1500;
                const end = Date.now() + duration;
                (function frame() {
                    confetti({
                        particleCount: 4,
                        angle: 60,
                        spread: 60,
                        origin: { x: 0, y: 0.8 },
                        colors: ['#ff4fa3', '#ffbe3d', '#45e6ff', '#6cf5b0', '#9b5cff']
                    });
                    confetti({
                        particleCount: 4,
                        angle: 120,
                        spread: 60,
                        origin: { x: 1, y: 0.8 },
                        colors: ['#ff4fa3', '#ffbe3d', '#45e6ff', '#6cf5b0', '#9b5cff']
                    });
                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                })();
            }
            setTimeout(() => { preloader.style.display = 'none'; }, 700);
        }, 1400);
    }
});

// =====================================================
// NAVBAR SCROLL EFFECT
// =====================================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// =====================================================
// MOBILE MENU TOGGLE
// =====================================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('nav-open');
});

// =====================================================
// SMOOTH SCROLLING
// =====================================================
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                // Close mobile menu if open
                navMenu?.classList.remove('active');
                hamburger?.classList.remove('active');
                document.body.classList.remove('nav-open');

                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// =====================================================
// LOAD PACKAGES
// =====================================================
const packagesContainer = document.getElementById('packagesContainer');

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



function displayPackages(packages) {
    packagesContainer.innerHTML = '';

    packages.forEach(pkg => {
        const packageCard = document.createElement('div');
        packageCard.className = 'package-card';

        const featuresHTML = (pkg.features || []).map(feature =>
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
                <button class="btn btn-primary btn-block" onclick="openBookingModal('${pkg._id}', '${pkg.name}')">
                    <i class="fas fa-calendar-check"></i> Book Now
                </button>
            </div>
        `;

        packagesContainer.appendChild(packageCard);
    });
}

// =====================================================
// OPEN / CLOSE BOOKING MODAL
// =====================================================
const bookingModal = document.getElementById('bookingModal');
const closeModalBtn = document.querySelector('.close');

function openBookingModal(packageId, packageName) {
    document.getElementById('packageId').value = packageId;
    bookingModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
    bookingModal.classList.remove('is-open');
    document.body.style.overflow = '';
}

closeModalBtn?.addEventListener('click', closeBookingModal);

window.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
        closeBookingModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeBookingModal();
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');
        document.body.classList.remove('nav-open');
    }
});

// =====================================================
// CONTACT FORM SUBMISSION
// =====================================================
const contactForm = document.getElementById('contactForm');

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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            messageDiv.textContent = '🎉 Thank you! We will contact you soon.';
            messageDiv.className = 'form-message success';
            contactForm.reset();
            // Celebrate!
            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 100,
                    spread: 75,
                    origin: { y: 0.6 },
                    colors: ['#ff4fa3', '#ffbe3d', '#45e6ff', '#6cf5b0', '#9b5cff']
                });
            }
        } else {
            messageDiv.textContent = 'Something went wrong. Please try again.';
            messageDiv.className = 'form-message error';
        }

        setTimeout(() => {
            messageDiv.className = 'form-message';
        }, 5000);
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = 'Error sending message. Please try again.';
        messageDiv.className = 'form-message error';
    }
});

// =====================================================
// BOOKING FORM SUBMISSION
// =====================================================
const bookingForm = document.getElementById('bookingForm');

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

    const messageDiv = document.getElementById('bookingMessage');

    try {
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            messageDiv.textContent = '🎊 Booking confirmed! We will contact you shortly.';
            messageDiv.className = 'form-message success';
            bookingForm.reset();
            // Big celebration!
            if (typeof confetti !== 'undefined') {
                const duration = 2000;
                const end = Date.now() + duration;
                (function frame() {
                    confetti({
                        particleCount: 6,
                        angle: 60,
                        spread: 65,
                        origin: { x: 0, y: 0.7 },
                        colors: ['#ff4fa3', '#ffbe3d', '#45e6ff', '#6cf5b0', '#9b5cff']
                    });
                    confetti({
                        particleCount: 6,
                        angle: 120,
                        spread: 65,
                        origin: { x: 1, y: 0.7 },
                        colors: ['#ff4fa3', '#ffbe3d', '#45e6ff', '#6cf5b0', '#9b5cff']
                    });
                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                })();
            }

            setTimeout(() => {
                closeBookingModal();
                messageDiv.className = 'form-message';
            }, 5000);
        } else {
            messageDiv.textContent = 'Booking failed. Please try again.';
            messageDiv.className = 'form-message error';
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = 'Error processing booking. Please try again.';
        messageDiv.className = 'form-message error';
    }
});

// =====================================================
// SET MINIMUM DATE FOR EVENT BOOKING TO TODAY
// =====================================================
const eventDateInput = document.getElementById('eventDate');
if (eventDateInput) {
    const today = new Date().toISOString().split('T')[0];
    eventDateInput.setAttribute('min', today);
}

// =====================================================
// HERO BACKGROUND SLIDER
// =====================================================
const hero = document.querySelector('.hero');

const heroImages = [
    'images/hero/hero1.jpg',
    'images/hero/hero2.jpg',
    'images/hero/hero3.jpg',
    'images/hero/hero4.jpg'
];

let currentIndex = 0;

// Initial image
if (hero) {
    hero.style.backgroundImage = `url(${heroImages[currentIndex]})`;

    setInterval(() => {
        currentIndex = (currentIndex + 1) % heroImages.length;
        hero.style.backgroundImage = `url(${heroImages[currentIndex]})`;
    }, 4000); // 4 seconds per slide
}

// =====================================================
// ANIMATION ON SCROLL
// =====================================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .package-card, .gallery-item, .section-head').forEach(el => {
    el.classList.add('section-reveal');
    revealObserver.observe(el);
});

// =====================================================
// INITIALIZE
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    loadPackages();
});