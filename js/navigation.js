/**
 * Navigation JavaScript
 * Handles mobile menu, search overlay, and navigation interactions
 */

(function() {
    'use strict';

    // DOM Elements
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.querySelector('.search-close');
    const searchField = document.querySelector('.search-field');

    // Mobile Menu Toggle
    if (menuToggle && mobileMenuOverlay) {
        menuToggle.addEventListener('click', function() {
            toggleMobileMenu();
        });

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', function() {
                closeMobileMenu();
            });
        }

        // Close mobile menu when clicking outside
        mobileMenuOverlay.addEventListener('click', function(e) {
            if (e.target === mobileMenuOverlay) {
                closeMobileMenu();
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // Search Overlay Toggle
    if (searchToggle && searchOverlay) {
        searchToggle.addEventListener('click', function() {
            toggleSearchOverlay();
        });

        if (searchClose) {
            searchClose.addEventListener('click', function() {
                closeSearchOverlay();
            });
        }

        // Close search overlay when clicking outside
        searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay) {
                closeSearchOverlay();
            }
        });

        // Close search overlay on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                closeSearchOverlay();
            }
        });

        // Focus search field when overlay opens
        if (searchField) {
            searchToggle.addEventListener('click', function() {
                setTimeout(() => {
                    searchField.focus();
                }, 300);
            });
        }
    }

    // Header scroll effect
    const header = document.querySelector('.site-header');
    let lastScrollTop = 0;

    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show header on scroll (optional)
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }

            lastScrollTop = scrollTop;
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Functions
    function toggleMobileMenu() {
        const isActive = mobileMenuOverlay.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        mobileMenuOverlay.classList.add('active');
        menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add focus trap for accessibility
        trapFocus(mobileMenuOverlay);
    }

    function closeMobileMenu() {
        mobileMenuOverlay.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
        
        // Return focus to menu toggle
        menuToggle.focus();
    }

    function toggleSearchOverlay() {
        const isActive = searchOverlay.classList.contains('active');
        
        if (isActive) {
            closeSearchOverlay();
        } else {
            openSearchOverlay();
        }
    }

    function openSearchOverlay() {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add focus trap for accessibility
        trapFocus(searchOverlay);
    }

    function closeSearchOverlay() {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Return focus to search toggle
        searchToggle.focus();
    }

    // Focus trap for accessibility
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        e.preventDefault();
                        lastFocusableElement.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        e.preventDefault();
                        firstFocusableElement.focus();
                    }
                }
            }
        });
    }

    // Cart count update (if WooCommerce is active)
    if (typeof wc_add_to_cart_params !== 'undefined') {
        // Listen for cart updates
        document.addEventListener('added_to_cart', function() {
            updateCartCount();
        });

        document.addEventListener('removed_from_cart', function() {
            updateCartCount();
        });
    }

    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            // This would typically be updated via AJAX
            // For now, we'll just show/hide based on content
            const count = parseInt(cartCount.textContent) || 0;
            if (count > 0) {
                cartCount.style.display = 'flex';
            } else {
                cartCount.style.display = 'none';
            }
        }
    }

        // Newsletter AJAX submission
    function initializeNewsletterForms() {
        const newsletterForms = document.querySelectorAll('.tnp-subscription form');

        newsletterForms.forEach(form => {
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                const formData = new FormData(form);
                const submitBtn = form.querySelector('.tnp-submit');
                const originalText = submitBtn.value;

                // Show loading state
                submitBtn.value = 'Subscribing...';
                submitBtn.disabled = true;

                fetch(form.action, {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.text())
                    .then(html => {
                        // Show success message inline
                        const successMsg = document.createElement('div');
                        successMsg.className = 'newsletter-success';
                        successMsg.innerHTML = `
                            <div class="message-icon">✓</div>
                            <div class="message-content">
                                <h3>Thank you!</h3>
                                <p>You've been successfully subscribed to our newsletter.</p>
                            </div>
                        `;

                        form.parentNode.insertBefore(successMsg, form);
                        form.reset();

                        // Hide success after 5 seconds
                        setTimeout(() => {
                            successMsg.remove();
                        }, 5000);
                    })
                    .catch(error => {
                        // Show error message
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'newsletter-error';
                        errorMsg.innerHTML = `
                            <div class="message-icon">⚠</div>
                            <div class="message-content">
                                <h3>Oops!</h3>
                                <p>Something went wrong. Please try again.</p>
                            </div>
                        `;

                        form.parentNode.insertBefore(errorMsg, form);
                    })
                    .finally(() => {
                        // Reset button
                        submitBtn.value = originalText;
                        submitBtn.disabled = false;
                    });
            });
        });
    }

    // Initialize newsletter forms
    initializeNewsletterForms();

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        // Add loading class to body
        document.body.classList.add('loaded');
        
        // Initialize any additional functionality
        initializeNavigation();
    });

    function initializeNavigation() {
        // Add current page indicator
        const currentPage = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.parentElement.classList.add('current-menu-item');
            }
        });

        // Add hover effects for desktop
        if (window.innerWidth > 768) {
            const navItems = document.querySelectorAll('.nav-menu li');
            
            navItems.forEach(item => {
                const submenu = item.querySelector('.sub-menu');
                if (submenu) {
                    item.addEventListener('mouseenter', function() {
                        submenu.style.opacity = '1';
                        submenu.style.visibility = 'visible';
                        submenu.style.transform = 'translateY(0)';
                    });

                    item.addEventListener('mouseleave', function() {
                        submenu.style.opacity = '0';
                        submenu.style.visibility = 'hidden';
                        submenu.style.transform = 'translateY(-10px)';
                    });
                }
            });
        }
    }

    // Resize handler
    window.addEventListener('resize', function() {
        // Close mobile menu on resize if screen becomes large
        if (window.innerWidth > 768 && mobileMenuOverlay.classList.contains('active')) {
            closeMobileMenu();
        }
    });

})();
