// Admin Dashboard JavaScript

// Check admin authentication
function checkAdminAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                       JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser || !currentUser.isAdmin) {
        // Not admin, redirect to login
        window.location.href = 'login.html';
        return null;
    }
    
    return currentUser;
}

// Initialize dashboard
function initDashboard() {
    const admin = checkAdminAuth();
    if (!admin) return;

    // Update admin name
    document.getElementById('adminName').textContent = admin.name;

    // Load and display stats
    updateStats();
}

function updateStats() {
    // Get menu items
    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    document.getElementById('totalMenuItems').textContent = menuItems.length;

    // Get orders
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    document.getElementById('totalOrders').textContent = orders.length;

    // Count pending orders
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    document.getElementById('pendingOrders').textContent = `${pendingOrders} Pending`;

    // Get users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    document.getElementById('totalUsers').textContent = users.length;
    
    // Update users card badge if it exists
    const totalUsersCard = document.getElementById('totalUsersCard');
    if (totalUsersCard) {
        totalUsersCard.textContent = `${users.length} Users`;
    }

    // Get reservations
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    document.getElementById('totalReservations').textContent = `${reservations.length} Total`;

    // Get contact messages - count unread
    const contactMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    const unreadMessages = contactMessages.filter(msg => msg.status === 'unread').length;
    document.getElementById('unreadMessages').textContent = `${unreadMessages} Unread`;
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    
    // Clear user session
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    
    // Redirect to login
    window.location.href = 'login.html';
});

// Initialize on page load
initDashboard();
