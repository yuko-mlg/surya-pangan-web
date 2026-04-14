import { translations } from './translations.js';

// Window Reset
window.addEventListener('load', () => window.scrollTo(0, 0));

const navbar = document.getElementById('navbar');

const urlParams = new URLSearchParams(window.location.search);
const langParam = urlParams.get('lang');

if (langParam && (langParam === 'id' || langParam === 'en')) {
    localStorage.setItem('language', langParam);
}

let currentLang = langParam || localStorage.getItem('language') || 'id';
let currentNewsData = [];
let currentCSRData = [];
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

    // Support for placeholders
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    const idFlag = document.querySelector('.lang-text[data-lang="id"]');
    const enFlag = document.querySelector('.lang-text[data-lang="en"]');

    if (idFlag && enFlag) {
        if (lang === 'id') {
            idFlag.style.display = 'none';
            enFlag.style.display = 'flex';
        } else {
            idFlag.style.display = 'flex';
            enFlag.style.display = 'none';
        }
    }

    // Update SMART Spirit image source based on language
    const spiritImg = document.getElementById('spirit-img-main');
    if (spiritImg) {
        spiritImg.src = lang === 'en' ? 'assets/images/SMART_spirit_en.png' : 'assets/images/SMART_spirit_id.png';
    }

    currentLang = lang;
    renderNews(lang);
};

const langToggleBtn = document.getElementById('lang-toggle');
if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
        const newLang = currentLang === 'id' ? 'en' : 'id';

        // Update URL parameter for SEO and shareability
        const url = new URL(window.location);
        if (newLang === 'en') {
            url.searchParams.set('lang', 'en');
        } else {
            url.searchParams.delete('lang'); // Remove param for Indonesian (default)
        }
        window.history.pushState({}, '', url);

        // Update localStorage for persistence
        localStorage.setItem('language', newLang);

        updateContent(newLang);
        renderNews(newLang);
        renderTestimonials(activeTestimonialCategory, newLang);
        generateMathCaptcha();
    });
}

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
                contactForm.reset();
                generateMathCaptcha();
            } else {
                // Error from server (e.g. limit reached)
                throw new Error("Form submission error");
            }
        }).catch(error => {
            // Check for potential rate limit or network error
            const fallbackMsg = currentLang === 'id'
                ? "Gagal mengirim via formulir. Silakan gunakan WhatsApp untuk respon cepat."
                : "Form submission failed. Please use WhatsApp for a faster response.";

            showStatus(fallbackMsg, 'error');

            // Show WhatsApp button as fallback
            const waFallback = document.createElement('div');
            waFallback.id = 'wa-fallback-btn';
            waFallback.style.marginTop = '1rem';
            waFallback.innerHTML = `
                <a href="https://wa.me/628176335737" class="btn btn-primary" style="width: 100%; background: #25D366; border: none; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                    <i class="fab fa-whatsapp"></i> ${currentLang === 'id' ? 'Hubungi via WhatsApp' : 'Contact via WhatsApp'}
                </a>
            `;
            // Check if it already exists to avoid duplication
            if (!document.getElementById('wa-fallback-btn')) {
                formStatus.appendChild(waFallback);
            }
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
if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-active');
    });
}

// Close mobile menu when link clicked
if (navLinks) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            // If it's a dropdown trigger on mobile, toggle instead of closing
            if (window.innerWidth < 992 && link.classList.contains('dropdown-trigger')) {
                e.preventDefault();
                const parent = link.closest('.nav-dropdown');
                if (parent) parent.classList.toggle('active');
            } else {
                // Close menu for normal links
                navLinks.classList.remove('mobile-active');
            }
        });
    });
}

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

// Auto-translate function removed - all content is manually translated in CMS

