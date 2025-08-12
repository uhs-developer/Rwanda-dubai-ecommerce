<?php
/**
 * 404 Error Page Template
 *
 * @package DubaiDirect
 */

get_header(); ?>

<main class="error-404-page">
    <div class="container">
        <div class="error-content">
            <!-- 404 Icon -->
            <div class="error-icon">
                <i class="fa-solid fa-exclamation-triangle"></i>
            </div>

            <!-- Error Message -->
            <div class="error-message">
                <h1 class="error-title">404</h1>
                <h2 class="error-subtitle">Page Not Found</h2>
                <p class="error-description">
                    Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
                </p>
            </div>


            <!-- Help Section -->
            <div class="help-section">
                <h3>Need Help?</h3>
                <p>If you can't find what you're looking for, our customer support team is here to help.</p>
                <div class="help-actions">
                    <a href="<?php echo esc_url(home_url('/contact/')); ?>" class="btn btn-primary">
                        <i class="fa-solid fa-headset"></i>
                        Contact Support
                    </a>
                    <a href="<?php echo esc_url(home_url('/')); ?>" class="btn btn-secondary">
                        <i class="fa-solid fa-arrow-left"></i>
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    </div>
</main>

<?php get_footer(); ?>
