// Admin Menu Management JavaScript

// Check admin auth (reuse from admin.js)
function checkAdminAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                       JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser || !currentUser.isAdmin) {
        window.location.href = 'login.html';
        return null;
    }
    return currentUser;
}

// Initialize menu items in localStorage if not exists
function initializeMenuItems() {
    let menuItems = JSON.parse(localStorage.getItem('menuItems'));
    
    if (!menuItems || menuItems.length === 0) {
        // Default menu items from the current menu
        menuItems = [
            // Cocktails
            { id: Date.now() + 1, name: "Power-Up Punch", price: 12.99, category: "cocktails", description: "Rum, tropical juices, and a citrus kick" },
            { id: Date.now() + 2, name: "Boss Battle Bourbon", price: 14.99, category: "cocktails", description: "Smooth bourbon with bitters and orange zest" },
            { id: Date.now() + 3, name: "Combo Breaker Cosmo", price: 11.99, category: "cocktails", description: "Vodka, cranberry, lime, triple sec" },
            { id: Date.now() + 4, name: "Level Up Lemonade", price: 9.99, category: "cocktails", description: "Vodka, fresh lemonade, mint" },
            { id: Date.now() + 5, name: "Critical Hit Margarita", price: 13.99, category: "cocktails", description: "Tequila, lime, triple sec, salt rim" },
            { id: Date.now() + 6, name: "Respawn Rum Runner", price: 12.99, category: "cocktails", description: "Dark rum, banana liqueur, blackberry" },
            { id: Date.now() + 7, name: "Achievement Unlocked Mojito", price: 11.99, category: "cocktails", description: "White rum, mint, lime, soda" },
            { id: Date.now() + 8, name: "Game Over Old Fashioned", price: 15.99, category: "cocktails", description: "Whiskey, sugar, bitters, orange" },
            
            // Beers
            { id: Date.now() + 9, name: "1-Up IPA", price: 7.99, category: "beers", description: "Hoppy and citrusy craft IPA" },
            { id: Date.now() + 10, name: "High Score Stout", price: 8.99, category: "beers", description: "Rich and creamy chocolate stout" },
            { id: Date.now() + 11, name: "Pixel Pilsner", price: 6.99, category: "beers", description: "Crisp and refreshing lager" },
            
            // Food
            { id: Date.now() + 12, name: "Boss Burger", price: 16.99, category: "food", description: "Double patty, bacon, cheese, special sauce" },
            { id: Date.now() + 13, name: "Power Pellet Pizza", price: 18.99, category: "food", description: "Personal pizza with your choice of toppings" },
            { id: Date.now() + 14, name: "Bonus Round Buffalo Wings", price: 14.99, category: "food", description: "Crispy wings with buffalo sauce" },
            { id: Date.now() + 15, name: "Checkpoint Nachos", price: 13.99, category: "food", description: "Loaded nachos with all the fixings" },
            { id: Date.now() + 16, name: "Side Quest Sliders", price: 12.99, category: "food", description: "Three mini burgers with fries" }
        ];
        
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
    }
    
    return menuItems;
}

// Load and display menu items
function loadMenuItems() {
    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    
    // Clear all lists
    document.getElementById('cocktailsList').innerHTML = '';
    document.getElementById('beersList').innerHTML = '';
    document.getElementById('foodList').innerHTML = '';
    
    // Group items by category
    const cocktails = menuItems.filter(item => item.category === 'cocktails');
    const beers = menuItems.filter(item => item.category === 'beers');
    const food = menuItems.filter(item => item.category === 'food');
    
    // Display cocktails
    if (cocktails.length > 0) {
        cocktails.forEach(item => {
            document.getElementById('cocktailsList').appendChild(createMenuItemCard(item));
        });
    } else {
        document.getElementById('cocktailsList').innerHTML = '<p class="empty-message">No cocktails added yet</p>';
    }
    
    // Display beers
    if (beers.length > 0) {
        beers.forEach(item => {
            document.getElementById('beersList').appendChild(createMenuItemCard(item));
        });
    } else {
        document.getElementById('beersList').innerHTML = '<p class="empty-message">No beers added yet</p>';
    }
    
    // Display food
    if (food.length > 0) {
        food.forEach(item => {
            document.getElementById('foodList').appendChild(createMenuItemCard(item));
        });
    } else {
        document.getElementById('foodList').innerHTML = '<p class="empty-message">No food items added yet</p>';
    }
}

// Create menu item card element
function createMenuItemCard(item) {
    const card = document.createElement('div');
    card.className = 'menu-item-card';
    
    card.innerHTML = `
        <div class="item-info">
            <h4>${item.name}</h4>
            ${item.description ? `<p>${item.description}</p>` : ''}
            <span class="item-price">$${item.price.toFixed(2)}</span>
        </div>
        <div class="item-actions">
            <button class="delete-btn" onclick="deleteMenuItem(${item.id})">Delete</button>
        </div>
    `;
    
    return card;
}

// Delete menu item
function deleteMenuItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }
    
    let menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    menuItems = menuItems.filter(item => item.id !== itemId);
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    
    loadMenuItems();
    showNotification('Item deleted successfully!', 'success');
}

// Add new menu item
document.getElementById('addMenuItemForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('itemName').value;
    const price = parseFloat(document.getElementById('itemPrice').value);
    const category = document.getElementById('itemCategory').value;
    const description = document.getElementById('itemDescription').value;
    
    const newItem = {
        id: Date.now(),
        name: name,
        price: price,
        category: category,
        description: description
    };
    
    let menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    menuItems.push(newItem);
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    
    // Reset form
    document.getElementById('addMenuItemForm').reset();
    
    // Reload menu items
    loadMenuItems();
    
    showNotification('Item added successfully!', 'success');
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
initializeMenuItems();
loadMenuItems();
