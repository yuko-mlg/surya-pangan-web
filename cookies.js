document.addEventListener('DOMContentLoaded', () => {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');

    // Check if user already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');

    if (!cookiesAccepted) {
        // Show banner with a slight delay for better UX
        setTimeout(() => {
            cookieBanner.classList.add('active');
        }, 2000);
    }

    acceptBtn.addEventListener('click', () => {
        // Save to localStorage
        localStorage.setItem('cookiesAccepted', 'true');
        
        // Hide banner
        cookieBanner.classList.remove('active');
    });
});
