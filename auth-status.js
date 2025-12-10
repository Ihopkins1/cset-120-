// Auth Status - Updates navbar based on login status across all pages

(function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                       JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (currentUser) {
        // User is logged in, update navbar
        const navLogin = document.querySelector('.nav-login');
        if (navLogin) {
            // Show first name and make it a link to logout or profile
            navLogin.textContent = `Hi, ${currentUser.name.split(' ')[0]}`;
            navLogin.href = '#';
            
            // Add logout functionality
            navLogin.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Do you want to logout?')) {
                    localStorage.removeItem('currentUser');
                    sessionStorage.removeItem('currentUser');
                    window.location.href = 'login.html';
                }
            });
        }
        
        // Show order history link for regular users (handled by nav-control.js)
    }
})();
