// Login/Signup Page JavaScript

// Toggle between login and signup forms
const loginToggle = document.getElementById('loginToggle');
const signupToggle = document.getElementById('signupToggle');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');

function showLogin() {
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    loginToggle.classList.add('active');
    signupToggle.classList.remove('active');
}

function showSignup() {
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
    signupToggle.classList.add('active');
    loginToggle.classList.remove('active');
}

loginToggle.addEventListener('click', showLogin);
signupToggle.addEventListener('click', showSignup);
switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    showSignup();
});
switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    showLogin();
});

// Display messages
function showMessage(form, message, type) {
    // Remove existing messages
    const existingMessage = form.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    form.insertBefore(messageDiv, form.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Manager and Admin credentials
const MANAGER_EMAIL = 'manager@thebigdrink.com';
const MANAGER_PASSWORD = 'manager123';

// Initialize admin list if not exists
function initializeAdmins() {
    let admins = JSON.parse(localStorage.getItem('admins'));
    if (!admins) {
        admins = [
            { email: 'admin@thebigdrink.com', password: 'admin123' }
        ];
        localStorage.setItem('admins', JSON.stringify(admins));
    }
    return admins;
}

// Handle Login Form Submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Check if manager login
    if (email === MANAGER_EMAIL && password === MANAGER_PASSWORD) {
        const managerUser = {
            name: 'Manager',
            email: MANAGER_EMAIL,
            isManager: true,
            isAdmin: true,
            loggedInAt: new Date().toISOString()
        };

        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(managerUser));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(managerUser));
        }

        showMessage(loginForm, 'Manager login successful! Redirecting...', 'success');

        // Redirect to manager dashboard
        setTimeout(() => {
            window.location.href = 'manager.html';
        }, 1500);
        return;
    }

    // Check if admin login
    const admins = initializeAdmins();
    const admin = admins.find(a => a.email === email && a.password === password);
    
    if (admin) {
        const adminUser = {
            name: 'Admin',
            email: ADMIN_EMAIL,
            isAdmin: true,
            loggedInAt: new Date().toISOString()
        };

        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(adminUser));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(adminUser));
        }

        showMessage(loginForm, 'Admin login successful! Redirecting...', 'success');

        // Redirect to admin dashboard
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1500);
        return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Find user
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Store logged-in user
        const currentUser = {
            name: user.name,
            email: user.email,
            isAdmin: false,
            loggedInAt: new Date().toISOString()
        };

        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        }

        showMessage(loginForm, 'Login successful! Redirecting...', 'success');

        // Redirect to home page after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        showMessage(loginForm, 'Invalid email or password. Please try again.', 'error');
    }
});

// Handle Signup Form Submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Validation
    if (password !== confirmPassword) {
        showMessage(signupForm, 'Passwords do not match!', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage(signupForm, 'Password must be at least 6 characters long.', 'error');
        return;
    }

    if (!agreeTerms) {
        showMessage(signupForm, 'You must agree to the Terms & Conditions.', 'error');
        return;
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if email already exists
    if (users.find(u => u.email === email)) {
        showMessage(signupForm, 'An account with this email already exists.', 'error');
        return;
    }

    // Create new user
    const newUser = {
        name: name,
        email: email,
        password: password, // In a real app, this should be hashed
        createdAt: new Date().toISOString()
    };

    // Add to users array
    users.push(newUser);

    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    showMessage(signupForm, 'Account created successfully! You can now login.', 'success');

    // Clear form
    signupForm.reset();

    // Switch to login after 2 seconds
    setTimeout(() => {
        showLogin();
    }, 2000);
});

// Check if user is already logged in
function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                       JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (currentUser) {
        // User is logged in, update navbar if needed
        const navLogin = document.querySelector('.nav-login');
        if (navLogin) {
            navLogin.textContent = currentUser.name.split(' ')[0]; // Show first name
        }
    }
}

// Run on page load
checkLoginStatus();
