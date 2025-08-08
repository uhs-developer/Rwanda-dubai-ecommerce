<?php
/**
 * The Template for displaying product archives, including the main shop page
 *
 * @package DubaiDirect_Rwanda
 * @version 1.0.0
 */

defined('ABSPATH') || exit;

get_header('shop'); ?>

<main id="primary" class="site-main shop-main">
    
    <!-- Shop Header -->
    <section class="shop-header">
        <div class="container">
            <div class="shop-header-content">
                <div class="shop-title">
                    <?php if (apply_filters('woocommerce_show_page_title', true)) : ?>
                        <h1 class="woocommerce-products-header__title page-title">
                            <?php woocommerce_page_title(); ?>
                        </h1>
                    <?php endif; ?>
                    
                    <?php
                    /**
                     * Hook: woocommerce_archive_description.
                     *
                     * @hooked woocommerce_taxonomy_archive_description - 10
                     * @hooked woocommerce_product_archive_description - 10
                     */
                    do_action('woocommerce_archive_description');
                    ?>
                </div>
                
                <div class="shop-actions">
                    <div class="view-switcher">
                        <button class="view-btn grid-view active" data-view="grid">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                        </button>
                        <button class="view-btn list-view" data-view="list">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="8" y1="6" x2="21" y2="6"></line>
                                <line x1="8" y1="12" x2="21" y2="12"></line>
                                <line x1="8" y1="18" x2="21" y2="18"></line>
                                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                <line x1="3" y1="18" x2="3.01" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="sort-dropdown">
                        <?php woocommerce_catalog_ordering(); ?>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Shop Content -->
    <section class="shop-content">
        <div class="container">
            <div class="shop-layout">
                
                <!-- Sidebar Filters -->
                <aside class="shop-sidebar">
                    <div class="sidebar-filters">
                        <h3 class="filter-title"><?php echo esc_html__('Filters', 'dubaidirect-rwanda'); ?></h3>
                        
                        <!-- Search Filter -->
                        <div class="filter-group">
                            <h4><?php echo esc_html__('Search Products', 'dubaidirect-rwanda'); ?></h4>
                            <div class="search-filter">
                                <input type="text" id="product-search" placeholder="<?php echo esc_attr__('Search products...', 'dubaidirect-rwanda'); ?>">
                                <button type="button" class="search-btn">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <path d="M21 21l-4.35-4.35"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Category Filter -->
                        <div class="filter-group">
                            <h4><?php echo esc_html__('Categories', 'dubaidirect-rwanda'); ?></h4>
                            <div class="category-filter">
                                <?php
                                $product_categories = get_terms(array(
                                    'taxonomy' => 'product_cat',
                                    'hide_empty' => true,
                                ));
                                
                                if (!empty($product_categories) && !is_wp_error($product_categories)) {
                                    foreach ($product_categories as $category) {
                                        $is_active = is_product_category($category->slug);
                                        ?>
                                        <label class="filter-checkbox <?php echo $is_active ? 'active' : ''; ?>">
                                            <input type="checkbox" name="category[]" value="<?php echo esc_attr($category->slug); ?>" <?php checked($is_active); ?>>
                                            <span class="checkmark"></span>
                                            <?php echo esc_html($category->name); ?>
                                            <span class="count">(<?php echo esc_html($category->count); ?>)</span>
                                        </label>
                                        <?php
                                    }
                                }
                                ?>
                            </div>
                        </div>
                        
                        <!-- Price Filter -->
                        <div class="filter-group">
                            <h4><?php echo esc_html__('Price Range', 'dubaidirect-rwanda'); ?></h4>
                            <div class="price-filter">
                                <div class="price-inputs">
                                    <input type="number" id="min-price" placeholder="<?php echo esc_attr__('Min', 'dubaidirect-rwanda'); ?>" min="0">
                                    <span class="price-separator">-</span>
                                    <input type="number" id="max-price" placeholder="<?php echo esc_attr__('Max', 'dubaidirect-rwanda'); ?>" min="0">
                                </div>
                                <button type="button" class="price-filter-btn"><?php echo esc_html__('Apply', 'dubaidirect-rwanda'); ?></button>
                            </div>
                        </div>
                        
                        <!-- Delivery Filter -->
                        <div class="filter-group">
                            <h4><?php echo esc_html__('Delivery Options', 'dubaidirect-rwanda'); ?></h4>
                            <div class="delivery-filter">
                                <label class="filter-checkbox">
                                    <input type="checkbox" name="delivery[]" value="express">
                                    <span class="checkmark"></span>
                                    <?php echo esc_html__('Express (1-2 Days)', 'dubaidirect-rwanda'); ?>
                                </label>
                                
                                <label class="filter-checkbox">
                                    <input type="checkbox" name="delivery[]" value="priority">
                                    <span class="checkmark"></span>
                                    <?php echo esc_html__('Priority (3-5 Days)', 'dubaidirect-rwanda'); ?>
                                </label>
                                
                                <label class="filter-checkbox">
                                    <input type="checkbox" name="delivery[]" value="standard">
                                    <span class="checkmark"></span>
                                    <?php echo esc_html__('Standard (1-2 Weeks)', 'dubaidirect-rwanda'); ?>
                                </label>
                                
                                <label class="filter-checkbox">
                                    <input type="checkbox" name="delivery[]" value="economy">
                                    <span class="checkmark"></span>
                                    <?php echo esc_html__('Economy (1 Month)', 'dubaidirect-rwanda'); ?>
                                </label>
                            </div>
                        </div>
                        
                        <!-- Quality Filter -->
                        <div class="filter-group">
                            <h4><?php echo esc_html__('Quality Assurance', 'dubaidirect-rwanda'); ?></h4>
                            <div class="quality-filter">
                                <label class="filter-checkbox">
                                    <input type="checkbox" name="quality[]" value="tested">
                                    <span class="checkmark"></span>
                                    <?php echo esc_html__('Dubai Tested', 'dubaidirect-rwanda'); ?>
                                </label>
                                
                                <label class="filter-checkbox">
                                    <input type="checkbox" name="quality[]" value="warranty">
                                    <span class="checkmark"></span>
                                    <?php echo esc_html__('Warranty Included', 'dubaidirect-rwanda'); ?>
                                </label>
                                
                                <label class="filter-checkbox">
                                    <input type="checkbox" name="quality[]" value="certified">
                                    <span class="checkmark"></span>
                                    <?php echo esc_html__('Certified Products', 'dubaidirect-rwanda'); ?>
                                </label>
                            </div>
                        </div>
                        
                        <!-- Clear Filters -->
                        <div class="filter-actions">
                            <button type="button" class="btn btn-secondary btn-full" id="clear-filters">
                                <?php echo esc_html__('Clear All Filters', 'dubaidirect-rwanda'); ?>
                            </button>
                        </div>
                    </div>
                </aside>
                
                <!-- Products Grid -->
                <div class="shop-products">
                    <?php
                    if (woocommerce_product_loop()) {
                        
                        /**
                         * Hook: woocommerce_before_shop_loop.
                         *
                         * @hooked woocommerce_output_all_notices - 10
                         * @hooked woocommerce_result_count - 20
                         * @hooked woocommerce_catalog_ordering - 30
                         */
                        do_action('woocommerce_before_shop_loop');
                        
                        woocommerce_product_loop_start();
                        
                        if (wc_get_loop_prop('is_shortcode')) {
                            $columns = absint(wc_get_loop_prop('columns'));
                        } else {
                            $columns = wc_get_default_products_per_row();
                        }
                        
                        if (have_posts()) {
                            while (have_posts()) {
                                the_post();
                                
                                /**
                                 * Hook: woocommerce_shop_loop.
                                 */
                                do_action('woocommerce_shop_loop');
                                
                                wc_get_template_part('content', 'product');
                            }
                        }
                        
                        woocommerce_product_loop_end();
                        
                        /**
                         * Hook: woocommerce_after_shop_loop.
                         *
                         * @hooked woocommerce_pagination - 10
                         */
                        do_action('woocommerce_after_shop_loop');
                        
                    } else {
                        /**
                         * Hook: woocommerce_no_products_found.
                         *
                         * @hooked wc_no_products_found - 10
                         */
                        do_action('woocommerce_no_products_found');
                    }
                    
                    /**
                     * Hook: woocommerce_after_main_content.
                     *
                     * @hooked woocommerce_output_content_wrapper_end - 10 (outputs closing divs for the content)
                     */
                    do_action('woocommerce_after_main_content');
                    ?>
                </div>
                
            </div>
        </div>
    </section>

</main>

<?php
/**
 * Hook: woocommerce_after_main_content.
 *
 * @hooked woocommerce_output_content_wrapper_end - 10 (outputs closing divs for the content)
 */
do_action('woocommerce_after_main_content');

get_footer('shop');
?> 