// TanaRuma Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    console.log('Contact form script loaded');
    
    const contactForm = document.getElementById('contact-form');
    const formStep = document.querySelector('.form__step');
    const formSuccess = document.getElementById('form-success');
    const loadingSpinner = document.getElementById('loading-spinner');

    // Debug: Check if elements exist
    console.log('Elements found:', {
        contactForm: !!contactForm,
        formStep: !!formStep,
        formSuccess: !!formSuccess,
        loadingSpinner: !!loadingSpinner
    });

    if (contactForm && formStep && formSuccess && loadingSpinner) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted!');
            
            // Get form data
            const name = document.getElementById('name').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const interest = document.getElementById('interest').value;
            
            console.log('Form data:', { name, whatsapp, interest });
            
            // Validate form data
            if (!name || !whatsapp || !interest) {
                alert('Mohon lengkapi semua field yang diperlukan');
                return;
            }
            
            console.log('Validation passed, showing success message...');
            
            // Hide form and show success message
            formStep.classList.remove('active');
            formSuccess.classList.add('active');
            
            // Show loading spinner with new class system
            loadingSpinner.classList.add('show');
            console.log('Loading spinner should be visible now');
            
            // Wait 1 second then redirect to WhatsApp
            console.log('Starting 1 second countdown...');
            setTimeout(() => {
                console.log('1 second passed, redirecting to WhatsApp...');
                // Create WhatsApp message
                const message = `Halo admin TanaRuma, saya ${name}, saya tertarik dengan rumah ${interest}, tolong infoin detail rumahnya ya.`;
                
                // Encode message for URL
                const encodedMessage = encodeURIComponent(message);
                
                // Create WhatsApp URL (using the same number from the original button)
                const whatsappUrl = `https://wa.me/6281181150666?text=${encodedMessage}`;
                
                // Open WhatsApp
                window.open(whatsappUrl, '_blank');
                
                // Optional: Reset form after successful submission
                setTimeout(() => {
                    console.log('Resetting form...');
                    contactForm.reset();
                    formStep.classList.add('active');
                    formSuccess.classList.remove('active');
                    loadingSpinner.classList.remove('show');
                }, 2000);
                
            }, 1000); // 1 second delay
        });
    } else {
        console.error('Some form elements not found:', {
            contactForm: !!contactForm,
            formStep: !!formStep,
            formSuccess: !!formSuccess,
            loadingSpinner: !!loadingSpinner
        });
    }
});