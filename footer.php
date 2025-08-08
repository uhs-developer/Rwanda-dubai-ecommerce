<?php
/**
 * The template for displaying the footer
 *
 * @package DubaiDirect_Rwanda
 * @version 1.0.0
 */

?>

<footer id="colophon" class="site-footer">
    <!-- Main Footer Content -->
    <div class="footer-main">
        <div class="container">
            <div class="footer-grid">
                
                <!-- Company Information -->
                <div class="footer-section">
                    <div class="footer-logo">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/images/logo-white.png" alt="<?php echo esc_attr(get_bloginfo('name')); ?>">
                    </div>
                    <p class="footer-description">
                        <?php echo esc_html__('Premium electronics and auto parts, direct from Dubai to Rwanda. Quality-assured products with comprehensive warranty and expert support.', 'dubaidirect-rwanda'); ?>
                    </p>
                    <div class="footer-contact">
                        <div class="contact-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                            </svg>
                            <span>+250 788 123 456</span>
                        </div>
                        <div class="contact-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                            <span>info@dubaidirect.rw</span>
                        </div>
                        <div class="contact-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            <span>Kigali, Rwanda</span>
                        </div>
                    </div>
                </div>
                
                <!-- Quick Links -->
                <div class="footer-section">
                    <h3 class="footer-title"><?php echo esc_html__('Quick Links', 'dubaidirect-rwanda'); ?></h3>
                    <ul class="footer-links">
                        <li><a href="<?php echo esc_url(home_url('/')); ?>"><?php echo esc_html__('Home', 'dubaidirect-rwanda'); ?></a></li>
                        <li><a href="<?php echo esc_url(get_permalink(get_page_by_path('about-us'))); ?>"><?php echo esc_html__('About Us', 'dubaidirect-rwanda'); ?></a></li>
                        <li><a href="<?php echo esc_url(get_permalink(get_option('woocommerce_shop_page_id'))); ?>"><?php echo esc_html__('Shop', 'dubaidirect-rwanda'); ?></a></li>
                        <li><a href="<?php echo esc_url(get_permalink(get_page_by_path('contact'))); ?>"><?php echo esc_html__('Contact', 'dubaidirect-rwanda'); ?></a></li>
                        <li><a href="<?php echo esc_url(get_permalink(get_option('woocommerce_myaccount_page_id'))); ?>"><?php echo esc_html__('My Account', 'dubaidirect-rwanda'); ?></a></li>
                        <li><a href="<?php echo esc_url(wc_get_cart_url()); ?>"><?php echo esc_html__('Cart', 'dubaidirect-rwanda'); ?></a></li>
                    </ul>
                </div>
                
                <!-- Product Categories -->
                <div class="footer-section">
                    <h3 class="footer-title"><?php echo esc_html__('Categories', 'dubaidirect-rwanda'); ?></h3>
                    <ul class="footer-links">
                        <li><a href="<?php echo esc_url(get_term_link('electronics', 'product_cat')); ?>"><?php echo esc_html__('Electronics', 'dubaidirect-rwanda'); ?></a></li>
                        <li><a href="<?php echo esc_url(get_term_link('auto-parts', 'product_cat')); ?>"><?php echo esc_html__('Auto Parts', 'dubaidirect-rwanda'); ?></a></li>
                        <li><a href="<?php echo esc_url(get_term_link('smartphones', 'product_cat')); ?>"><?php echo esc_html__('Smartphones', 'dubaidirect-rwanda'); ?></a></li>
                        <li><a href="<?php echo esc_url(get_term_link('laptops', 'product_cat')); ?>"><?php echo esc_html__('Laptops', 'dubaidirect-rwanda'); ?></a></li>
                        <li><a href="<?php echo esc_url(get_term_link('home-appliances', 'product_cat')); ?>"><?php echo esc_html__('Home Appliances', 'dubaidirect-rwanda'); ?></a></li>
                        <li><a href="<?php echo esc_url(get_term_link('performance-parts', 'product_cat')); ?>"><?php echo esc_html__('Performance Parts', 'dubaidirect-rwanda'); ?></a></li>
                    </ul>
                </div>
                
                <!-- Customer Support -->
                <div class="footer-section">
                    <h3 class="footer-title"><?php echo esc_html__('Support', 'dubaidirect-rwanda'); ?></h3>
                    <ul class="footer-links">
                        <li><a href="<?php echo esc_url(get_permalink(get_page_by_path('faq'))); ?>"><?php echo esc_html__('FAQ', 'dubaidirect-rwanda'); ?></a></li>
                        <li><a href="<?php echo esc_url(get_permalink(get_page_by_path('shipping-info'))); ?>"><?php echo esc_html__('Shipping Info', 'dubaidirect-rwanda'); ?></a></li>
                        <li><a href="<?php echo esc_url(get_permalink(get_page_by_path('returns'))); ?>"><?php echo esc_html__('Returns', 'dubaidirect-rwanda'); ?></a></li>
                        <li><a href="<?php echo esc_url(get_permalink(get_page_by_path('warranty'))); ?>"><?php echo esc_html__('Warranty', 'dubaidirect-rwanda'); ?></a></li>
                        <li><a href="<?php echo esc_url(get_permalink(get_page_by_path('track-order'))); ?>"><?php echo esc_html__('Track Order', 'dubaidirect-rwanda'); ?></a></li>
                        <li><a href="<?php echo esc_url(get_permalink(get_page_by_path('live-chat'))); ?>"><?php echo esc_html__('Live Chat', 'dubaidirect-rwanda'); ?></a></li>
                    </ul>
                </div>
                
                <!-- Newsletter & Social -->
                <div class="footer-section">
                    <h3 class="footer-title"><?php echo esc_html__('Stay Connected', 'dubaidirect-rwanda'); ?></h3>
                    <p class="newsletter-description">
                        <?php echo esc_html__('Subscribe to get updates on new products and special offers.', 'dubaidirect-rwanda'); ?>
                    </p>
                    
                    <form class="newsletter-form" action="#" method="post">
                        <div class="form-group">
                            <input type="email" name="email" placeholder="<?php echo esc_attr__('Enter your email', 'dubaidirect-rwanda'); ?>" required>
                            <button type="submit" class="btn btn-primary">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </button>
                        </div>
                    </form>
                    
                    <div class="social-links">
                        <h4><?php echo esc_html__('Follow Us', 'dubaidirect-rwanda'); ?></h4>
                        <div class="social-icons">
                            <a href="#" class="social-icon" aria-label="Facebook">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            <a href="#" class="social-icon" aria-label="Twitter">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                            </a>
                            <a href="#" class="social-icon" aria-label="Instagram">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                                </svg>
                            </a>
                            <a href="#" class="social-icon" aria-label="WhatsApp">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Footer Bottom -->
    <div class="footer-bottom">
        <div class="container">
            <div class="footer-bottom-content">
                <div class="footer-copyright">
                    <p>&copy; <?php echo date('Y'); ?> <?php echo esc_html(get_bloginfo('name')); ?>. <?php echo esc_html__('All rights reserved.', 'dubaidirect-rwanda'); ?></p>
                </div>
                <div class="footer-legal">
                    <a href="<?php echo esc_url(get_permalink(get_page_by_path('privacy-policy'))); ?>"><?php echo esc_html__('Privacy Policy', 'dubaidirect-rwanda'); ?></a>
                    <a href="<?php echo esc_url(get_permalink(get_page_by_path('terms-of-service'))); ?>"><?php echo esc_html__('Terms of Service', 'dubaidirect-rwanda'); ?></a>
                    <a href="<?php echo esc_url(get_permalink(get_page_by_path('shipping-policy'))); ?>"><?php echo esc_html__('Shipping Policy', 'dubaidirect-rwanda'); ?></a>
                    <a href="<?php echo esc_url(get_permalink(get_page_by_path('refund-policy'))); ?>"><?php echo esc_html__('Refund Policy', 'dubaidirect-rwanda'); ?></a>
                </div>
                <div class="footer-payment">
                    <span><?php echo esc_html__('Secure Payment:', 'dubaidirect-rwanda'); ?></span>
                    <div class="payment-icons">
                        <svg width="32" height="20" viewBox="0 0 48 32" fill="none">
                            <rect width="48" height="32" rx="4" fill="#1a1a1a"/>
                            <path d="M12 8h24v16H12z" fill="#fff"/>
                            <path d="M16 12h16v8H16z" fill="#1a1a1a"/>
                            <circle cx="20" cy="16" r="2" fill="#fff"/>
                        </svg>
                        <svg width="32" height="20" viewBox="0 0 48 32" fill="none">
                            <rect width="48" height="32" rx="4" fill="#1a1a1a"/>
                            <path d="M12 8h24v16H12z" fill="#fff"/>
                            <path d="M16 12h16v8H16z" fill="#1a1a1a"/>
                            <circle cx="20" cy="16" r="2" fill="#fff"/>
                        </svg>
                        <svg width="32" height="20" viewBox="0 0 48 32" fill="none">
                            <rect width="48" height="32" rx="4" fill="#1a1a1a"/>
                            <path d="M12 8h24v16H12z" fill="#fff"/>
                            <path d="M16 12h16v8H16z" fill="#1a1a1a"/>
                            <circle cx="20" cy="16" r="2" fill="#fff"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>

</body>
</html>
