// Admin Orders Management JavaScript

let currentFilter = 'all';

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

// Load and display orders
function loadOrders(filter = 'all') {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const container = document.getElementById('ordersContainer');
    
    container.innerHTML = '';
    
    // Filter orders
    let filteredOrders = orders;
    if (filter !== 'all') {
        filteredOrders = orders.filter(order => order.status === filter);
    }
    
    // Sort by date (newest first)
    filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (filteredOrders.length === 0) {
        container.innerHTML = `
            <div class="empty-orders">
                <div class="card-icon">📦</div>
                <p>No orders found</p>
            </div>
        `;
        return;
    }
    
    // Display orders
    filteredOrders.forEach(order => {
        container.appendChild(createOrderCard(order));
    });
}

// Create order card element
function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'order-card';
    
    const date = new Date(order.date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const itemsList = order.items.map(item => 
        `<li><span>${item.quantity}x ${item.name}</span><span>$${(item.price * item.quantity).toFixed(2)}</span></li>`
    ).join('');
    
    // Determine which action buttons to show
    let actionButtons = '';
    if (order.status === 'pending') {
        actionButtons = `
            <button class="status-btn processing" onclick="updateOrderStatus('${order.id}', 'processing')">Mark as Processing</button>
            <button class="status-btn cancelled" onclick="updateOrderStatus('${order.id}', 'cancelled')">Cancel Order</button>
        `;
    } else if (order.status === 'processing') {
        actionButtons = `
            <button class="status-btn finished" onclick="updateOrderStatus('${order.id}', 'finished')">Mark as Finished</button>
            <button class="status-btn cancelled" onclick="updateOrderStatus('${order.id}', 'cancelled')">Cancel Order</button>
        `;
    }
    
    card.innerHTML = `
        <div class="order-header">
            <div>
                <div class="order-id">Order #${order.id.slice(0, 8).toUpperCase()}</div>
                <div class="order-date">${date}</div>
            </div>
            <span class="order-status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
        </div>
        
        <div class="order-customer">
            <h4>Customer Information</h4>
            <p>${order.customerName || 'Guest'}</p>
            ${order.customerEmail ? `<p>${order.customerEmail}</p>` : ''}
        </div>
        
        <div class="order-items">
            <h4>Order Items</h4>
            <ul>${itemsList}</ul>
        </div>
        
        <div class="order-total">Total: $${order.total.toFixed(2)}</div>
        
        ${actionButtons ? `<div class="order-actions">${actionButtons}</div>` : ''}
    `;
    
    return card;
}

// Update order status
function updateOrderStatus(orderId, newStatus) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        orders[orderIndex].statusUpdatedAt = new Date().toISOString();
        localStorage.setItem('orders', JSON.stringify(orders));
        
        loadOrders(currentFilter);
        showNotification(`Order status updated to ${newStatus}`, 'success');
    }
}

// Filter button handlers
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Load filtered orders
        currentFilter = btn.dataset.status;
        loadOrders(currentFilter);
    });
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
checkAdminAuth();
loadOrders();
