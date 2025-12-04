// Manager Admins Management JavaScript

// Check manager auth
function checkManagerAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                       JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser || !currentUser.isManager) {
        window.location.href = 'login.html';
        return null;
    }
    return currentUser;
}

// Load and display admins
function loadAdmins() {
    const admins = JSON.parse(localStorage.getItem('admins')) || [];
    const container = document.getElementById('adminsContainer');
    
    container.innerHTML = '';
    
    if (admins.length === 0) {
        container.innerHTML = `
            <div class="empty-users">
                <div class="card-icon">🔐</div>
                <p>No admin accounts found</p>
            </div>
        `;
        return;
    }
    
    // Display admins
    admins.forEach(admin => {
        container.appendChild(createAdminCard(admin));
    });
}

// Create admin card element
function createAdminCard(admin) {
    const card = document.createElement('div');
    card.className = 'user-card';
    
    card.innerHTML = `
        <div class="user-info">
            <div class="user-name">Admin Account</div>
            <div class="user-email">${admin.email}</div>
            <div class="user-date">Password: ${'•'.repeat(admin.password.length)}</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
            <div class="user-badge" style="background: linear-gradient(135deg, #f39c12, #e67e22);">Admin</div>
            <button class="delete-btn" onclick="deleteAdmin('${admin.email}')">Delete</button>
        </div>
    `;
    
    return card;
}

// Delete admin function
function deleteAdmin(adminEmail) {
    if (!confirm(`Are you sure you want to delete admin account: ${adminEmail}?\n\nThis will remove their admin access immediately.`)) {
        return;
    }
    
    let admins = JSON.parse(localStorage.getItem('admins')) || [];
    
    if (admins.length === 1) {
        showNotification('Cannot delete the last admin account!', 'error');
        return;
    }
    
    admins = admins.filter(admin => admin.email !== adminEmail);
    localStorage.setItem('admins', JSON.stringify(admins));
    
    loadAdmins();
    showNotification('Admin account deleted successfully!', 'success');
}

// Add new admin
document.getElementById('addAdminForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    // Validate
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long.', 'error');
        return;
    }
    
    let admins = JSON.parse(localStorage.getItem('admins')) || [];
    
    // Check if admin already exists
    if (admins.find(a => a.email === email)) {
        showNotification('An admin with this email already exists.', 'error');
        return;
    }
    
    // Add new admin
    const newAdmin = {
        email: email,
        password: password
    };
    
    admins.push(newAdmin);
    localStorage.setItem('admins', JSON.stringify(admins));
    
    // Reset form
    document.getElementById('addAdminForm').reset();
    
    // Reload admins
    loadAdmins();
    
    showNotification('Admin account created successfully!', 'success');
});

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
checkManagerAuth();
loadAdmins();
