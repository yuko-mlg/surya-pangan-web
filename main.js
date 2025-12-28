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
    generateMathCaptcha();

    updateContent(newLang);
    generateMathCaptcha();
});

// Set redirect to current page on load
const redirectInput = document.getElementById('next-redirect');
if (redirectInput) {
    redirectInput.value = window.location.href;
}

// Math CAPTCHA Logic
let captchaSum = 0;

function generateMathCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1; // 1-10
    const num2 = Math.floor(Math.random() * 10) + 1; // 1-10
    captchaSum = num1 + num2;

    // Update label text based on language logic is handled by translating content, 
    // but here we just update the numbers which are universal.
    document.getElementById('math-problem').textContent = `${num1} + ${num2} = ?`;
    document.getElementById('captcha-input').value = '';
}

// Email Validation Logic
function validateEmail(email) {
    // 1. Strict Regex for valid format
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
        return { isValid: false, errorKey: 'emailInvalid' };
    }

    // 2. Typo Guard for common domains
    const domain = email.split('@')[1].toLowerCase();
    const typoMap = {
        'gmil.com': 'gmail.com',
        'gmial.com': 'gmail.com',
        'gmsil.com': 'gmail.com',
        'gmal.com': 'gmail.com',
        'yaho.com': 'yahoo.com',
        'yahooo.com': 'yahoo.com',
        'hotmal.com': 'hotmail.com',
        'outlok.com': 'outlook.com',
        'gmai.com': 'gmail.com',
        'yahot.com': 'yahoo.com',
        'yhoo.com': 'yahoo.com',
        'yaho.co': 'yahoo.com',
        'hotmai.com': 'hotmail.com'
    };

    if (typoMap[domain]) {
        return { isValid: false, errorKey: 'emailTypo', suggestion: typoMap[domain] };
    }

    return { isValid: true };
}

// Form Validation
// Form Validation & AJAX Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // Stop standard redirect submission

        const userAnswer = parseInt(document.getElementById('captcha-input').value, 10);
        const email = document.getElementById('email').value;
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = btn.innerText;

        // 1. Client-Side Validation (Regex + Typo)
        const formStatus = document.getElementById('form-status');
        const showStatus = (msg, type = 'error') => {
            formStatus.innerText = msg;
            formStatus.className = `form-status ${type}`;
            formStatus.style.display = 'block';
            if (type === 'error') {
                formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };

        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            let msg = translations[currentLang][emailValidation.errorKey];
            if (emailValidation.suggestion) {
                msg += ` ${emailValidation.suggestion}?`;
            }
            showStatus(msg, 'error');
            return;
        }

        formStatus.style.display = 'none'; // Hide if previous error

        // Security Check (Math CAPTCHA)
        if (userAnswer !== captchaSum) {
            // Get error message based on language
            const errorMsg = translations[currentLang].mathError || (currentLang === 'id'
                ? "Jawaban matematika salah. Silakan coba lagi."
                : "Incorrect math answer. Please try again.");
            showStatus(errorMsg, 'error');
            generateMathCaptcha();
            btn.innerText = originalBtnText;
            btn.disabled = false;
            return;
        }

        btn.innerText = currentLang === 'id' ? "Mengirim..." : "Sending...";

        // Send to Formspree via AJAX
        const data = new FormData(contactForm);

        fetch(contactForm.action, {
            method: contactForm.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                // Success
                const successMsg = translations[currentLang].formSuccess || (currentLang === 'id'
                    ? "Pesan berhasil terkirim! Terima kasih telah menghubungi kami."
                    : "Message sent successfully! Thank you for contacting us.");
                showStatus(successMsg, 'success');
                contactForm.reset(); // Clear form
                generateMathCaptcha(); // Reset captcha
            } else {
                // Error from server
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        showStatus(data["errors"].map(error => error["message"]).join(", "), 'error');
                    } else {
                        showStatus(translations[currentLang].formError, 'error');
                    }
                });
            }
        }).catch(error => {
            showStatus(translations[currentLang].formError, 'error');
        }).finally(() => {
            // Restore Button
            btn.innerText = originalBtnText;
            btn.disabled = false;
        });
    });
}

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

            // Special Scenario: Transform Supplier Text to Logos
            if (entry.target.classList.contains('logo-grid')) {
                const cards = entry.target.querySelectorAll('.brand-card');
                cards.forEach((card, index) => {
                    const logoSrc = card.getAttribute('data-logo-src');
                    if (logoSrc) {
                        setTimeout(() => {
                            const img = new Image();
                            img.src = logoSrc;
                            img.className = 'supplier-logo';
                            img.alt = card.querySelector('.brand-name').innerText;

                            // Smooth transition
                            img.onload = () => {
                                card.classList.add('transforming');
                                setTimeout(() => {
                                    card.innerHTML = '';
                                    card.appendChild(img);
                                    card.classList.remove('transforming');
                                    card.classList.add('logo-loaded');
                                }, 300);
                            };
                        }, index * 100); // Staggered entry
                    }
                });
            }

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
