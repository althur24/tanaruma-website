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
            
            // Hide form and show success message first
            formStep.classList.remove('active');
            formSuccess.classList.add('active');
            loadingSpinner.classList.add('show');
            console.log('Loading spinner should be visible now');
            
            // Track Lead TR event on Facebook Pixel with improved handling
            console.log('Attempting to track Facebook Pixel Lead TR event...');
            
            function trackLeadEvent() {
                try {
                    if (typeof fbq !== 'undefined' && fbq.loaded) {
                        fbq('trackCustom', 'Lead TR');
                        console.log('✅ Facebook Pixel Lead TR event successfully tracked!');
                        return true;
                    } else if (typeof fbq !== 'undefined') {
                        console.log('⚠️ Facebook Pixel found but not fully loaded, retrying...');
                        return false;
                    } else {
                        console.error('❌ Facebook Pixel (fbq) not found!');
                        return true; // Don't retry if fbq doesn't exist
                    }
                } catch (error) {
                    console.error('❌ Error tracking Facebook Pixel event:', error);
                    return true; // Don't retry on error
                }
            }
            
            // Try to track immediately
            let tracked = trackLeadEvent();
            
            // If not tracked, retry after short delay
            if (!tracked) {
                setTimeout(() => {
                    trackLeadEvent();
                }, 500);
            }
            
            // Wait longer before redirect to ensure event is sent
            console.log('Starting 2 second countdown before WhatsApp redirect...');
            setTimeout(() => {
                console.log('2 seconds passed, redirecting to WhatsApp...');
                // Create WhatsApp message
                const message = `Halo admin TanaRuma, saya ${name}, saya tertarik dengan rumah ${interest}, tolong infoin detail rumahnya ya.`;
                
                // Encode message for URL
                const encodedMessage = encodeURIComponent(message);
                
                // Create WhatsApp URL (using the same number from the original button)
                const whatsappUrl = `https://wa.me/6281181150666?text=${encodedMessage}`;
                
                // Open WhatsApp app directly on mobile
                window.location.href = whatsappUrl;
                
                // Optional: Reset form after successful submission
                setTimeout(() => {
                    console.log('Resetting form...');
                    contactForm.reset();
                    formStep.classList.add('active');
                    formSuccess.classList.remove('active');
                    loadingSpinner.classList.remove('show');
                }, 2000);
                
            }, 2000); // 2 second delay for event tracking
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