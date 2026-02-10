import { translations } from './translations.js';
// import { newsData } from './news-data.js'; // REMOVED: Now fetching from JSON

// Scroll to top on page load/refresh
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// Sticky Header & Navigation
const navbar = document.getElementById('navbar');

// Language Management
let currentLang = localStorage.getItem('language') || 'id'; // Default language
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

// Language Switcher Logic

const updateContent = (lang) => {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (translations[lang][key].includes('<')) {
                el.innerHTML = translations[lang][key];
            } else {
                el.innerText = translations[lang][key];
            }
        }
    });

    // Smart Flag Toggle: Show ONLY the target language flag
    // (If current is ID, show EN flag. If current is EN, show ID flag.)
    const idFlag = document.querySelector('.lang-text[data-lang="id"]');
    const enFlag = document.querySelector('.lang-text[data-lang="en"]');

    if (lang === 'id') {
        idFlag.style.display = 'none';
        enFlag.style.display = 'flex';
    } else {
        idFlag.style.display = 'flex';
        enFlag.style.display = 'none';
    }

    currentLang = lang;
    renderNews(lang);
};

document.getElementById('lang-toggle').addEventListener('click', () => {
    const newLang = currentLang === 'id' ? 'en' : 'id';
    updateContent(newLang);
    renderNews(newLang);
    renderTestimonials(activeTestimonialCategory, newLang);
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
            formStatus.className = `form - status ${type} `;
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
    link.addEventListener('click', (e) => {
        // If it's a dropdown trigger on mobile, toggle instead of closing
        if (window.innerWidth < 992 && link.classList.contains('dropdown-trigger')) {
            e.preventDefault();
            const parent = link.closest('.nav-dropdown');
            parent.classList.toggle('active');
        } else {
            // Close menu for normal links
            navLinks.classList.remove('mobile-active');
        }
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
                        // Preload the image
                        const img = new Image();
                        img.src = logoSrc;
                        img.className = 'supplier-logo';
                        img.alt = card.querySelector('.brand-name').innerText;

                        img.onload = () => {
                            // Only transform if image is valid and loaded
                            setTimeout(() => {
                                card.classList.add('transforming');
                                setTimeout(() => {
                                    card.innerHTML = '';
                                    card.appendChild(img);
                                    card.classList.remove('transforming');
                                    card.classList.add('logo-loaded');
                                }, 300);
                            }, index * 100 + 400); // 400ms delay after scroll to show text first
                        };

                        img.onerror = () => {
                            console.warn(`Failed to load logo for ${img.alt}`);
                            // Keep text as fallback - no action needed
                        };
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

// Helper for Automatic Translation (Google Translate API Client-side)
async function translateText(text, target = 'en') {
    if (!text || target === 'id') return text;
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        const data = await response.json();
        return data[0].map(item => item[0]).join('');
    } catch (e) {
        console.error('Translation error:', e);
        return text;
    }
}

// Render News Function
async function renderNews(lang) {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) return;

    try {
        let response = await fetch(`data/news_${lang}.json`);
        let data = await response.json();
        let news = data.news || data;

        // Fallback: If EN news is empty, fetch ID news and translate
        if (lang === 'en' && (!news || news.length === 0)) {
            console.log('EN News empty, falling back to ID with auto-translation...');
            const idResponse = await fetch('data/news_id.json');
            const idData = await idResponse.json();
            const idNews = idData.news || idData;

            news = await Promise.all(idNews.map(async (item) => ({
                ...item,
                title: await translateText(item.title, 'en'),
                summary: await translateText(item.summary, 'en')
            })));
        }

        newsGrid.innerHTML = news.map(item => `
            <article class="news-card">
                <div class="news-image-wrapper">
                    <img src="${item.image}" alt="${item.title}" class="news-img" loading="lazy">
                </div>
                <div class="news-content">
                    <div class="news-date">${new Date(item.date).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    <h3 class="news-title">${item.title}</h3>
                    <p class="news-excerpt">${item.summary}</p>
                    <a href="${item.link}" class="news-link">
                        ${translations[lang]['news.read_more']}
                        <span class="arrow">→</span>
                    </a>
                </div>
            </article>
        `).join('');
    } catch (error) {
        console.error('Error loading news:', error);
        newsGrid.innerHTML = '<p class="text-center">Gagal memuat berita.</p>';
    }
}

// Testimonials Logic
const testimonialContainer = document.getElementById('testimonial-container');
const testimonialTabs = document.querySelectorAll('.tab-btn');
let activeTestimonialCategory = 'partners';

function renderTestimonials(category, lang) {
    if (!testimonialContainer) return;
    activeTestimonialCategory = category;

    // Helper to get testimonial data from translations
    const getTestimonial = (cat, id) => ({
        text: translations[lang][`testimonials.${cat}.${id}.text`],
        name: translations[lang][`testimonials.${cat}.${id}.name`],
        company: translations[lang][`testimonials.${cat}.${id}.company`]
    });

    const data = category === 'partners'
        ? [getTestimonial('partners', 'p1'), getTestimonial('partners', 'p2')]
        : [getTestimonial('customers', 'c1'), getTestimonial('customers', 'c2')];

    testimonialContainer.innerHTML = data.map(item => `
        <div class="testimonial-card">
            <div class="quote-icon">"</div>
            <p class="testimonial-text">${item.text}</p>
            <div class="testimonial-author">
                <div class="author-info">
                    <h4>${item.name}</h4>
                    <p>${item.company}</p>
                </div>
            </div>
        </div>
    `).join('');
}

testimonialTabs.forEach(btn => {
    btn.addEventListener('click', () => {
        testimonialTabs.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.getAttribute('data-target');
        renderTestimonials(category, currentLang);
    });
});

// Initial render
updateContent(currentLang);
renderNews(currentLang);
renderTestimonials(activeTestimonialCategory, currentLang);
generateMathCaptcha();

// WhatsApp Multi-Contact Menu Toggle
const waTrigger = document.getElementById('wa-menu-trigger');
const waPopup = document.getElementById('wa-menu-popup');

if (waTrigger && waPopup) {
    waTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        waTrigger.classList.toggle('active');
        waPopup.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!waTrigger.contains(e.target) && !waPopup.contains(e.target)) {
            waTrigger.classList.remove('active');
            waPopup.classList.remove('active');
        }
    });

    // Close menu on scroll for better UX on mobile
    window.addEventListener('scroll', () => {
        if (waPopup.classList.contains('active')) {
            waTrigger.classList.remove('active');
            waPopup.classList.remove('active');
        }
    }, { passive: true });
}

console.log('Surya Pangan website loaded successfully');
