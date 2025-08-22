// TanaRuma Loading Screen Controller
// Professional 1.5s loading with logo animation

class TanaRumaLoader {
    constructor() {
        this.loadingElement = null;
        this.loadingDuration = window.innerWidth <= 768 ? 1200 : 1500; // Faster on mobile
        this.minDisplayTime = 1000; // Minimum display time
        this.startTime = Date.now();
        this.isComplete = false;
        
        this.init();
    }

    init() {
        // Create loading screen HTML
        this.createLoadingScreen();
        
        // Preload logo for instant display
        this.preloadAssets();
        
        // Auto-hide after duration
        this.scheduleHide();
        
        // Listen for page load events
        this.setupEventListeners();
    }

    createLoadingScreen() {
        // Create loading screen element
        const loadingHTML = `
            <div id="tanaruma-loading">
                <div class="loading-content">
                    <img src="assets/LOGO/Tangkapan_Layar_2025-08-07_pukul_16.27.24-removebg-preview.png" 
                         alt="TanaRuma Residence" 
                         class="loading-logo"
                         loading="eager">
                    <div class="loading-bar">
                        <div class="progress"></div>
                    </div>
                    <p class="loading-text">Home for Every Dream</p>
                </div>
            </div>
        `;
        
        // Insert at beginning of body
        document.body.insertAdjacentHTML('afterbegin', loadingHTML);
        this.loadingElement = document.getElementById('tanaruma-loading');
        
        console.log('🏠 TanaRuma loading screen initialized');
    }

    preloadAssets() {
        // Preload logo for instant display
        const logoImg = new Image();
        logoImg.src = 'assets/LOGO/Tangkapan_Layar_2025-08-07_pukul_16.27.24-removebg-preview.png';
        logoImg.onload = () => {
            console.log('✓ TanaRuma logo preloaded');
        };
        logoImg.onerror = () => {
            console.warn('⚠️ Logo failed to load, using fallback');
            this.handleLogoError();
        };
    }

    handleLogoError() {
        // Fallback if logo fails to load
        const logoElement = this.loadingElement.querySelector('.loading-logo');
        if (logoElement) {
            logoElement.style.display = 'none';
            
            // Create text fallback
            const textFallback = document.createElement('h1');
            textFallback.textContent = 'TanaRuma';
            textFallback.style.cssText = `
                font-family: var(--font-heading);
                font-size: 2rem;
                font-weight: 700;
                color: var(--color-gold);
                margin: 0 0 2rem 0;
                opacity: 0;
                animation: logoAppear 0.6s ease 0.1s forwards;
            `;
            logoElement.parentElement.insertBefore(textFallback, logoElement);
        }
    }

    scheduleHide() {
        const isMobile = window.innerWidth <= 768;
        const duration = isMobile ? 1200 : 1500;
        
        setTimeout(() => {
            this.hideLoadingScreen();
        }, duration);
    }

    hideLoadingScreen() {
        if (!this.loadingElement || this.isComplete) return;
        
        this.isComplete = true;
        
        // Add fade-out class
        this.loadingElement.classList.add('fade-out');
        
        // Remove element after transition
        setTimeout(() => {
            if (this.loadingElement && this.loadingElement.parentNode) {
                this.loadingElement.remove();
                console.log('✓ TanaRuma loading screen hidden');
                
                // Trigger custom event for main app initialization
                document.dispatchEvent(new CustomEvent('loadingComplete'));
                
                // Enable scroll
                document.body.style.overflow = '';
            }
        }, 400);
    }

    setupEventListeners() {
        // Disable scroll during loading
        document.body.style.overflow = 'hidden';
        
        // Force hide if taking too long
        setTimeout(() => {
            if (!this.isComplete) {
                console.log('⏰ Force hiding loading screen after timeout');
                this.hideLoadingScreen();
            }
        }, 3000);
        
        // Hide immediately if page is already loaded
        if (document.readyState === 'complete') {
            setTimeout(() => {
                const elapsed = Date.now() - this.startTime;
                const remainingTime = Math.max(0, this.minDisplayTime - elapsed);
                
                setTimeout(() => {
                    this.hideLoadingScreen();
                }, remainingTime);
            }, 500);
        }
    }

    // Method to manually hide loading (useful for debugging)
    forceHide() {
        this.hideLoadingScreen();
    }

    // Check if loading is still active
    isActive() {
        return !this.isComplete && this.loadingElement && this.loadingElement.parentNode;
    }
}

// Auto-initialize loading screen as early as possible
(function() {
    // Initialize immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLoader);
    } else {
        initLoader();
    }
    
    function initLoader() {
        // Don't initialize if already exists
        if (document.getElementById('tanaruma-loading')) return;
        
        const loader = new TanaRumaLoader();
        
        // Make it globally available for debugging
        window.tanarumaLoader = loader;
        
        // Integration with existing module system
        document.addEventListener('modulesLoaded', function() {
            console.log('📦 Modules loaded, loading screen will hide naturally');
        });
    }
})();

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`📊 Page load time: ${Math.round(loadTime)}ms`);
});

// Error handling
window.addEventListener('error', function(event) {
    console.warn('Loading screen error handled:', event.error?.message);
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TanaRumaLoader;
}