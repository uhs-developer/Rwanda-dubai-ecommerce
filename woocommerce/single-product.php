<?php
/**
 * The Template for displaying all single products
 *
 * @package DubaiDirect_Rwanda
 * @version 1.0.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

get_header('shop'); ?>

<main id="primary" class="site-main product-main">
    
    <?php while (have_posts()) : ?>
        <?php the_post(); ?>
        
        <div class="container">
            <div class="product-layout">
                
                <!-- Product Gallery -->
                <div class="product-gallery">
                    <?php
                    /**
                     * Hook: woocommerce_before_single_product.
                     *
                     * @hooked woocommerce_output_all_notices - 10
                     */
                    do_action('woocommerce_before_single_product');
                    
                    if (post_password_required()) {
                        echo get_the_password_form(); // WPCS: XSS ok.
                        return;
                    }
                    ?>
                    
                    <div id="product-<?php the_ID(); ?>" <?php wc_product_class('', $product); ?>>
                        
                        <div class="product-gallery-container">
                            <div class="gallery-main">
                                <?php
                                /**
                                 * Hook: woocommerce_before_single_product_summary.
                                 *
                                 * @hooked woocommerce_show_product_sale_flash - 10
                                 * @hooked woocommerce_show_product_images - 20
                                 */
                                do_action('woocommerce_before_single_product_summary');
                                ?>
                            </div>
                            
                            <div class="gallery-thumbnails">
                                <?php
                                // Custom thumbnail gallery
                                $attachment_ids = $product->get_gallery_image_ids();
                                if ($attachment_ids && $product->get_image_id()) {
                                    foreach ($attachment_ids as $attachment_id) {
                                        echo wp_get_attachment_image($attachment_id, 'thumbnail', false, array('class' => 'gallery-thumb'));
                                    }
                                }
                                ?>
                            </div>
                        </div>
                        
                    </div>
                </div>
                
                <!-- Product Information -->
                <div class="product-info">
                    <div class="product-summary">
                        <?php
                        /**
                         * Hook: woocommerce_single_product_summary.
                         *
                         * @hooked woocommerce_template_single_title - 5
                         * @hooked woocommerce_template_single_rating - 10
                         * @hooked woocommerce_template_single_price - 10
                         * @hooked woocommerce_template_single_excerpt - 20
                         * @hooked woocommerce_template_single_add_to_cart - 30
                         * @hooked woocommerce_template_single_meta - 40
                         * @hooked woocommerce_template_single_sharing - 50
                         * @hooked WC_Structured_Data::generate_product_data() - 60
                         */
                        do_action('woocommerce_single_product_summary');
                        ?>
                    </div>
                    
                    <!-- Delivery Options -->
                    <div class="delivery-options">
                        <h3><?php echo esc_html__('Delivery Options', 'dubaidirect-rwanda'); ?></h3>
                        <div class="delivery-tiers">
                            <div class="delivery-tier">
                                <div class="tier-header">
                                    <h4><?php echo esc_html__('Express', 'dubaidirect-rwanda'); ?></h4>
                                    <span class="tier-price"><?php echo esc_html__('200-300%', 'dubaidirect-rwanda'); ?></span>
                                </div>
                                <p class="tier-timeline"><?php echo esc_html__('1-2 Days', 'dubaidirect-rwanda'); ?></p>
                                <p class="tier-description"><?php echo esc_html__('For emergency and critical business needs', 'dubaidirect-rwanda'); ?></p>
                            </div>
                            
                            <div class="delivery-tier">
                                <div class="tier-header">
                                    <h4><?php echo esc_html__('Priority', 'dubaidirect-rwanda'); ?></h4>
                                    <span class="tier-price"><?php echo esc_html__('100-150%', 'dubaidirect-rwanda'); ?></span>
                                </div>
                                <p class="tier-timeline"><?php echo esc_html__('3-5 Days', 'dubaidirect-rwanda'); ?></p>
                                <p class="tier-description"><?php echo esc_html__('For urgent business operations', 'dubaidirect-rwanda'); ?></p>
                            </div>
                            
                            <div class="delivery-tier">
                                <div class="tier-header">
                                    <h4><?php echo esc_html__('Standard', 'dubaidirect-rwanda'); ?></h4>
                                    <span class="tier-price"><?php echo esc_html__('50-75%', 'dubaidirect-rwanda'); ?></span>
                                </div>
                                <p class="tier-timeline"><?php echo esc_html__('1-2 Weeks', 'dubaidirect-rwanda'); ?></p>
                                <p class="tier-description"><?php echo esc_html__('For regular business purchases', 'dubaidirect-rwanda'); ?></p>
                            </div>
                            
                            <div class="delivery-tier">
                                <div class="tier-header">
                                    <h4><?php echo esc_html__('Economy', 'dubaidirect-rwanda'); ?></h4>
                                    <span class="tier-price"><?php echo esc_html__('25-40%', 'dubaidirect-rwanda'); ?></span>
                                </div>
                                <p class="tier-timeline"><?php echo esc_html__('1 Month', 'dubaidirect-rwanda'); ?></p>
                                <p class="tier-description"><?php echo esc_html__('For cost-conscious customers', 'dubaidirect-rwanda'); ?></p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Quality Assurance -->
                    <div class="quality-assurance">
                        <h3><?php echo esc_html__('Quality Assurance', 'dubaidirect-rwanda'); ?></h3>
                        <div class="quality-badges">
                            <div class="quality-badge">
                                <div class="badge-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Dubai Tested', 'dubaidirect-rwanda'); ?></span>
                            </div>
                            
                            <div class="quality-badge">
                                <div class="badge-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Warranty Included', 'dubaidirect-rwanda'); ?></span>
                            </div>
                            
                            <div class="quality-badge">
                                <div class="badge-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Quality Assured', 'dubaidirect-rwanda'); ?></span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Social Sharing -->
                    <div class="social-sharing">
                        <h3><?php echo esc_html__('Share This Product', 'dubaidirect-rwanda'); ?></h3>
                        <div class="social-buttons">
                            <a href="https://wa.me/?text=<?php echo urlencode(get_the_title() . ' - ' . get_permalink()); ?>" class="social-btn whatsapp" target="_blank">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                </svg>
                                <?php echo esc_html__('WhatsApp', 'dubaidirect-rwanda'); ?>
                            </a>
                            
                            <a href="https://www.facebook.com/sharer/sharer.php?u=<?php echo urlencode(get_permalink()); ?>" class="social-btn facebook" target="_blank">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                                <?php echo esc_html__('Facebook', 'dubaidirect-rwanda'); ?>
                            </a>
                            
                            <a href="https://twitter.com/intent/tweet?text=<?php echo urlencode(get_the_title()); ?>&url=<?php echo urlencode(get_permalink()); ?>" class="social-btn twitter" target="_blank">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                                <?php echo esc_html__('Twitter', 'dubaidirect-rwanda'); ?>
                            </a>
                        </div>
                    </div>
                    
                </div>
                
            </div>
            
            <!-- Product Tabs -->
            <div class="product-tabs">
                <div class="tabs-navigation">
                    <button class="tab-btn active" data-tab="description"><?php echo esc_html__('Description', 'dubaidirect-rwanda'); ?></button>
                    <button class="tab-btn" data-tab="specifications"><?php echo esc_html__('Specifications', 'dubaidirect-rwanda'); ?></button>
                    <button class="tab-btn" data-tab="reviews"><?php echo esc_html__('Reviews', 'dubaidirect-rwanda'); ?></button>
                    <button class="tab-btn" data-tab="shipping"><?php echo esc_html__('Shipping & Returns', 'dubaidirect-rwanda'); ?></button>
                </div>
                
                <div class="tabs-content">
                    <div class="tab-content active" id="description">
                        <?php the_content(); ?>
                    </div>
                    
                    <div class="tab-content" id="specifications">
                        <?php
                        // Product specifications
                        $specifications = get_post_meta(get_the_ID(), '_product_specifications', true);
                        if ($specifications) {
                            echo wp_kses_post($specifications);
                        } else {
                            echo '<p>' . esc_html__('Specifications not available for this product.', 'dubaidirect-rwanda') . '</p>';
                        }
                        ?>
                    </div>
                    
                    <div class="tab-content" id="reviews">
                        <?php
                        if (comments_open() || get_comments_number()) {
                            comments_template();
                        }
                        ?>
                    </div>
                    
                    <div class="tab-content" id="shipping">
                        <h3><?php echo esc_html__('Shipping Information', 'dubaidirect-rwanda'); ?></h3>
                        <p><?php echo esc_html__('All products are shipped from our Dubai facility to Rwanda. We offer multiple delivery options to suit your timeline and budget.', 'dubaidirect-rwanda'); ?></p>
                        
                        <h4><?php echo esc_html__('Return Policy', 'dubaidirect-rwanda'); ?></h4>
                        <p><?php echo esc_html__('We offer a 30-day return policy for all products. If you\'re not satisfied with your purchase, you can return it for a full refund or replacement.', 'dubaidirect-rwanda'); ?></p>
                        
                        <h4><?php echo esc_html__('Warranty', 'dubaidirect-rwanda'); ?></h4>
                        <p><?php echo esc_html__('All products come with manufacturer warranty. Additional warranty options are available for purchase.', 'dubaidirect-rwanda'); ?></p>
                    </div>
                </div>
            </div>
            
            <!-- Related Products -->
            <div class="related-products">
                <h3><?php echo esc_html__('Related Products', 'dubaidirect-rwanda'); ?></h3>
                <div class="products-grid">
                    <?php
                    $related_products = wc_get_related_products(get_the_ID(), 4);
                    if (!empty($related_products)) {
                        $args = array(
                            'post_type' => 'product',
                            'posts_per_page' => 4,
                            'post__in' => $related_products,
                            'orderby' => 'rand'
                        );
                        
                        $related_query = new WP_Query($args);
                        
                        if ($related_query->have_posts()) {
                            while ($related_query->have_posts()) {
                                $related_query->the_post();
                                wc_get_template_part('content', 'product');
                            }
                            wp_reset_postdata();
                        }
                    }
                    ?>
                </div>
            </div>
            
        </div>
        
        <?php
        /**
         * Hook: woocommerce_after_single_product.
         */
        do_action('woocommerce_after_single_product');
        ?>
        
    <?php endwhile; ?>
    
</main>

<?php get_footer('shop'); ?> 