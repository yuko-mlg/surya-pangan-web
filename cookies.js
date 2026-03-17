const cookieBanner = document.getElementById('cookie-banner');
const cookieOverlay = document.getElementById('cookie-overlay');
const acceptBtn = document.getElementById('accept-cookies');

if (cookieBanner && cookieOverlay && acceptBtn) {
    // Check if user already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');

    if (!cookiesAccepted) {
        // Show modal and overlay with a slight delay
        setTimeout(() => {
            cookieBanner.classList.add('active');
            cookieOverlay.classList.add('active');
            // Prevent scrolling when modal is active
            document.body.style.overflow = 'hidden';
        }, 1000);
    }

    acceptBtn.addEventListener('click', () => {
        // Save to localStorage
        localStorage.setItem('cookiesAccepted', 'true');
        
        // Hide modal and overlay
        cookieBanner.classList.remove('active');
        cookieOverlay.classList.remove('active');
        // Restore scrolling
        document.body.style.overflow = '';
    });
}

