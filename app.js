const { useCallback } = require("react");

// Portfolio Website JavaScript
class Portfolio {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.setupSmoothScroll();
        this.setupIntersectionObserver();
        this.setupProjectFilters();
        this.setupContactForm();
        this.setupMobileMenu();
        this.setupNavbarScroll();
    }

    setupEventListeners() {
        // Wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', () => {
            // Theme toggle
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleTheme();
                });
            }

            // Mobile menu toggle
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            if (mobileMenuBtn) {
                mobileMenuBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleMobileMenu();
                });
            }

            // Navigation links - Fixed smooth scrolling
            const navLinks = document.querySelectorAll('a[href^="#"]');
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        const offsetTop = targetSection.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                        
                        // Close mobile menu if open
                        this.closeMobileMenu();
                    }
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => this.handleOutsideClick(e));
        });

        // Window scroll for navbar
        window.addEventListener('scroll', () => this.handleScroll());
    }

    setupTheme() {
        // Initialize theme properly
        const savedTheme = this.getSavedTheme();
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        this.setTheme(initialTheme);

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!this.getSavedTheme()) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    getSavedTheme() {
        try {
            return localStorage.getItem('portfolio-theme');
        } catch (e) {
            return null;
        }
    }

    setSavedTheme(theme) {
        try {
            localStorage.setItem('portfolio-theme', theme);
        } catch (e) {
            // localStorage not available
        }
    }

    setTheme(theme) {
        // Apply theme to document
        document.documentElement.setAttribute('data-color-scheme', theme);
        document.body.setAttribute('data-theme', theme);
        
        // Update theme icon
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
        
        // Save theme preference
        this.setSavedTheme(theme);
        
        // Force style recalculation
        document.documentElement.style.display = 'none';
        document.documentElement.offsetHeight;
        document.documentElement.style.display = '';
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    setupSmoothScroll() {
        // This is now handled in setupEventListeners to ensure DOM is ready
        // Adding CSS smooth scroll as fallback
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    setupIntersectionObserver() {
        // Wait for DOM to be ready
        setTimeout(() => {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');

            if (sections.length === 0) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Update active nav link
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            const href = link.getAttribute('href');
                            if (href === `#${entry.target.id}`) {
                                link.classList.add('active');
                            }
                        });

                        // Add fade-in animation to elements
                        entry.target.classList.add('fade-in');
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '-80px 0px -80px 0px'
            });

            sections.forEach(section => observer.observe(section));
        }, 100);
    }

    setupProjectFilters() {
        setTimeout(() => {
            const filterButtons = document.querySelectorAll('.filter-btn');
            const projectCards = document.querySelectorAll('.project-card');

            filterButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const filter = button.getAttribute('data-filter');
                    
                    // Update active filter button
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');

                    // Filter projects
                    this.filterProjects(filter, projectCards);
                });
            });
        }, 100);
    }

    filterProjects(filter, cards) {
        cards.forEach((card, index) => {
            const tags = card.getAttribute('data-tags') || '';
            
            setTimeout(() => {
                if (filter === 'all') {
                    card.style.display = 'block';
                    card.classList.remove('hidden');
                    card.classList.add('fade-in');
                } else {
                    if (tags.includes(filter)) {
                        card.style.display = 'block';
                        card.classList.remove('hidden');
                        card.classList.add('fade-in');
                    } else {
                        card.style.display = 'none';
                        card.classList.add('hidden');
                        card.classList.remove('fade-in');
                    }
                }
            }, index * 50);
        });
    }

    setupContactForm() {
        setTimeout(() => {
            const form = document.getElementById('contactForm');
            if (!form) return;

            const inputs = form.querySelectorAll('input, textarea');
            
            // Add real-time validation
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });

            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }, 100);
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}Error`);
        
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (!value) {
            isValid = false;
            errorMessage = `${this.capitalize(fieldName)} is required`;
        }

        // Email specific validation
        if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Message length validation
        if (fieldName === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long';
        }

        // Update UI
        if (errorElement) { 
            errorElement.textContent = errorMessage;
            errorElement.style.display = errorMessage ? 'block' : 'none';
        }
        
        field.classList.toggle('error', !isValid);
        return isValid;
    }

    clearFieldError(field) {
        const errorElement = document.getElementById(`${field.name}Error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        field.classList.remove('error');
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const formStatus = document.getElementById('formStatus');
        
        // Validate all fields
        const inputs = form.querySelectorAll('input, textarea');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showFormStatus('error', 'Please fix the errors above');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        form.classList.add('loading');

        try {
            // Simulate form submission
            await this.simulateFormSubmission(formData);
            
            // Success
            this.showFormStatus('success', 'Thank you! Your message has been sent successfully.');
            form.reset();
            
            // Clear any remaining error messages
            inputs.forEach(input => this.clearFieldError(input));
            
        } catch (error) {
            // Error
            this.showFormStatus('error', 'Sorry, there was an error sending your message. Please try again.');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            form.classList.remove('loading');
        }
    }

    async simulateFormSubmission(formData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', Object.fromEntries(formData));
                resolve({ success: true });
            }, 1500);
        });
    }

    showFormStatus(type, message) {
        const formStatus = document.getElementById('formStatus');
        if (!formStatus) return;

        formStatus.className = `form-status ${type}`;
        formStatus.textContent = message;
        formStatus.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            formStatus.textContent = '';
            formStatus.className = 'form-status';
            formStatus.style.display = 'none';
        }, 5000);
    }

    setupMobileMenu() {
        // This is handled in setupEventListeners
    }

    toggleMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (navMenu && mobileMenuBtn) {
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        }
    }

    openMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (navMenu && mobileMenuBtn) {
            navMenu.classList.add('active');
            mobileMenuBtn.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (navMenu && mobileMenuBtn) {
            navMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    handleOutsideClick(e) {
        const navMenu = document.getElementById('navMenu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (navMenu && mobileMenuBtn && 
            navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            this.closeMobileMenu();
        }
    }

    setupNavbarScroll() {
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (!navbar) return;

            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add scrolled class for styling
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    handleScroll() {
        // Debounce scroll events
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
        
        this.scrollTimeout = setTimeout(() => {
            this.updateScrollProgress();
        }, 16);
    }

    updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = Math.max(0, Math.min(1, scrollTop / docHeight));
        
        document.documentElement.style.setProperty('--scroll-progress', `${scrollPercent * 100}%`);
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize portfolio when DOM is ready
let portfolioInstance = null;

function initPortfolio() {
    if (!portfolioInstance) {
        portfolioInstance = new Portfolio();
        console.log('Portfolio initialized! 🚀');
    }
}

// Multiple initialization methods to ensure it works
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}

// Fallback initialization
window.addEventListener('load', () => {
    if (!portfolioInstance) {
        initPortfolio();
    }
});

// Also initialize immediately if script loads after DOM is ready
setTimeout(() => {
    if (!portfolioInstance && document.body) {
        initPortfolio();
    }
}, 100);

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Portfolio };
}