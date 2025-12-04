// Contact Form Handler
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Create contact message object
        const contactMessage = {
            id: Date.now(),
            name: name,
            email: email,
            subject: subject || 'No subject',
            message: message,
            submittedAt: new Date().toISOString(),
            status: 'unread'
        };
        
        // Get existing messages from localStorage
        let contactMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        
        // Add new message
        contactMessages.push(contactMessage);
        
        // Save to localStorage
        localStorage.setItem('contactMessages', JSON.stringify(contactMessages));
        
        // Show success message
        alert('Thank you for your message! We\'ll get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
}