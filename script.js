// TanaRuma Residence - Premium Website JavaScript
// Clean and professional interactions

// Initialize when DOM is ready (for non-modular version) or when modules are loaded (for modular version)
function initializeApp() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        // Mobile-optimized AOS settings
        const isMobile = window.innerWidth <= 768;
        
        AOS.init({
            duration: isMobile ? 600 : 1000, // Faster animations on mobile
            easing: 'ease-in-out-cubic',
            once: true,
            mirror: false,
            offset: isMobile ? 80 : 120, // Trigger animations sooner on mobile
            delay: isMobile ? 50 : 100, // Reduced delays on mobile
            // Disable animations only on very small screens if performance is poor
            disable: window.innerWidth < 320 ? true : false,
            // Mobile performance optimization
            throttleDelay: isMobile ? 99 : 66,
            debounceDelay: isMobile ? 50 : 30
        });
        
        // Refresh AOS on window resize for responsive behavior
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                AOS.refresh();
            }, 250);
        });
    }
    
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initWhatsAppFloat();
    initSmoothScrolling();
    initParallaxEffects();
    initCarousel();
    initClubhouseGallery();
}

// Standard initialization for non-modular version
document.addEventListener('DOMContentLoaded', function() {
    // Check if this is the modular version
    if (!document.getElementById('header-include')) {
        // Non-modular version - initialize immediately
        initializeApp();
    }
});

// Modular version initialization
document.addEventListener('modulesLoaded', function() {
    initializeApp();
});

// Loading screen integration
document.addEventListener('loadingComplete', function() {
    console.log('🎉 TanaRuma loading complete - website ready');
    
    // Refresh AOS after loading screen is hidden
    if (typeof AOS !== 'undefined') {
        setTimeout(() => {
            AOS.refresh();
        }, 100);
    }
});

// Navigation functionality
function initNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const logo = document.getElementById('logo');
    
    // Sticky header with scroll effects
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Add scrolled class for styling
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Logo scale animation on scroll
        if (logo) {
            const scale = Math.max(0.8, 1 - scrollY * 0.0005);
            logo.style.transform = `scale(${scale})`;
        }
        
        lastScrollY = scrollY;
    });
    
    // Mobile menu toggle
    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu?.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Active navigation link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Staggered animations for grid items
                if (entry.target.classList.contains('essence__grid') ||
                    entry.target.classList.contains('living__grid') ||
                    entry.target.classList.contains('features__grid')) {
                    animateGridItems(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
        .section__header,
        .essence__content,
        .essence__image,
        .living__grid,
        .features__grid,
        .location__content,
        .contact__form
    `);
    
    animatedElements.forEach(el => observer.observe(el));
}

function animateGridItems(container) {
    const items = container.children;
    Array.from(items).forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contact-form');
    const success = document.getElementById('form-success');
    
    // Form submission
    form?.addEventListener('submit', handleFormSubmit);
    
    function validateForm() {
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('error');
                isValid = false;
                
                // Remove error class after animation
                setTimeout(() => input.classList.remove('error'), 3000);
            }
        });
        
        return isValid;
    }
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        // Collect form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            whatsapp: formData.get('whatsapp'),
            interest: formData.get('interest')
        };
        
        // Simulate form submission
        showLoading();
        
        setTimeout(() => {
            showSuccess(data);
        }, 2000);
    }
    
    function showLoading() {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; justify-content: center;">
                <div class="loading-spinner" style="width: 16px; height: 16px;"></div>
                <span>Mengirim...</span>
            </div>
        `;
        submitBtn.disabled = true;
        
        // Restore button if needed (fallback)
        setTimeout(() => {
            if (submitBtn.disabled) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }, 5000);
    }
    
    function showSuccess(data) {
        // Hide form fields (not the entire form)
        const formStep = form.querySelector('.form__step');
        if (formStep) {
            formStep.style.display = 'none';
        }
        
        // Show success message
        success.classList.add('active');
        success.style.display = 'block';
        
        // Create WhatsApp message
        const message = `Halo! Saya ${data.name}, tertarik dengan TanaRuma tipe ${data.interest}. Mohon info lengkapnya.`;
        const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
        
        // Update WhatsApp link
        const whatsappBtn = success.querySelector('.btn');
        if (whatsappBtn) {
            whatsappBtn.href = whatsappUrl;
        }
    }
}

