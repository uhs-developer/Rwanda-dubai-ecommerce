<?php
/**
 * Template Name: Contact Page
 *
 * @package DubaiDirect
 */

get_header(); ?>

<main class="contact-page">

    <div class="contact-content">
        <!-- Left Section - Contact Information -->
        <div class="contact-info">
            <div class="contact-details">
                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="fa-solid fa-phone"></i>
                    </div>
                    <div class="contact-text">
                        <h3>Phone</h3>
                        <p>(800) 686-6688</p>
                    </div>
                </div>

                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="fa-solid fa-envelope"></i>
                    </div>
                    <div class="contact-text">
                        <h3>Email</h3>
                        <p>info.deercreative@gmail.com</p>
                    </div>
                </div>

                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="fa-solid fa-clock"></i>
                    </div>
                    <div class="contact-text">
                        <h3>Business Hours</h3>
                        <p>Open hours: 8.00-18.00 Mon-Fri</p>
                        <p>Sunday: Closed</p>
                    </div>
                </div>
            </div>

            <!-- Social Media Section -->
            <div class="social-section">
                <h3>Follow Us</h3>
                <div class="social-icons">
                    <a href="#" class="social-icon facebook" aria-label="Facebook">
                        <i class="fa-brands fa-facebook-f"></i>
                    </a>
                    <a href="#" class="social-icon twitter" aria-label="Twitter">
                        <i class="fa-brands fa-x-twitter"></i>
                    </a>
                    <a href="#" class="social-icon google" aria-label="Google+">
                        <i class="fa-brands fa-google-plus-g"></i>
                    </a>
                    <a href="#" class="social-icon instagram" aria-label="Instagram">
                        <i class="fa-brands fa-instagram"></i>
                    </a>
                </div>
            </div>
        </div>

        <!-- Right Section - Contact Form -->
        <div class="contact-form-section">
            <div class="form-header">
                <h2>Get in Touch with Us:</h2>
                <p>Fill out the form below to receive a free and confidential consultation.</p>
            </div>

            <?php echo do_shortcode('[contact-form-7 id="72531c1" title="rwanda-dubai-form"]'); ?>
        </div>
    </div>
</main>

<?php get_footer(); ?>