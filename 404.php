<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package DubaiDirect_Rwanda
 * @version 1.0.0
 */

get_header();
?>

<main id="primary" class="site-main">
    <div class="error-404-wrapper">
        <div class="error-404-content">
            
            <!-- 404 Visual -->
            <div class="error-404-visual">
                <div class="error-404-number">404</div>
                <div class="error-404-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                </div>
            </div>

            <!-- Error Message -->
            <div class="error-404-message">
                <h1 class="error-404-title">
                    <?php esc_html_e('Page Not Found', 'dubaidirect-rwanda'); ?>
                </h1>
                <p class="error-404-description">
                    <?php esc_html_e('The page you\'re looking for doesn\'t exist or has been moved. Let\'s help you find what you need.', 'dubaidirect-rwanda'); ?>
                </p>
            </div>

            <!-- Action Buttons -->
            <div class="error-404-actions">
                <a href="<?php echo esc_url(home_url('/')); ?>" class="error-404-btn error-404-btn-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9,22 9,12 15,12 15,22"/>
                    </svg>
                    <?php esc_html_e('Go Home', 'dubaidirect-rwanda'); ?>
                </a>
                
                <a href="<?php echo esc_url(get_permalink(wc_get_page_id('shop'))); ?>" class="error-404-btn error-404-btn-secondary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    <?php esc_html_e('Browse Products', 'dubaidirect-rwanda'); ?>
                </a>
            </div>

            <!-- Search Section -->
            <div class="error-404-search">
                <h3><?php esc_html_e('Search for Products', 'dubaidirect-rwanda'); ?></h3>
                <div class="error-404-search-form">
                    <?php get_search_form(); ?>
                </div>
            </div>

            <!-- Popular Categories -->
            <div class="error-404-categories">
                <h3><?php esc_html_e('Popular Categories', 'dubaidirect-rwanda'); ?></h3>
                <div class="error-404-categories-grid">
                    <?php
                    $popular_categories = get_terms(array(
                        'taxonomy' => 'product_cat',
                        'number' => 6,
                        'orderby' => 'count',
                        'order' => 'DESC',
                        'hide_empty' => true,
                    ));

                    if (!empty($popular_categories) && !is_wp_error($popular_categories)) :
                        foreach ($popular_categories as $category) :
                            $category_link = get_term_link($category);
                            if (!is_wp_error($category_link)) :
                    ?>
                        <a href="<?php echo esc_url($category_link); ?>" class="error-404-category-item">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <path d="M16 10a4 4 0 0 1-8 0"/>
                            </svg>
                            <span><?php echo esc_html($category->name); ?></span>
                        </a>
                    <?php
                            endif;
                        endforeach;
                    else :
                    ?>
                        <a href="<?php echo esc_url(get_permalink(wc_get_page_id('shop'))); ?>" class="error-404-category-item">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <path d="M16 10a4 4 0 0 1-8 0"/>
                            </svg>
                            <span><?php esc_html_e('All Products', 'dubaidirect-rwanda'); ?></span>
                        </a>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Help Links -->
            <div class="error-404-help">
                <h3><?php esc_html_e('Need Help?', 'dubaidirect-rwanda'); ?></h3>
                <div class="error-404-help-links">
                    <a href="<?php echo esc_url(get_permalink(get_page_by_path('contact'))); ?>" class="error-404-help-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        <?php esc_html_e('Contact Support', 'dubaidirect-rwanda'); ?>
                    </a>
                    <a href="<?php echo esc_url(get_permalink(get_page_by_path('faqs'))); ?>" class="error-404-help-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        <?php esc_html_e('FAQs', 'dubaidirect-rwanda'); ?>
                    </a>
                </div>
            </div>

        </div>
    </div>
</main>


<?php
get_footer();
