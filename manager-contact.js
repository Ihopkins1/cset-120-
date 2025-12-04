// Manager Contact Messages JavaScript

// Check manager authentication
function checkManagerAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                       JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser || !currentUser.isManager) {
        window.location.href = 'login.html';
        return null;
    }
    
    return currentUser;
}

let currentFilter = 'all';

// Load messages from localStorage
function loadMessages(filter = 'all') {
    currentFilter = filter;
    const contactMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    const messagesContainer = document.getElementById('messagesContainer');
    const emptyState = document.getElementById('emptyState');

    // Filter messages
    let filteredMessages = contactMessages;
    if (filter === 'unread') {
        filteredMessages = contactMessages.filter(msg => msg.status === 'unread');
    } else if (filter === 'read') {
        filteredMessages = contactMessages.filter(msg => msg.status === 'read');
    }

    // Sort by newest first
    filteredMessages.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    if (filteredMessages.length === 0) {
        messagesContainer.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    messagesContainer.innerHTML = filteredMessages.map(msg => createMessageCard(msg)).join('');

    // Add event listeners to buttons
    document.querySelectorAll('.mark-read-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const messageId = parseInt(btn.dataset.id);
            toggleMessageStatus(messageId);
        });
    });

    document.querySelectorAll('.delete-msg-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const messageId = parseInt(btn.dataset.id);
            deleteMessage(messageId);
        });
    });
}

// Create message card HTML
function createMessageCard(message) {
    const date = new Date(message.submittedAt);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const statusClass = message.status === 'unread' ? 'unread' : 'read';
    const statusIcon = message.status === 'unread' ? '🔵' : '✅';
    const buttonText = message.status === 'unread' ? 'Mark as Read' : 'Mark as Unread';

    return `
        <div class="message-card ${statusClass}">
            <div class="message-header">
                <div class="message-info">
                    <h3>${statusIcon} ${message.name}</h3>
                    <p class="message-email">📧 ${message.email}</p>
                </div>
                <span class="message-date">${formattedDate}</span>
            </div>
            <div class="message-subject">
                <strong>Subject:</strong> ${message.subject}
            </div>
            <div class="message-content">
                <p>${message.message}</p>
            </div>
            <div class="message-actions">
                <button class="action-btn mark-read-btn" data-id="${message.id}">
                    ${buttonText}
                </button>
                <button class="action-btn delete-btn delete-msg-btn" data-id="${message.id}">
                    Delete
                </button>
            </div>
        </div>
    `;
}

// Toggle message status between read/unread
function toggleMessageStatus(messageId) {
    let contactMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    
    const messageIndex = contactMessages.findIndex(msg => msg.id === messageId);
    if (messageIndex !== -1) {
        contactMessages[messageIndex].status = 
            contactMessages[messageIndex].status === 'unread' ? 'read' : 'unread';
        
        localStorage.setItem('contactMessages', JSON.stringify(contactMessages));
        loadMessages(currentFilter);
    }
}

// Delete a message
function deleteMessage(messageId) {
    if (!confirm('Are you sure you want to delete this message?')) {
        return;
    }

    let contactMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    contactMessages = contactMessages.filter(msg => msg.id !== messageId);
    
    localStorage.setItem('contactMessages', JSON.stringify(contactMessages));
    
    // Show success message
    showNotification('Message deleted successfully!');
    
    loadMessages(currentFilter);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Filter button functionality
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        loadMessages(filter);
    });
});

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
});

// Initialize
checkManagerAuth();
loadMessages();
