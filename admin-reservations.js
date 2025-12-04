// Admin Reservations Management JavaScript

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

// Load and display reservations
function loadReservations() {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const container = document.getElementById('reservationsContainer');
    
    container.innerHTML = '';
    
    if (reservations.length === 0) {
        container.innerHTML = `
            <div class="empty-reservations">
                <div class="card-icon">📅</div>
                <p>No reservations found</p>
            </div>
        `;
        return;
    }
    
    // Sort by date (newest first)
    reservations.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
    // Display reservations
    reservations.forEach(reservation => {
        container.appendChild(createReservationCard(reservation));
    });
}

// Create reservation card element
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
    
    // Create unique ID for reservation if it doesn't exist
    const reservationId = reservation.id || `${reservation.email}-${reservation.submittedAt}`;
    
    card.innerHTML = `
        <div class="reservation-header">
            <div class="reservation-name">${reservation.name}</div>
            <div class="reservation-date-badge">${reservationDate}</div>
        </div>
        
        <div class="reservation-details">
            <div class="detail-item">
                <span class="detail-label">Email</span>
                <span class="detail-value">${reservation.email}</span>
            </div>
            
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
        
        <div style="margin-top: 15px; text-align: right;">
            <button class="delete-btn" onclick="deleteReservation('${reservationId.replace(/'/g, "\\'")}')">Delete Reservation</button>
        </div>
    `;
    
    return card;
}

// Delete reservation function
function deleteReservation(reservationId) {
    if (!confirm('Are you sure you want to delete this reservation?\n\nThis action cannot be undone.')) {
        return;
    }
    
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    
    // Filter out the reservation by matching the ID
    reservations = reservations.filter(res => {
        const resId = res.id || `${res.email}-${res.submittedAt}`;
        return resId !== reservationId;
    });
    
    localStorage.setItem('reservations', JSON.stringify(reservations));
    
    loadReservations();
    showNotification('Reservation deleted successfully!', 'success');
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
loadReservations();
