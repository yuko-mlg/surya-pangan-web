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
                greetings: ["halo", "hi", "siang", "pagi", "malam"],
                products: ["produk", "bahan", "jual", "brand"],
                location: ["lokasi", "alamat", "dimana", "cabang"],
                hours: ["jam", "buka", "tutup", "minggu"],
                chef: ["resep", "masak", "chef", "kue", "bikin"],
                thanks: ["terima kasih", "thanks", "makasih"],
                default: "Maaf, saya masih belajar. Bisa hubungi CS kami via WhatsApp untuk respon lebih cepat, ya!"
            },
            en: {
                greetings: ["hello", "hi", "hey", "morning", "afternoon"],
                products: ["product", "ingredient", "sell", "brand"],
                location: ["location", "address", "where", "branch"],
                hours: ["hour", "open", "close", "sunday"],
                chef: ["recipe", "cook", "chef", "bake", "cake"],
                thanks: ["thank you", "thanks"],
                default: "I'm still learning. Feel free to contact our CS via WhatsApp for faster response!"
            }
        };

        const res = responses[lang];

        if (res.greetings.some(word => lowerInput.includes(word))) {
            return lang === 'id' ? "Halo! Ada yang bisa saya bantu?" : "Hello! How can I help you today?";
        }
        if (res.products.some(word => lowerInput.includes(word))) {
            return lang === 'id' ? "Kami distributor resmi Anchor, Wilmar, Colatta, dan brand premium lainnya. Produk kami lengkap mulai dari tepung, mentega, hingga cokelat." : "We are an official distributor for Anchor, Wilmar, Colatta, and other premium brands. Our products range from flour and butter to chocolate.";
        }
        if (res.location.some(word => lowerInput.includes(word))) {
            return lang === 'id' ? "Pusat kami ada di Jl. Mahendradatta No.18A-B, Denpasar. Kami juga punya cabang di Munggu!" : "Our main office is at Jl. Mahendradatta No.18A-B, Denpasar. We also have a branch in Munggu!";
        }
        if (res.hours.some(word => lowerInput.includes(word))) {
            return lang === 'id' ? "Kami buka Senin-Sabtu jam 08:00 - 17:00. Hari Minggu kami libur." : "We are open Monday-Saturday from 08:00 AM to 05:00 PM. We are closed on Sundays.";
        }
        if (res.chef.some(word => lowerInput.includes(word))) {
            return lang === 'id' ? "Wah, mau bikin sesuatu yang enak ya? Gunakan mentega Anchor & cokelat Colatta agar hasilnya premium khas Surya Pangan!" : "Planning to bake something delicious? Use Anchor butter & Colatta chocolate for that premium Surya Pangan result!";
        }
        if (res.thanks.some(word => lowerInput.includes(word))) {
            return lang === 'id' ? "Sama-sama! Senang bisa membantu." : "You're welcome! Glad I could help.";
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
                ? "Boz Yuko minta rekomendasi resep premium dong!" 
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
