// Menu Page JavaScript - Load menu items dynamically from localStorage

// Load menu items on page load
document.addEventListener('DOMContentLoaded', function() {
    loadMenuItems();
});

function loadMenuItems() {
    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    
    // If no items in localStorage, initialize with default menu
    if (menuItems.length === 0) {
        initializeDefaultMenu();
        return;
    }
    
    // Clear existing menu
    document.getElementById('cocktailsMenu').innerHTML = '';
    document.getElementById('beersMenu').innerHTML = '';
    document.getElementById('foodMenu').innerHTML = '';
    
    // Group items by category
    const cocktails = menuItems.filter(item => item.category === 'cocktails');
    const beers = menuItems.filter(item => item.category === 'beers');
    const food = menuItems.filter(item => item.category === 'food');
    
    // Display cocktails
    if (cocktails.length > 0) {
        cocktails.forEach(item => {
            document.getElementById('cocktailsMenu').appendChild(createMenuItem(item));
        });
    } else {
        document.getElementById('cocktailsMenu').innerHTML = '<li>No cocktails available</li>';
    }
    
    // Display beers
    if (beers.length > 0) {
        beers.forEach(item => {
            document.getElementById('beersMenu').appendChild(createMenuItem(item));
        });
    } else {
        document.getElementById('beersMenu').innerHTML = '<li>No beers available</li>';
    }
    
    // Display food
    if (food.length > 0) {
        food.forEach(item => {
            document.getElementById('foodMenu').appendChild(createMenuItem(item));
        });
    } else {
        document.getElementById('foodMenu').innerHTML = '<li>No food items available</li>';
    }
}

function createMenuItem(item) {
    const li = document.createElement('li');
    
    const itemText = document.createElement('span');
    itemText.innerHTML = `<strong>${item.name}</strong> ${item.description ? '- ' + item.description : ''} - $${item.price.toFixed(2)} `;
    
    const button = document.createElement('button');
    button.className = 'add-to-cart';
    button.textContent = 'Add to Cart';
    button.onclick = function() {
        addToCart(item.name, item.price);
    };
    
    li.appendChild(itemText);
    li.appendChild(button);
    
    return li;
}

function initializeDefaultMenu() {
    // This will be called if menuItems don't exist in localStorage
    // The admin-menu.js already initializes default items, so we just need to reload
    const event = new Event('storage');
    window.dispatchEvent(event);
    setTimeout(() => {
        loadMenuItems();
    }, 100);
}
