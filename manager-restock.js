// Manager Restock Board JavaScript

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

// Load and display restock items
function loadRestockItems() {
    const items = JSON.parse(localStorage.getItem('restockItems')) || [];
    
    // Clear all lists
    document.getElementById('highPriorityList').innerHTML = '';
    document.getElementById('mediumPriorityList').innerHTML = '';
    document.getElementById('lowPriorityList').innerHTML = '';
    
    // Group items by priority
    const highPriority = items.filter(item => item.priority === 'high');
    const mediumPriority = items.filter(item => item.priority === 'medium');
    const lowPriority = items.filter(item => item.priority === 'low');
    
    // Display high priority
    if (highPriority.length > 0) {
        highPriority.forEach(item => {
            document.getElementById('highPriorityList').appendChild(createRestockCard(item));
        });
    } else {
        document.getElementById('highPriorityList').innerHTML = '<p class="empty-message">No high priority items</p>';
    }
    
    // Display medium priority
    if (mediumPriority.length > 0) {
        mediumPriority.forEach(item => {
            document.getElementById('mediumPriorityList').appendChild(createRestockCard(item));
        });
    } else {
        document.getElementById('mediumPriorityList').innerHTML = '<p class="empty-message">No medium priority items</p>';
    }
    
    // Display low priority
    if (lowPriority.length > 0) {
        lowPriority.forEach(item => {
            document.getElementById('lowPriorityList').appendChild(createRestockCard(item));
        });
    } else {
        document.getElementById('lowPriorityList').innerHTML = '<p class="empty-message">No low priority items</p>';
    }
}

// Create restock card element
function createRestockCard(item) {
    const card = document.createElement('div');
    card.className = 'menu-item-card';
    
    const addedDate = new Date(item.addedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    card.innerHTML = `
        <div class="item-info">
            <h4>${item.name}</h4>
            <p><strong>Quantity:</strong> ${item.quantity}</p>
            ${item.notes ? `<p><strong>Notes:</strong> ${item.notes}</p>` : ''}
            <p style="color: rgba(255, 255, 255, 0.5); font-size: 12px;">Added: ${addedDate}</p>
        </div>
        <div class="item-actions">
            <button class="delete-btn" onclick="deleteRestockItem(${item.id})">Mark as Ordered</button>
        </div>
    `;
    
    return card;
}

// Delete restock item
function deleteRestockItem(itemId) {
    if (!confirm('Mark this item as ordered and remove from restock list?')) {
        return;
    }
    
    let items = JSON.parse(localStorage.getItem('restockItems')) || [];
    items = items.filter(item => item.id !== itemId);
    localStorage.setItem('restockItems', JSON.stringify(items));
    
    loadRestockItems();
    showNotification('Item marked as ordered!', 'success');
}

// Add new restock item
document.getElementById('addRestockForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('itemName').value;
    const quantity = document.getElementById('itemQuantity').value;
    const priority = document.getElementById('itemPriority').value;
    const notes = document.getElementById('itemNotes').value;
    
    const newItem = {
        id: Date.now(),
        name: name,
        quantity: quantity,
        priority: priority,
        notes: notes,
        addedAt: new Date().toISOString()
    };
    
    let items = JSON.parse(localStorage.getItem('restockItems')) || [];
    items.push(newItem);
    localStorage.setItem('restockItems', JSON.stringify(items));
    
    // Reset form
    document.getElementById('addRestockForm').reset();
    
    // Reload items
    loadRestockItems();
    
    showNotification('Item added to restock list!', 'success');
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
loadRestockItems();
