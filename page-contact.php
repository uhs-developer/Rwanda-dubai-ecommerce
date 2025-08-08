<?php
/**
 * Template Name: Contact Us
 * 
 * @package DubaiDirect_Rwanda
 * @version 1.0.0
 */

get_header(); ?>

<main id="primary" class="site-main">
    
    <!-- Hero Section -->
    <section class="page-hero">
        <div class="hero-background">
            <img src="<?php echo get_template_directory_uri(); ?>/assets/images/contact-hero.jpg" alt="Contact Us" class="hero-image">
            <div class="hero-overlay"></div>
        </div>
        
        <div class="hero-content">
            <div class="container">
                <h1 class="hero-title"><?php echo esc_html__('Contact Us', 'dubaidirect-rwanda'); ?></h1>
                <p class="hero-subtitle"><?php echo esc_html__('We\'re here to help with all your questions and support needs', 'dubaidirect-rwanda'); ?></p>
            </div>
        </div>
    </section>

    <!-- Contact Information -->
    <section class="contact-info">
        <div class="container">
            <div class="contact-grid">
                <div class="contact-card">
                    <div class="contact-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                        </svg>
                    </div>
                    <h3><?php echo esc_html__('Phone Support', 'dubaidirect-rwanda'); ?></h3>
                    <p class="contact-detail"><?php echo esc_html__('+250 788 123 456', 'dubaidirect-rwanda'); ?></p>
                    <p class="contact-note"><?php echo esc_html__('Monday - Friday: 8:00 AM - 6:00 PM', 'dubaidirect-rwanda'); ?></p>
                </div>
                
                <div class="contact-card">
                    <div class="contact-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                    </div>
                    <h3><?php echo esc_html__('Email Support', 'dubaidirect-rwanda'); ?></h3>
                    <p class="contact-detail"><?php echo esc_html__('support@dubaidirect.rw', 'dubaidirect-rwanda'); ?></p>
                    <p class="contact-note"><?php echo esc_html__('Response within 24 hours', 'dubaidirect-rwanda'); ?></p>
                </div>
                
                <div class="contact-card">
                    <div class="contact-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                    </div>
                    <h3><?php echo esc_html__('Office Location', 'dubaidirect-rwanda'); ?></h3>
                    <p class="contact-detail"><?php echo esc_html__('Kigali, Rwanda', 'dubaidirect-rwanda'); ?></p>
                    <p class="contact-note"><?php echo esc_html__('KG 123 St, Kigali', 'dubaidirect-rwanda'); ?></p>
                </div>
                
                <div class="contact-card">
                    <div class="contact-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <h3><?php echo esc_html__('WhatsApp Support', 'dubaidirect-rwanda'); ?></h3>
                    <p class="contact-detail"><?php echo esc_html__('+250 788 123 456', 'dubaidirect-rwanda'); ?></p>
                    <p class="contact-note"><?php echo esc_html__('24/7 instant messaging', 'dubaidirect-rwanda'); ?></p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Form -->
    <section class="contact-form-section">
        <div class="container">
            <div class="form-content">
                <div class="form-info">
                    <h2><?php echo esc_html__('Send Us a Message', 'dubaidirect-rwanda'); ?></h2>
                    <p><?php echo esc_html__('Have a question about our products or services? Fill out the form below and we\'ll get back to you as soon as possible.', 'dubaidirect-rwanda'); ?></p>
                    
                    <div class="form-features">
                        <div class="feature-item">
                            <div class="feature-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <span><?php echo esc_html__('Response within 24 hours', 'dubaidirect-rwanda'); ?></span>
                        </div>
                        
                        <div class="feature-item">
                            <div class="feature-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <span><?php echo esc_html__('Professional support team', 'dubaidirect-rwanda'); ?></span>
                        </div>
                        
                        <div class="feature-item">
                            <div class="feature-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                </svg>
                            </div>
                            <span><?php echo esc_html__('Secure and confidential', 'dubaidirect-rwanda'); ?></span>
                        </div>
                    </div>
                </div>
                
                <div class="contact-form">
                    <?php
                    // Contact form using Contact Form 7 or custom form
                    if (function_exists('wpcf7_contact_form')) {
                        echo do_shortcode('[contact-form-7 id="contact-form" title="Contact Form"]');
                    } else {
                        // Custom contact form
                        ?>
                        <form class="custom-contact-form" method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                            <?php wp_nonce_field('contact_form_nonce', 'contact_nonce'); ?>
                            <input type="hidden" name="action" value="handle_contact_form">
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="first_name"><?php echo esc_html__('First Name', 'dubaidirect-rwanda'); ?> *</label>
                                    <input type="text" id="first_name" name="first_name" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="last_name"><?php echo esc_html__('Last Name', 'dubaidirect-rwanda'); ?> *</label>
                                    <input type="text" id="last_name" name="last_name" required>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="email"><?php echo esc_html__('Email Address', 'dubaidirect-rwanda'); ?> *</label>
                                    <input type="email" id="email" name="email" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="phone"><?php echo esc_html__('Phone Number', 'dubaidirect-rwanda'); ?></label>
                                    <input type="tel" id="phone" name="phone">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="subject"><?php echo esc_html__('Subject', 'dubaidirect-rwanda'); ?> *</label>
                                <select id="subject" name="subject" required>
                                    <option value=""><?php echo esc_html__('Select a subject', 'dubaidirect-rwanda'); ?></option>
                                    <option value="general"><?php echo esc_html__('General Inquiry', 'dubaidirect-rwanda'); ?></option>
                                    <option value="product"><?php echo esc_html__('Product Information', 'dubaidirect-rwanda'); ?></option>
                                    <option value="order"><?php echo esc_html__('Order Support', 'dubaidirect-rwanda'); ?></option>
                                    <option value="delivery"><?php echo esc_html__('Delivery Questions', 'dubaidirect-rwanda'); ?></option>
                                    <option value="payment"><?php echo esc_html__('Payment Issues', 'dubaidirect-rwanda'); ?></option>
                                    <option value="quality"><?php echo esc_html__('Quality Assurance', 'dubaidirect-rwanda'); ?></option>
                                    <option value="other"><?php echo esc_html__('Other', 'dubaidirect-rwanda'); ?></option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="message"><?php echo esc_html__('Message', 'dubaidirect-rwanda'); ?> *</label>
                                <textarea id="message" name="message" rows="6" required placeholder="<?php echo esc_attr__('Please describe your inquiry in detail...', 'dubaidirect-rwanda'); ?>"></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" name="privacy_consent" required>
                                    <span class="checkmark"></span>
                                    <?php echo esc_html__('I agree to the privacy policy and consent to being contacted regarding my inquiry.', 'dubaidirect-rwanda'); ?>
                                </label>
                            </div>
                            
                            <button type="submit" class="btn btn-primary btn-full">
                                <?php echo esc_html__('Send Message', 'dubaidirect-rwanda'); ?>
                            </button>
                        </form>
                        <?php
                    }
                    ?>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
        <div class="container">
            <h2 class="section-title"><?php echo esc_html__('Frequently Asked Questions', 'dubaidirect-rwanda'); ?></h2>
            <div class="faq-grid">
                <div class="faq-item">
                    <div class="faq-question">
                        <h3><?php echo esc_html__('How long does delivery take?', 'dubaidirect-rwanda'); ?></h3>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p><?php echo esc_html__('We offer 6 different delivery options ranging from 1 day to 3 months. Express delivery takes 1-2 days, while our most economical option takes up to 3 months. You can choose the option that best fits your timeline and budget.', 'dubaidirect-rwanda'); ?></p>
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question">
                        <h3><?php echo esc_html__('What payment methods do you accept?', 'dubaidirect-rwanda'); ?></h3>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p><?php echo esc_html__('We accept MTN MoMo, Airtel Money, Visa, Mastercard, and bank transfers. All payments are processed securely and we provide immediate confirmation for successful transactions.', 'dubaidirect-rwanda'); ?></p>
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question">
                        <h3><?php echo esc_html__('How do you ensure product quality?', 'dubaidirect-rwanda'); ?></h3>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p><?php echo esc_html__('Every product undergoes comprehensive testing in our Dubai facility before shipment. This includes visual inspection, functional testing, performance benchmarking, and documentation review. We maintain a defect rate of less than 2%.', 'dubaidirect-rwanda'); ?></p>
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question">
                        <h3><?php echo esc_html__('What if I\'m not satisfied with my order?', 'dubaidirect-rwanda'); ?></h3>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p><?php echo esc_html__('We offer a comprehensive warranty and return policy. If you\'re not satisfied with your purchase, you can return it within 30 days for a full refund or replacement. Our customer satisfaction rate is over 97%.', 'dubaidirect-rwanda'); ?></p>
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question">
                        <h3><?php echo esc_html__('Do you ship to all areas of Rwanda?', 'dubaidirect-rwanda'); ?></h3>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p><?php echo esc_html__('Yes, we deliver to all areas of Rwanda. We have partnerships with local courier networks to ensure reliable delivery even to remote areas. Delivery times and costs may vary based on location.', 'dubaidirect-rwanda'); ?></p>
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question">
                        <h3><?php echo esc_html__('Can I track my order?', 'dubaidirect-rwanda'); ?></h3>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p><?php echo esc_html__('Absolutely! We provide real-time tracking for all orders. You\'ll receive tracking updates via SMS and email, and you can also track your order directly on our website or mobile app.', 'dubaidirect-rwanda'); ?></p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Map Section -->
    <section class="map-section">
        <div class="container">
            <h2 class="section-title"><?php echo esc_html__('Find Us', 'dubaidirect-rwanda'); ?></h2>
            <div class="map-content">
                <div class="map-info">
                    <h3><?php echo esc_html__('Our Office in Kigali', 'dubaidirect-rwanda'); ?></h3>
                    <p><?php echo esc_html__('Visit our office for in-person consultations and product demonstrations.', 'dubaidirect-rwanda'); ?></p>
                    
                    <div class="office-details">
                        <div class="detail-item">
                            <strong><?php echo esc_html__('Address:', 'dubaidirect-rwanda'); ?></strong>
                            <p><?php echo esc_html__('KG 123 Street, Kigali, Rwanda', 'dubaidirect-rwanda'); ?></p>
                        </div>
                        
                        <div class="detail-item">
                            <strong><?php echo esc_html__('Hours:', 'dubaidirect-rwanda'); ?></strong>
                            <p><?php echo esc_html__('Monday - Friday: 8:00 AM - 6:00 PM', 'dubaidirect-rwanda'); ?></p>
                        </div>
                        
                        <div class="detail-item">
                            <strong><?php echo esc_html__('Phone:', 'dubaidirect-rwanda'); ?></strong>
                            <p><?php echo esc_html__('+250 788 123 456', 'dubaidirect-rwanda'); ?></p>
                        </div>
                    </div>
                </div>
                
                <div class="map-container">
                    <!-- Google Maps or OpenStreetMap integration -->
                    <div id="map" class="map"></div>
                </div>
            </div>
        </div>
    </section>

</main>

<?php get_footer(); ?> 