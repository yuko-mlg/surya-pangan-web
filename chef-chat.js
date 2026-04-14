import { translations } from './translations.js';

document.addEventListener('DOMContentLoaded', () => {
    const chefTrigger = document.getElementById('chef-chat-trigger');
    const chefWindow = document.getElementById('chef-chat-window');
    const chefClose = document.getElementById('chef-chat-close');
    const chefMessages = document.getElementById('chef-chat-messages');
    const chefInput = document.getElementById('chef-chat-input');
    const chefSend = document.getElementById('chef-chat-send');
    const chefTyping = document.getElementById('chef-chat-typing');
    const triggerBtn = document.getElementById('open-chat-btn');

    // Get current language from main app or localStorage
    const getCurrentLang = () => localStorage.getItem('language') || 'id';

    // Toggle Chat Window
    const toggleChat = () => {
        chefWindow.classList.toggle('active');
        if (chefWindow.classList.contains('active')) {
            chefInput.focus();
        }
    };

    if (chefTrigger) chefTrigger.addEventListener('click', toggleChat);
    if (chefClose) chefClose.addEventListener('click', toggleChat);
    if (triggerBtn) triggerBtn.addEventListener('click', toggleChat);

    // Pango Interactivity Logic (Nudge & Tooltip)
    if (chefTrigger) {
        // Show tooltip and nudge after 5 seconds
        setTimeout(() => {
            chefTrigger.classList.add('active'); // Shows tooltip
            chefTrigger.classList.add('nudge'); // Plays nudge animation
            
            // Remove nudge class after animation finishes so it can be re-triggered
            setTimeout(() => {
                chefTrigger.classList.remove('nudge');
            }, 1000);
        }, 5000);

        // Periodically nudge every 15 seconds if chat is closed
        setInterval(() => {
            if (!chefWindow.classList.contains('active')) {
                chefTrigger.classList.add('nudge');
                setTimeout(() => {
                    chefTrigger.classList.remove('nudge');
                }, 1000);
            }
        }, 15000);
    }

    // Add Message to UI
    const addMessage = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chef-message ${sender}`;
        messageDiv.innerHTML = `<div class="chef-message-bubble">${text}</div>`;
        chefMessages.appendChild(messageDiv);
        chefMessages.scrollTop = chefMessages.scrollHeight;
    };

    // Simulated Bot Response Logic
    const getBotResponse = (input, lang) => {
        const lowerInput = input.toLowerCase();
        
        const responses = {
            id: {
                greetings: ["halo", "hi", "siang", "pagi", "malam", "panggil"],
                products: ["produk", "bahan", "jual", "brand", "item", "apa saja"],
                location: ["lokasi", "alamat", "dimana", "cabang", "kantor", "pusat"],
                history: ["sejarah", "kapan berdiri", "didirikan", "sejak"],
                coverage: ["kirim", "area", "jangkauan", "distribusi", "lombok", "sumbawa", "bali"],
                customers: ["pelanggan", "customer", "banyak"],
                chef: ["resep", "masak", "chef", "kue", "bikin", "rekomendasi"],
                thanks: ["terima kasih", "thanks", "makasih"],
                default: "Maaf, saya masih belajar mengenai detail spesifik itu. Bisa hubungi tim kami via WhatsApp di tombol hijau untuk respon lebih detail ya!"
            },
            en: {
                greetings: ["hello", "hi", "hey", "morning", "afternoon"],
                products: ["product", "ingredient", "sell", "brand", "item"],
                location: ["location", "address", "where", "branch", "office"],
                history: ["history", "founded", "established", "since"],
                coverage: ["delivery", "area", "range", "distribution", "lombok", "sumbawa"],
                customers: ["customer", "how many"],
                chef: ["recipe", "cook", "chef", "bake", "cake", "recommendation"],
                thanks: ["thank you", "thanks"],
                default: "I'm still learning those specific details. Feel free to contact our team via WhatsApp for more professional assistance!"
            }
        };

        const res = responses[lang];

        // Greetings & Identity
        if (res.greetings.some(word => lowerInput.includes(word))) {
            if (lowerInput.includes("panggil")) return lang === 'id' ? "Halo! Ada yang bisa saya bantu hari ini?" : "Hello! How can I help you today?";
            return lang === 'id' ? "Halo! Saya Pango, asisten Surya Pangan yang siap membantu Anda." : "Hello! I am Pango, Surya Pangan's assistant ready to help you.";
        }

        // History
        if (res.history.some(word => lowerInput.includes(word))) {
            return lang === 'id' 
                ? "Surya Pangan berdiri sejak 2010 (awalnya UD. Pangan Mulia Lestari). Sejak 2013 kami menjadi CV. Surya Pangan dan terus berkembang hingga membuka cabang baru di Munggu pada April 2023!" 
                : "Surya Pangan was founded in 2010. Since 2013 we grew into CV. Surya Pangan and recently opened our Munggu branch in April 2023!";
        }

        // Products & Brands
        if (res.products.some(word => lowerInput.includes(word))) {
            return lang === 'id' 
                ? "Kami mendistribusikan bahan kue, cetakan, dan perlengkapan bakery dari brand ternama seperti Anchor, Wilmar, Colatta, Rose Brand, Goldenfil, Emina Cheese, dan banyak lagi!" 
                : "We distribute bakery ingredients and tools from top brands like Anchor, Wilmar, Colatta, Rose Brand, Goldenfil, Emina Cheese, and many more!";
        }

        // Location & Branches
        if (res.location.some(word => lowerInput.includes(word))) {
            return lang === 'id' 
                ? "Pusat kami di Jl. Mahendradatta No.18A-B, Denpasar. Kami juga punya cabang di Munggu (area Badung) yang buka sejak April 2023 untuk melayani area tersebut dan sekitarnya." 
                : "Our main office is at Jl. Mahendradatta No.18A-B, Denpasar. We also have a branch in Munggu opening since April 2023!";
        }

        // Coverage & Delivery
        if (res.coverage.some(word => lowerInput.includes(word))) {
            return lang === 'id' 
                ? "Kami melayani pengiriman ke SELURUH area Bali. Bahkan sekarang sudah ekspansi kirim ke Lombok dan Sumbawa melalui jasa ekspedisi profesional!" 
                : "We deliver to ALL areas of Bali, and have expanded our range to Lombok and Sumbawa via expert expedition services!";
        }

        // Customers
        if (res.customers.some(word => lowerInput.includes(word))) {
            return lang === 'id' 
                ? "Saat ini kami dipercaya oleh sekitar 2000 pelanggan, mulai dari toko ritel, UMKM, hingga sektor HORECA (Hotel, Restaurant, Cafe) di Bali." 
                : "Currently, we are trusted by around 2,000 customers, ranging from retail shops, SMEs, to the HORECA sector (Hotel, Restaurant, Cafe) in Bali.";
        }

        // Chef & Recommendation
        if (res.chef.some(word => lowerInput.includes(word))) {
            return lang === 'id' 
                ? "Untuk hasil premium, saya sarankan pakai Mentega Anchor, Cokelat Colatta, atau Selai Goldenfil. Kami juga punya tepung dari Wilmar dan keju dari Emina untuk kreasimu!" 
                : "For premium results, I recommend using Anchor Butter, Colatta Chocolate, or Goldenfil Jam. We also have Wilmar flour and Emina cheese for your creations!";
        }

        // Thanks
        if (res.thanks.some(word => lowerInput.includes(word))) {
            return lang === 'id' ? "Sama-sama! Senang bisa melayani." : "You're welcome! Happy to serve.";
        }

        return res.default;
    };

    // Handle Sending Message
    const handleSend = () => {
        const text = chefInput.value.trim();
        if (!text) return;

        const lang = getCurrentLang();
        addMessage(text, 'user');
        chefInput.value = '';

        // Typing indicator
        chefTyping.style.display = 'block';
        
        setTimeout(() => {
            chefTyping.style.display = 'none';
            const response = getBotResponse(text, lang);
            addMessage(response, 'bot');
        }, 1000 + Math.random() * 1000); // 1-2s delay
    };

    if (chefSend) chefSend.addEventListener('click', handleSend);
    if (chefInput) {
        chefInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }

    // Update placeholders based on language changes
    const observer = new MutationObserver(() => {
        const lang = getCurrentLang();
        const placeholder = translations[lang]["chef.chat.placeholder"];
        if (placeholder) chefInput.placeholder = placeholder;
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
});
