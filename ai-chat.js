import { translations } from './translations.js';

document.addEventListener('DOMContentLoaded', () => {
    const aiTrigger = document.getElementById('ai-chat-trigger');
    const aiWindow = document.getElementById('ai-chat-window');
    const aiClose = document.getElementById('ai-chat-close');
    const aiMessages = document.getElementById('ai-chat-messages');
    const aiInput = document.getElementById('ai-chat-input');
    const aiSend = document.getElementById('ai-chat-send');
    const aiTyping = document.getElementById('ai-chat-typing');
    const chefTrigger = document.getElementById('chef-trigger');

    // Get current language from main app or localStorage
    const getCurrentLang = () => localStorage.getItem('language') || 'id';

    // Toggle Chat Window
    const toggleChat = () => {
        aiWindow.classList.toggle('active');
        if (aiWindow.classList.contains('active')) {
            aiInput.focus();
        }
    };

    aiTrigger.addEventListener('click', toggleChat);
    aiClose.addEventListener('click', toggleChat);

    // Add Message to UI
    const addMessage = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}`;
        messageDiv.innerHTML = `<div class="ai-message-bubble">${text}</div>`;
        aiMessages.appendChild(messageDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
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
            return lang === 'id' ? "Halo! Saya Surya Assistant, siap membantu info seputar Surya Pangan." : "Hello! I am Surya Assistant, ready to help with info about Surya Pangan.";
        }

        // History
        if (res.history.some(word => lowerInput.includes(word))) {
            return lang === 'id' 
                ? "Surya Pangan berdiri sejak 2010 (awalnya UD. Pangan Mulia Lestari). Sejak 2013 kami menjadi CV. Surya Pangan dan terus berkembang hingga membuka cabang di Canggu pada April 2023!" 
                : "Surya Pangan was founded in 2010. Since 2013 we grew into CV. Surya Pangan and recently opened our Canggu branch in April 2023!";
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
                ? "Pusat kami di Jl. Mahendradatta No.18A-B, Denpasar. Kami juga punya cabang retail di Canggu (area Badung) yang buka sejak April 2023 untuk melayani area Seminyak & sekitarnya." 
                : "Our main office is at Jl. Mahendradatta No.18A-B, Denpasar. We also have a retail branch in Canggu opening since April 2023!";
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
        const text = aiInput.value.trim();
        if (!text) return;

        const lang = getCurrentLang();
        addMessage(text, 'user');
        aiInput.value = '';

        // Typing indicator
        aiTyping.style.display = 'block';
        
        setTimeout(() => {
            aiTyping.style.display = 'none';
            const response = getBotResponse(text, lang);
            addMessage(response, 'bot');
        }, 1000 + Math.random() * 1000); // 1-2s delay
    };

    aiSend.addEventListener('click', handleSend);
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // Surya Chef Section Trigger
    if (chefTrigger) {
        chefTrigger.addEventListener('click', () => {
            if (!aiWindow.classList.contains('active')) {
                toggleChat();
            }
            const lang = getCurrentLang();
            const surpriseText = lang === 'id' 
                ? "Minta rekomendasi resep premium dong!" 
                : "Give me some premium recipe recommendations!";
            
            aiInput.value = surpriseText;
            handleSend();
        });
    }

    // Update placeholders based on language changes
    const observer = new MutationObserver(() => {
        const lang = getCurrentLang();
        const placeholder = translations[lang]["ai.chat.placeholder"];
        if (placeholder) aiInput.placeholder = placeholder;
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
});
