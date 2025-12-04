// Manager Dashboard JavaScript

// Check manager authentication
function checkManagerAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                       JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser || !currentUser.isManager) {
        // Not manager, redirect to login
        window.location.href = 'login.html';
        return null;
    }
    
    return currentUser;
}

// Initialize dashboard
function initDashboard() {
    const manager = checkManagerAuth();
    if (!manager) return;

    // Update manager name
    document.getElementById('managerName').textContent = manager.name;

    // Load and display stats
    updateStats();
}

function updateStats() {
    // Get admin count
    const admins = JSON.parse(localStorage.getItem('admins')) || [];
    document.getElementById('totalAdmins').textContent = `${admins.length} Admins`;

    // Get restock items count
    const restockItems = JSON.parse(localStorage.getItem('restockItems')) || [];
    document.getElementById('restockCount').textContent = `${restockItems.length} Items`;

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
    
    // Update users card badge
    const totalUsersCard = document.getElementById('totalUsersCard');
    if (totalUsersCard) {
        totalUsersCard.textContent = `${users.length} Users`;
    }

    // Get reservations
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    document.getElementById('totalReservations').textContent = `${reservations.length} Total`;
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