// Render News Function
async function renderNews(lang) {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) return;

    try {
        let response = await fetch(`data/news_${lang}.json`);
        let data = await response.json();
        let news = data.news || data;

        // Scheduling Logic: Filter news by Start Date and Expiry Date (with Time precision)
        const now = new Date();

        const filteredNews = news.filter(item => {
            const startDate = new Date(item.date); // Full date + time
            const expiryDate = item.expiry_date ? new Date(item.expiry_date) : null;

            // Show if:
            // 1. Now is >= Start Date
            // 2. AND (Expiry Date is not set OR Now is <= Expiry Date)
            const isStarted = now >= startDate;
            const isNotExpired = !expiryDate || now <= expiryDate;

            return isStarted && isNotExpired;
        });

        // Use filtered news directly - no auto-translate fallback
        news = filteredNews;
        currentNewsData = news;

        newsGrid.innerHTML = news.map(item => `
            <article class="news-card">
                <div class="news-image-wrapper">
                    <img src="${item.image}" alt="${item.title}" class="news-img" loading="lazy">
                </div>
                <div class="news-content">
                    <div class="news-date">${new Date(item.date).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    <h3 class="news-title">${item.title}</h3>
                    <p class="news-excerpt">${item.summary}</p>
                    <a href="javascript:void(0)" class="news-link detail-trigger" data-type="news" data-id="${item.id}">
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

async function renderCSR(lang) {
    const csrGrid = document.getElementById('csr-grid');
    if (!csrGrid) return;

    try {
        let response = await fetch(`data/csr_${lang}.json`);
        let data = await response.json();
        let csrActivities = data.csr || data;

        const now = new Date();

        // Scheduling & Filtering Logic
        const filteredCSR = csrActivities.filter(item => {
            const startDate = new Date(item.date);
            const expiryDate = item.expiry_date ? new Date(item.expiry_date) : null;
            return now >= startDate && (!expiryDate || now <= expiryDate);
        });

        // Use filtered CSR directly - no auto-translate fallback
        csrActivities = filteredCSR;
        currentCSRData = csrActivities;

        if (csrActivities.length === 0) {
            csrGrid.innerHTML = `<p class="text-center">${lang === 'id' ? 'Belum ada kegiatan sosial terbaru.' : 'No recent social activities.'}</p>`;
            return;
        }

        csrGrid.innerHTML = csrActivities.map(item => `
            <div class="csr-card">
                <div class="csr-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    <div class="event-badge">${item.badge}</div>
                </div>
                <div class="csr-text">
                    <h3>${item.title}</h3>
                    <div class="meta-info">
                        <span><i class="fas fa-calendar-alt"></i> <span>${item.time_info}</span></span>
                        <span><i class="fas fa-map-marker-alt"></i> <span>${item.location}</span></span>
                    </div>
                    <p>${item.desc1}</p>
                    <p>${item.desc2}</p>
                    <a href="javascript:void(0)" class="btn-outline detail-trigger" data-type="csr" data-id="${item.id}">${lang === 'id' ? 'Baca Selengkapnya' : 'Read More'}</a>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading CSR:', error);
        csrGrid.innerHTML = '<p class="text-center">Gagal memuat kegiatan sosial.</p>';
    }
}

// Testimonials Slider Logic
const testimonialContainer = document.getElementById('testimonial-container');
const testimonialTabs = document.querySelectorAll('.tab-btn');
const sliderDots = document.getElementById('slider-dots');
const prevBtn = document.getElementById('prev-testimonial');
const nextBtn = document.getElementById('next-testimonial');

let currentSlide = 0;
let slideInterval;
let activeTestimonialCategory = 'partners';

function renderTestimonials(category, lang) {
    if (!testimonialContainer) return;
    activeTestimonialCategory = category;
    
    // Stop previous interval
    clearInterval(slideInterval);
    currentSlide = 0;

    const getTestimonial = (cat, id) => {
        const text = translations[lang][`testimonials.${cat}.${id}.text`];
        if (!text) return null;
        return {
            text,
            name: translations[lang][`testimonials.${cat}.${id}.name`],
            company: translations[lang][`testimonials.${cat}.${id}.company`]
        };
    };

    const count = 5; // We use 5 for each as per translations.js
    const data = [];
    const prefix = category === 'partners' ? 'p' : 'c';
    
    for (let i = 1; i <= count; i++) {
        const item = getTestimonial(category, prefix + i);
        if (item) data.push(item);
    }

    // Render slides
    testimonialContainer.innerHTML = data.map(item => `
        <div class="testimonial-card">
            <div class="quote-icon"><i class="fas fa-quote-left"></i></div>
            <p class="testimonial-text">${item.text}</p>
            <div class="testimonial-author">
                <div class="author-info">
                    <h4>${item.name}</h4>
                    <p>${item.company}</p>
                </div>
            </div>
        </div>
    `).join('');

    // Render dots
    if (sliderDots) {
        sliderDots.innerHTML = data.map((_, i) => `<div class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`).join('');
        
        // Dot clicks
        const dots = sliderDots.querySelectorAll('.dot');
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                goToSlide(parseInt(dot.getAttribute('data-index')));
                startAutoPlay(); // Reset timer on click
            });
        });
    }

    updateSlider();
    startAutoPlay();
}

function updateSlider() {
    if (!testimonialContainer) return;
    const offset = currentSlide * -100;
    testimonialContainer.style.transform = `translateX(${offset}%)`;
    
    // Update dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function goToSlide(n) {
    const dots = document.querySelectorAll('.dot');
    if (n >= dots.length) currentSlide = 0;
    else if (n < 0) currentSlide = dots.length - 1;
    else currentSlide = n;
    updateSlider();
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function startAutoPlay() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

// Controls listeners
if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });

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
renderCSR(currentLang);
renderTestimonials(activeTestimonialCategory, currentLang);
generateMathCaptcha();

// Visitor Counter - Animated Display
function updateVisitorCounter() {
    const counterDisplay = document.getElementById('visitor-number');
    if (!counterDisplay) return;
    
    let target = 2143; // Realistic starting point based on "2000+"
    let count = target - 50; 
    let speed = 40;
    
    const increment = () => {
        if (count < target) {
            count++;
            counterDisplay.innerText = count.toLocaleString('id-ID');
            setTimeout(increment, speed);
            speed += 2; // Slow down as it approaches target
        }
    };
    
    increment();
}

