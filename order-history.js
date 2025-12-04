// Customer Order History JavaScript

// Check if user is logged in
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                       JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser || currentUser.isAdmin) {
        // Redirect to login if not logged in or if admin
        alert('Please login to view your order history');
        window.location.href = 'login.html';
        return null;
    }
    
    return currentUser;
}

// Load user's orders
function loadMyOrders(userEmail) {
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const container = document.getElementById('ordersContainer');
    
    // Filter orders for this user
    const myOrders = allOrders.filter(order => order.customerEmail === userEmail);
    
    container.innerHTML = '';
    
    if (myOrders.length === 0) {
        container.innerHTML = `
            <div class="empty-orders">
                <div class="card-icon">📦</div>
                <p>No orders yet. <a href="menu.html" style="color: #f39c12;">Browse our menu</a> to place your first order!</p>
            </div>
        `;
        return;
    }
    
    // Sort by date (newest first)
    myOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Display orders
    myOrders.forEach(order => {
        container.appendChild(createOrderCard(order));
    });
}

// Create order card
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
    
    card.innerHTML = `
        <div class="order-header">
            <div>
                <div class="order-id">Order #${order.id.slice(0, 8).toUpperCase()}</div>
                <div class="order-date">${date}</div>
            </div>
            <span class="order-status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
        </div>
        
        <div class="order-items">
            <h4>Order Items</h4>
            <ul>${itemsList}</ul>
        </div>
        
        <div class="order-total">Total: $${order.total.toFixed(2)}</div>
    `;
    
    return card;
}

// Load user's reservations
function loadMyReservations(userEmail) {
    const allReservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const container = document.getElementById('reservationsContainer');
    
    // Filter reservations for this user
    const myReservations = allReservations.filter(res => res.email === userEmail);
    
    container.innerHTML = '';
    
    if (myReservations.length === 0) {
        container.innerHTML = `
            <div class="empty-reservations">
                <div class="card-icon">📅</div>
                <p>No reservations yet. <a href="reservations.html" style="color: #f39c12;">Make a reservation</a> to secure your table!</p>
            </div>
        `;
        return;
    }
    
    // Sort by date (newest first)
    myReservations.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
    // Display reservations
    myReservations.forEach(reservation => {
        container.appendChild(createReservationCard(reservation));
    });
}

// Create reservation card
function createReservationCard(reservation) {
    const card = document.createElement('div');
    card.className = 'reservation-card';
    
    const submittedDate = new Date(reservation.submittedAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const reservationDate = new Date(reservation.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    card.innerHTML = `
        <div class="reservation-header">
            <div class="reservation-name">${reservation.name}</div>
            <div class="reservation-date-badge">${reservationDate}</div>
        </div>
        
        <div class="reservation-details">
            <div class="detail-item">
                <span class="detail-label">Phone</span>
                <span class="detail-value">${reservation.phone}</span>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">Time</span>
                <span class="detail-value highlight">${reservation.time}</span>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">Party Size</span>
                <span class="detail-value highlight">${reservation.guests} ${reservation.guests === 1 ? 'Guest' : 'Guests'}</span>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">Submitted</span>
                <span class="detail-value">${submittedDate}</span>
            </div>
        </div>
        
        ${reservation.message ? `
            <div class="reservation-message">
                <p><strong>Special Requests:</strong> ${reservation.message}</p>
            </div>
        ` : ''}
    `;
    
    return card;
}

// Initialize page
const user = checkAuth();
if (user) {
    document.getElementById('welcomeMessage').textContent = `Welcome back, ${user.name}!`;
    loadMyOrders(user.email);
    loadMyReservations(user.email);
}
