// Menu Page JavaScript - Load menu items dynamically from localStorage

// Load menu items on page load
document.addEventListener('DOMContentLoaded', function() {
    try {
        loadMenuItems();
    } catch (error) {
        console.error('Error loading menu:', error);
        // Fallback: load default menu directly without localStorage
        loadDefaultMenuDirectly();
    }
});

function loadMenuItems() {
    let menuItems = null;
    
    try {
        menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    } catch (e) {
        console.error('localStorage error:', e);
        menuItems = [];
    }
    
    // If no items in localStorage, initialize with default menu
    if (menuItems.length === 0) {
        try {
            initializeDefaultMenu();
            menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
        } catch (e) {
            console.error('Error initializing menu:', e);
            // If localStorage fails, load directly
            loadDefaultMenuDirectly();
            return;
        }
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
    // Initialize with default menu items
    const defaultMenuItems = [
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
    
    localStorage.setItem('menuItems', JSON.stringify(defaultMenuItems));
}

// Fallback function to load menu directly without localStorage
function loadDefaultMenuDirectly() {
    const defaultMenuItems = [
        // Cocktails
        { id: 1, name: "Power-Up Punch", price: 12.99, category: "cocktails", description: "Rum, tropical juices, and a citrus kick" },
        { id: 2, name: "Boss Battle Bourbon", price: 14.99, category: "cocktails", description: "Smooth bourbon with bitters and orange zest" },
        { id: 3, name: "Combo Breaker Cosmo", price: 11.99, category: "cocktails", description: "Vodka, cranberry, lime, triple sec" },
        { id: 4, name: "Level Up Lemonade", price: 9.99, category: "cocktails", description: "Vodka, fresh lemonade, mint" },
        { id: 5, name: "Critical Hit Margarita", price: 13.99, category: "cocktails", description: "Tequila, lime, triple sec, salt rim" },
        { id: 6, name: "Respawn Rum Runner", price: 12.99, category: "cocktails", description: "Dark rum, banana liqueur, blackberry" },
        { id: 7, name: "Achievement Unlocked Mojito", price: 11.99, category: "cocktails", description: "White rum, mint, lime, soda" },
        { id: 8, name: "Game Over Old Fashioned", price: 15.99, category: "cocktails", description: "Whiskey, sugar, bitters, orange" },
        
        // Beers
        { id: 9, name: "1-Up IPA", price: 7.99, category: "beers", description: "Hoppy and citrusy craft IPA" },
        { id: 10, name: "High Score Stout", price: 8.99, category: "beers", description: "Rich and creamy chocolate stout" },
        { id: 11, name: "Pixel Pilsner", price: 6.99, category: "beers", description: "Crisp and refreshing lager" },
        
        // Food
        { id: 12, name: "Boss Burger", price: 16.99, category: "food", description: "Double patty, bacon, cheese, special sauce" },
        { id: 13, name: "Power Pellet Pizza", price: 18.99, category: "food", description: "Personal pizza with your choice of toppings" },
        { id: 14, name: "Bonus Round Buffalo Wings", price: 14.99, category: "food", description: "Crispy wings with buffalo sauce" },
        { id: 15, name: "Checkpoint Nachos", price: 13.99, category: "food", description: "Loaded nachos with all the fixings" },
        { id: 16, name: "Side Quest Sliders", price: 12.99, category: "food", description: "Three mini burgers with fries" }
    ];
    
    // Clear existing menu
    document.getElementById('cocktailsMenu').innerHTML = '';
    document.getElementById('beersMenu').innerHTML = '';
    document.getElementById('foodMenu').innerHTML = '';
    
    // Group items by category
    const cocktails = defaultMenuItems.filter(item => item.category === 'cocktails');
    const beers = defaultMenuItems.filter(item => item.category === 'beers');
    const food = defaultMenuItems.filter(item => item.category === 'food');
    
    // Display cocktails
    cocktails.forEach(item => {
        document.getElementById('cocktailsMenu').appendChild(createMenuItem(item));
    });
    
    // Display beers
    beers.forEach(item => {
        document.getElementById('beersMenu').appendChild(createMenuItem(item));
    });
    
    // Display food
    food.forEach(item => {
        document.getElementById('foodMenu').appendChild(createMenuItem(item));
    });
}
