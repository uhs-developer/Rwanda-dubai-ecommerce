<?php
/**
 * Template Name: Contact Page
 *
 * @package DubaiDirect
 */

get_header(); ?>

<main class="contact-page">
    <div class="container">
        <!-- Contact Header -->
        <div class="contact-header">
            <h1 class="contact-title">Contact Us</h1>
            <p class="contact-intro">There are many ways to contact us. You may drop us a line, give us a call or send an email, choose what suits you the most.</p>
        </div>

        <!-- Contact Content -->
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

                <form class="contact-form" action="#" method="post">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="name" class="form-label">Name</label>
                            <input type="text" id="name" name="name" class="form-input" placeholder="Your name" required>
                        </div>
                        <div class="form-group">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" id="email" name="email" class="form-input" placeholder="Your email" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="website" class="form-label">Website</label>
                        <input type="url" id="website" name="website" class="form-input" placeholder="Your website (optional)">
                    </div>

                    <div class="form-group">
                        <label for="message" class="form-label">Message</label>
                        <textarea id="message" name="message" class="form-textarea" placeholder="Your message" rows="6" required></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary">Send Message</button>
                </form>
            </div>
        </div>
    </div>
</main>

<?php get_footer(); ?> 
