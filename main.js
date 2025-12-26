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

// Form Validation
// Form Validation & AJAX Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Stop standard redirect submission

        const userAnswer = parseInt(document.getElementById('captcha-input').value, 10);
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = btn.innerText;

        // Security Check
        if (userAnswer !== captchaSum) {
            // Get error message based on language
            const errorMsg = currentLang === 'id'
                ? "Jawaban matematika salah. Silakan coba lagi."
                : "Incorrect math answer. Please try again.";
            alert(errorMsg);
            generateMathCaptcha();
            return;
        }

        // Show Loading State
        btn.innerText = currentLang === 'id' ? "Mengirim..." : "Sending...";
        btn.disabled = true;

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
                const successMsg = currentLang === 'id'
                    ? "Pesan berhasil terkirim! Terima kasih telah menghubungi kami."
                    : "Message sent successfully! Thank you for contacting us.";
                alert(successMsg);
                contactForm.reset(); // Clear form
                generateMathCaptcha(); // Reset captcha
            } else {
                // Error from server
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert("Oops! There was a problem submitting your form");
                    }
                });
            }
        }).catch(error => {
            alert("Oops! There was a problem submitting your form");
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