// updateVisitorCounter();

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

// Privacy Policy Modal Logic
const privacyModal = document.getElementById('privacy-modal');
const privacyTrigger = document.getElementById('privacy-trigger');
const closePrivacyX = document.getElementById('close-privacy');
const closePrivacyBtn = document.getElementById('close-privacy-btn');

if (privacyTrigger && privacyModal) {
    privacyTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        privacyModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });

    const closeModal = () => {
        privacyModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    };

    if (closePrivacyX) closePrivacyX.addEventListener('click', closeModal);
    if (closePrivacyBtn) closePrivacyBtn.addEventListener('click', closeModal);

    // Close on outside click
    window.addEventListener('click', (event) => {
        if (event.target === privacyModal) {
            closeModal();
        }
    });

    // Close on ESC key
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && privacyModal.style.display === 'block') {
            closeModal();
        }
    });
}

// Pango Philosophy Modal Logic
const pangoModal = document.getElementById('pango-modal');
const pangoTrigger = document.getElementById('pango-philosophies-trigger');
const pangoMascotTrigger = document.getElementById('pango-mascot-footer-trigger');
const closePangoX = document.getElementById('close-pango');
const closePangoBtn = document.getElementById('close-pango-btn');

if (pangoModal) {
    const openPangoModal = (e) => {
        if (e) e.preventDefault();
        pangoModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };

    if (pangoTrigger) {
        pangoTrigger.addEventListener('click', openPangoModal);
    }
    
    // Check if there are other triggers for Pango modal
    const extraTriggers = document.querySelectorAll('.pango-philosophy-trigger');
    extraTriggers.forEach(btn => btn.addEventListener('click', openPangoModal));

    // SMART Spirit image also opens the modal
    const spiritImg = document.getElementById('spirit-img-main');
    if (spiritImg) {
        spiritImg.addEventListener('click', openPangoModal);
    }

    const closePangoModal = () => {
        pangoModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    };

    if (closePangoX) closePangoX.addEventListener('click', closePangoModal);
    if (closePangoBtn) closePangoBtn.addEventListener('click', closePangoModal);

    // Close on outside click
    window.addEventListener('click', (event) => {
        if (event.target === pangoModal) {
            closePangoModal();
        }
    });

    // Close on ESC key
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && pangoModal.style.display === 'block') {
            closePangoModal();
        }
    });
}

// News & CSR Detail Modal Logic
const newsCsrModal = document.getElementById('news-csr-modal');
const modalBody = document.getElementById('modal-body-content');
const closeNewsCsrX = document.getElementById('close-news-csr');
const closeNewsCsrBtn = document.getElementById('close-news-csr-btn');

function openDetailModal(type, id) {
    if (!newsCsrModal || !modalBody) return;

    // We assume currentNewsData and currentCSRData are globally available from news logic
    const data = type === 'news' ? (window.currentNewsData || []) : (window.currentCSRData || []);
    const item = data.find(i => String(i.id) === String(id));

    if (!item) return;

    // Set Loading state
    modalBody.innerHTML = '<div class="modal-loader">Memuat detail...</div>';
    newsCsrModal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Build Content (Magazine Style)
    let html = `
        <div class="news-modal-header">
            <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="news-modal-body">
            <div class="news-modal-meta">
                <span><i class="fas fa-calendar-alt"></i> ${type === 'news' ? new Date(item.date).toLocaleDateString(localStorage.getItem('language') === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : item.time_info}</span>
                ${item.location ? `<span><i class="fas fa-map-marker-alt"></i> ${item.location}</span>` : ''}
            </div>
            <h2 class="news-modal-title">${item.title}</h2>
            <div class="news-modal-text">
                ${item.content ? item.content.split('\n').map(p => `<p>${p}</p>`).join('') : `<p>${item.summary || item.desc1}</p>`}
            </div>
        </div>
    `;

    setTimeout(() => {
        modalBody.innerHTML = html;
    }, 300); // Small delay for smooth transition
}

const closeDetailModal = () => {
    if (newsCsrModal) {
        newsCsrModal.style.display = 'none';
        document.body.style.overflow = '';
    }
};

// Event Delegation for Read More buttons
document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.detail-trigger');
    if (trigger) {
        e.preventDefault();
        const type = trigger.getAttribute('data-type');
        const id = trigger.getAttribute('data-id');
        if (type && id) openDetailModal(type, id);
    }
});

if (closeNewsCsrX) closeNewsCsrX.onclick = closeDetailModal;
if (closeNewsCsrBtn) closeNewsCsrBtn.onclick = closeDetailModal;

// Close on outside click
window.addEventListener('click', (e) => {
    if (e.target === newsCsrModal) closeDetailModal();
});

// Close on ESC key
window.addEventListener('keydown', (e) => {
    if (newsCsrModal && e.key === 'Escape' && newsCsrModal.style.display === 'block') {
        closeDetailModal();
    }
});
