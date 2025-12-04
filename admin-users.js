// Admin Users Management JavaScript

// Check admin auth
function checkAdminAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                       JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser || !currentUser.isAdmin) {
        window.location.href = 'login.html';
        return null;
    }
    return currentUser;
}

// Load and display users
function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const container = document.getElementById('usersContainer');
    
    container.innerHTML = '';
    
    if (users.length === 0) {
        container.innerHTML = `
            <div class="empty-users">
                <div class="card-icon">👤</div>
                <p>No registered users found</p>
            </div>
        `;
        return;
    }
    
    // Sort by registration date (newest first)
    users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Display users
    users.forEach(user => {
        container.appendChild(createUserCard(user));
    });
}

// Create user card element
function createUserCard(user) {
    const card = document.createElement('div');
    card.className = 'user-card';
    
    const registrationDate = new Date(user.createdAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    card.innerHTML = `
        <div class="user-info">
            <div class="user-name">${user.name}</div>
            <div class="user-email">${user.email}</div>
            <div class="user-date">Registered: ${registrationDate}</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
            <div class="user-badge">Customer</div>
            <button class="delete-btn" onclick="deleteUser('${user.email}')">Delete</button>
        </div>
    `;
    
    return card;
}

// Delete user function
function deleteUser(userEmail) {
    if (!confirm(`Are you sure you want to delete user: ${userEmail}?\n\nThis will remove their account and cannot be undone.`)) {
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.filter(user => user.email !== userEmail);
    localStorage.setItem('users', JSON.stringify(users));
    
    loadUsers();
    showNotification('User deleted successfully!', 'success');
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: #fff;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
});

// Initialize on page load
checkAdminAuth();
loadUsers();
