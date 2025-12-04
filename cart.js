
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let savedCards = JSON.parse(localStorage.getItem('savedCards')) || [];

// Initialize cart display
function initCart() {
    updateCartDisplay();
    loadSavedCards();
    setupPaymentFormListeners();
    
    // Add checkout button listener
    const checkoutBtn = document.querySelector('.checkout button');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
}

// Load saved cards into dropdown
function loadSavedCards() {
    const savedCardsSection = document.getElementById('savedCardsSection');
    const savedCardsDropdown = document.getElementById('savedCards');
    
    if (savedCards.length > 0) {
        savedCardsSection.style.display = 'block';
        
        // Clear existing options except the first one
        savedCardsDropdown.innerHTML = '<option value="">Select a saved card</option>';
        
        // Add saved cards
        savedCards.forEach((card, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${card.name} - **** ${card.lastFour} (${card.expiry})`;
            savedCardsDropdown.appendChild(option);
        });
    } else {
        savedCardsSection.style.display = 'none';
    }
}

// Setup payment form listeners
function setupPaymentFormListeners() {
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryInput = document.getElementById('expiry');
    const cvvInput = document.getElementById('cvv');
    const savedCardsDropdown = document.getElementById('savedCards');
    
    // Format card number with spaces
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    // Format expiry as MM/YY
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // CVV numbers only
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
    
    // When saved card is selected, fill form
    if (savedCardsDropdown) {
        savedCardsDropdown.addEventListener('change', function(e) {
            const index = e.target.value;
            if (index !== '') {
                const card = savedCards[index];
                document.getElementById('cardName').value = card.name;
                document.getElementById('cardNumber').value = '**** **** **** ' + card.lastFour;
                document.getElementById('expiry').value = card.expiry;
                document.getElementById('cvv').value = '';
                document.getElementById('cardNumber').disabled = true;
                document.getElementById('expiry').disabled = true;
            } else {
                document.getElementById('cardName').value = '';
                document.getElementById('cardNumber').value = '';
                document.getElementById('expiry').value = '';
                document.getElementById('cvv').value = '';
                document.getElementById('cardNumber').disabled = false;
                document.getElementById('expiry').disabled = false;
            }
        });
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItemsDiv = document.querySelector('.incart');
    const totalDiv = document.querySelector('.total');
    const checkoutDiv = document.querySelector('.checkout');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        totalDiv.innerHTML = '<p class="total-amount">Total: $0.00</p>';
        checkoutDiv.innerHTML = '<button class="checkout-btn" disabled>Checkout</button>';
    } else {
        // Display cart items
        let itemsHtml = '<ul class="cart-list">';
        cart.forEach((item, index) => {
            itemsHtml += `
                <li class="cart-item">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">$${item.price.toFixed(2)}</span>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                </li>
            `;
        });
        itemsHtml += '</ul>';
        cartItemsDiv.innerHTML = itemsHtml;
        
        // Calculate and display total
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        totalDiv.innerHTML = `<p class="total-amount">Total: $${total.toFixed(2)}</p>`;
        
        // Enable checkout button
        checkoutDiv.innerHTML = '<button class="checkout-btn">Checkout</button>';
        
        // Re-attach event listener after updating HTML
        const newCheckoutBtn = document.querySelector('.checkout-btn');
        if (newCheckoutBtn) {
            newCheckoutBtn.addEventListener('click', checkout);
        }
    }
}

// Add item to cart
function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    
    // Show popup notification
    showCartPopup('Cart Updated✅');
}

// Show cart popup notification
function showCartPopup(message) {
    const popup = document.getElementById('cartPopup');
    if (popup) {
        const messageElement = document.getElementById('popupMessage');
        messageElement.textContent = message;
        
        // Remove show class if it exists
        popup.classList.remove('show');
        
        // Trigger reflow to restart animation
        void popup.offsetWidth;
        
        // Add show class
        popup.classList.add('show');
    }
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Checkout function
function checkout() {
    if (cart.length === 0) return;
    
    // Validate payment form
    const cardName = document.getElementById('cardName').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;
    const saveCard = document.getElementById('saveCard').checked;
    
    if (!cardName || !cardNumber || !expiry || !cvv) {
        alert('Please fill in all payment details!');
        return;
    }
    
    // Save card if checkbox is checked
    if (saveCard && !cardNumber.includes('****')) {
        const lastFour = cardNumber.replace(/\s/g, '').slice(-4);
        const newCard = {
            name: cardName,
            lastFour: lastFour,
            expiry: expiry
        };
        
        // Check if card already exists
        const cardExists = savedCards.some(card => 
            card.lastFour === lastFour && card.expiry === expiry
        );
        
        if (!cardExists) {
            savedCards.push(newCard);
            localStorage.setItem('savedCards', JSON.stringify(savedCards));
            alert('Card saved for future purchases!');
        }
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    // Get current user info
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                       JSON.parse(sessionStorage.getItem('currentUser'));
    
    // Create order object
    const order = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: 1
        })),
        total: total,
        customerName: currentUser ? currentUser.name : 'Guest',
        customerEmail: currentUser ? currentUser.email : '',
        status: 'pending',
        date: new Date().toISOString()
    };
    
    // Consolidate duplicate items
    const consolidatedItems = [];
    order.items.forEach(item => {
        const existing = consolidatedItems.find(ci => ci.name === item.name && ci.price === item.price);
        if (existing) {
            existing.quantity++;
        } else {
            consolidatedItems.push({...item});
        }
    });
    order.items = consolidatedItems;
    
    // Save order to localStorage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    alert(`Thank you for your purchase!\nTotal: $${total.toFixed(2)}\n\nYour order will be ready soon!`);
    
    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Reset form
    document.getElementById('paymentForm').reset();
    document.getElementById('savedCards').value = '';
    document.getElementById('cardNumber').disabled = false;
    document.getElementById('expiry').disabled = false;
    
    updateCartDisplay();
    loadSavedCards();
}

// Clear entire cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initCart);