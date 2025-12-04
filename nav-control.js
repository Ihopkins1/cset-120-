// Check if user is logged in and show/hide order history link
(function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                       JSON.parse(sessionStorage.getItem('currentUser'));
    
    const orderHistoryNav = document.getElementById('orderHistoryNav');
    
    // Only show order history if user is logged in and NOT admin/manager
    if (currentUser && !currentUser.isAdmin && !currentUser.isManager) {
        if (orderHistoryNav) {
            orderHistoryNav.style.display = 'list-item';
        }
    }
})();