// WhatsApp floating button
function initWhatsAppFloat() {
    const whatsappFloat = document.getElementById('whatsapp-float');
    
    // Show after 3 seconds with animation
    setTimeout(() => {
        if (whatsappFloat) {
            whatsappFloat.style.opacity = '1';
            whatsappFloat.style.transform = 'scale(1)';
        }
    }, 3000);
    
    // Hide/show on scroll
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        if (whatsappFloat) {
            if (scrollY > lastScrollY && scrollY > 500) {
                // Scrolling down - hide
                whatsappFloat.style.transform = 'scale(0) translateY(100px)';
            } else {
                // Scrolling up - show
                whatsappFloat.style.transform = 'scale(1) translateY(0)';
            }
        }
        
        lastScrollY = scrollY;
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Parallax effects
function initParallaxEffects() {
    const heroVideo = document.querySelector('.hero__video');
    const heroContent = document.querySelector('.hero__content');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const rate = scrolled * -0.5;
        const contentRate = scrolled * -0.3;
        
        if (heroVideo) {
            heroVideo.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
        
        if (heroContent) {
            heroContent.style.transform = `translate3d(0, ${contentRate}px, 0)`;
        }
    });
}

// Enhanced button interactions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
        const btn = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
        
        // Ripple effect
        createRipple(e, btn);
        
        // Button animation
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
    }
});

function createRipple(event, element) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.3);
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation to CSS dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .form__input.error {
        border-color: #e74c3c;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
        animation: shake 0.5s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .loading-animation {
        text-align: center;
        padding: 2rem;
    }
    
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #C3B791;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(rippleStyle);

// Performance optimization - throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply throttling to scroll events
const throttledScroll = throttle(() => {
    updateActiveNavLink();
}, 100);

window.addEventListener('scroll', throttledScroll);

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add loading class to body initially
document.body.classList.add('loading');

// Remove loading class when page is fully loaded
window.addEventListener('load', () => {
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
});

// Error handling for missing elements
function safeQuerySelector(selector) {
    try {
        return document.querySelector(selector);
    } catch (error) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
}

// Enhanced accessibility
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navMenu?.classList.contains('active')) {
            navToggle?.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
});

// Carousel functionality for living options
function initCarousel() {
    const carousels = document.querySelectorAll('.living__carousel');
    
    carousels.forEach(carousel => {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-arrow.prev');
        const nextBtn = carousel.querySelector('.carousel-arrow.next');
        const dots = carousel.querySelectorAll('.dot');
        
        if (slides.length === 0) return;
        
        let currentIndex = 0;
        
        // Function to show slide
        function showSlide(index) {
            // Remove active classes
            slides.forEach((slide, i) => {
                slide.classList.remove('active', 'prev');
                if (i < index) {
                    slide.classList.add('prev');
                }
            });
            
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Add active classes
            slides[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
            
            currentIndex = index;
        }
        
        // Function to go to next slide
        function nextSlide() {
            const nextIndex = (currentIndex + 1) % slides.length;
            showSlide(nextIndex);
        }
        
        // Function to go to previous slide
        function prevSlide() {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(prevIndex);
        }
        
        // Event listeners for arrows
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
            });
        }
        
        // Event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
            });
        });
        
        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide(); // Swipe left
                } else {
                    prevSlide(); // Swipe right
                }
            }
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });
        
        // Initialize
        showSlide(0);
    });
}

// Helper function to detect mobile devices
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

// Clubhouse gallery functionality
function initClubhouseGallery() {
    const mainImage = document.querySelector('.clubhouse__main-image img');
    const thumbnails = document.querySelectorAll('.clubhouse__thumb');
    
    if (!mainImage || thumbnails.length === 0) return;
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const newImageSrc = this.querySelector('img').src;
            const newImageAlt = this.querySelector('img').alt;
            
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Smooth transition for main image
            mainImage.style.opacity = '0.5';
            
            setTimeout(() => {
                mainImage.src = newImageSrc;
                mainImage.alt = newImageAlt;
                mainImage.style.opacity = '1';
            }, 200);
        });
    });
}

// Console message for developers
console.log('%cTanaRuma Residence', 'color: #B8A082; font-size: 24px; font-weight: bold;');
console.log('%cPremium Mediterranean Residence Website', 'color: #3D2F22; font-size: 14px;');
console.log('%cDeveloped with professional standards for modern living', 'color: #2C1D15; font-size: 12px;');