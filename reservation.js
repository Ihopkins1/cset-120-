// Handle booking form submission
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.querySelector('.booking-form');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const guests = document.getElementById('guests').value;
            const table = document.getElementById('table').value;
            const special = document.getElementById('special').value;
            
            // Create booking object
            const booking = {
                name,
                email,
                phone,
                date,
                time,
                guests,
                table,
                message: special,
                submittedAt: new Date().toISOString()
            };
            
            // Save to localStorage
            let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
            reservations.push(booking);
            localStorage.setItem('reservations', JSON.stringify(reservations));
            
            // Show confirmation popup
            showBookingPopup('Booking Confirmed✅');
            
            // Reset form
            bookingForm.reset();
            
            // Optional: Log booking details
            console.log('Booking confirmed:', booking);
        });
    }
});

// Show booking popup notification
function showBookingPopup(message) {
    const popup = document.getElementById('bookingPopup');
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
