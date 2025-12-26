import { translations } from './translations.js';

// Sticky Header & Navigation
const navbar = document.getElementById('navbar');
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

// Language Switcher Logic
let currentLang = 'id'; // Default language

const updateContent = (lang) => {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            // Handle HTML content if the translation contains tags, otherwise text
            if (translations[lang][key].includes('<')) {
                el.innerHTML = translations[lang][key];
            } else {
                el.innerText = translations[lang][key];
            }
        }
    });

    // Update Toggle UI
    document.querySelectorAll('.lang-text').forEach(span => {
        span.classList.remove('active');
        if (span.getAttribute('data-lang') === lang) {
            span.classList.add('active');
        }
    });

    currentLang = lang;
};

document.getElementById('lang-toggle').addEventListener('click', () => {
    const newLang = currentLang === 'id' ? 'en' : 'id';
    updateContent(newLang);
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu
mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-active');

    // Animate hamburger to X (simple version)
    // In a real app we'd toggle a class on the button for CSS transition
});

// Close mobile menu when link clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-active');
    });
});

// Reveal Animations on Scroll
const revealElements = document.querySelectorAll('.reveal');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Only animate once
        }
    });
};

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

console.log('Surya Pangan website loaded successfully');
