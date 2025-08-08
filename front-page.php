<?php
/**
 * Template Name: Homepage
 * The front page template file
 * 
 * @package DubaiDirect_Rwanda
 * @version 1.0.0
 */

get_header(); ?>

<main id="primary" class="site-main">
    
    <!-- Hero Section -->
    <section class="hero-section">
        <div class="hero-background">
            <img src="<?php echo get_template_directory_uri(); ?>/assets/images/hero-rwanda.jpg" alt="Rwanda landscape" class="hero-image">
            <div class="hero-overlay"></div>
        </div>
        
        <div class="hero-content">
            <div class="container">
                <h1 class="hero-title">
                    <?php echo esc_html__('Premium Electronics & Auto Parts', 'dubaidirect-rwanda'); ?>
                    <span class="hero-subtitle"><?php echo esc_html__('Direct from Dubai to Rwanda', 'dubaidirect-rwanda'); ?></span>
                </h1>
                <p class="hero-description">
                    <?php echo esc_html__('Quality-assured products with flexible delivery options. Trust, transparency, and excellence in every order.', 'dubaidirect-rwanda'); ?>
                </p>
                <div class="hero-actions">
                    <a href="<?php echo esc_url(get_permalink(get_option('woocommerce_shop_page_id'))); ?>" class="btn btn-primary">
                        <?php echo esc_html__('Shop Now', 'dubaidirect-rwanda'); ?>
                    </a>
                    <a href="<?php echo esc_url(get_permalink(get_page_by_path('about-us'))); ?>" class="btn btn-secondary">
                        <?php echo esc_html__('Learn More', 'dubaidirect-rwanda'); ?>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Trust Indicators -->
    <section class="trust-indicators">
        <div class="container">
            <div class="trust-grid">
                <div class="trust-item">
                    <div class="trust-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <h3><?php echo esc_html__('Quality Assured', 'dubaidirect-rwanda'); ?></h3>
                    <p><?php echo esc_html__('Every product tested in Dubai before shipment', 'dubaidirect-rwanda'); ?></p>
                </div>
                
                <div class="trust-item">
                    <div class="trust-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <h3><?php echo esc_html__('Fast Delivery', 'dubaidirect-rwanda'); ?></h3>
                    <p><?php echo esc_html__('1 day to 3 months - choose your timeline', 'dubaidirect-rwanda'); ?></p>
                </div>
                
                <div class="trust-item">
                    <div class="trust-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                        </svg>
                    </div>
                    <h3><?php echo esc_html__('Secure Payment', 'dubaidirect-rwanda'); ?></h3>
                    <p><?php echo esc_html__('Mobile Money, Cards, Bank Transfer', 'dubaidirect-rwanda'); ?></p>
                </div>
                
                <div class="trust-item">
                    <div class="trust-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"/>
                        </svg>
                    </div>
                    <h3><?php echo esc_html__('Real-time Tracking', 'dubaidirect-rwanda'); ?></h3>
                    <p><?php echo esc_html__('Track your order from Dubai to Rwanda', 'dubaidirect-rwanda'); ?></p>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Categories -->
    <section class="featured-categories">
        <div class="container">
            <h2 class="section-title"><?php echo esc_html__('Shop by Category', 'dubaidirect-rwanda'); ?></h2>
            <p class="section-subtitle"><?php echo esc_html__('Discover our premium selection of electronics and auto parts, carefully curated for the Rwandan market.', 'dubaidirect-rwanda'); ?></p>
            
            <div class="category-grid">
                <!-- Electronics Category -->
                <div class="category-card">
                    <div class="category-image">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/images/category-electronics.jpg" alt="Electronics">
                        <div class="category-overlay">
                            <div class="category-badge"><?php echo esc_html__('PREMIUM', 'dubaidirect-rwanda'); ?></div>
                        </div>
                    </div>
                    <div class="category-content">
                        <h3 class="category-title"><?php echo esc_html__('Electronics', 'dubaidirect-rwanda'); ?></h3>
                        <p class="category-description"><?php echo esc_html__('Smartphones, laptops, tablets, and home appliances. Quality-assured electronics with comprehensive warranty.', 'dubaidirect-rwanda'); ?></p>
                        
                        <div class="subcategories">
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Smartphones', 'dubaidirect-rwanda'); ?></span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Laptops', 'dubaidirect-rwanda'); ?></span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Tablets', 'dubaidirect-rwanda'); ?></span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Accessories', 'dubaidirect-rwanda'); ?></span>
                            </div>
                        </div>
                        
                        <div class="category-features">
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <?php echo esc_html__('Dubai Tested', 'dubaidirect-rwanda'); ?>
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <?php echo esc_html__('1 Year Warranty', 'dubaidirect-rwanda'); ?>
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <?php echo esc_html__('Free Support', 'dubaidirect-rwanda'); ?>
                            </span>
                        </div>
                        <a href="<?php echo esc_url(get_term_link('electronics', 'product_cat')); ?>" class="btn btn-primary">
                            <?php echo esc_html__('Shop Electronics', 'dubaidirect-rwanda'); ?>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>
                
                <!-- Auto Parts Category -->
                <div class="category-card">
                    <div class="category-image">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/images/category-auto-parts.jpg" alt="Auto Parts">
                        <div class="category-overlay">
                            <div class="category-badge"><?php echo esc_html__('QUALITY', 'dubaidirect-rwanda'); ?></div>
                        </div>
                    </div>
                    <div class="category-content">
                        <h3 class="category-title"><?php echo esc_html__('Auto Parts', 'dubaidirect-rwanda'); ?></h3>
                        <p class="category-description"><?php echo esc_html__('Engine components, electrical systems, and performance parts. Genuine parts with compatibility guarantee.', 'dubaidirect-rwanda'); ?></p>
                        
                        <div class="subcategories">
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Engine Parts', 'dubaidirect-rwanda'); ?></span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Electrical', 'dubaidirect-rwanda'); ?></span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Performance', 'dubaidirect-rwanda'); ?></span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Suspension', 'dubaidirect-rwanda'); ?></span>
                            </div>
                        </div>
                        
                        <div class="category-features">
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <?php echo esc_html__('Genuine Parts', 'dubaidirect-rwanda'); ?>
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <?php echo esc_html__('Compatibility Check', 'dubaidirect-rwanda'); ?>
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <?php echo esc_html__('Expert Advice', 'dubaidirect-rwanda'); ?>
                            </span>
                        </div>
                        <a href="<?php echo esc_url(get_term_link('auto-parts', 'product_cat')); ?>" class="btn btn-primary">
                            <?php echo esc_html__('Shop Auto Parts', 'dubaidirect-rwanda'); ?>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>
                
                <!-- Smartphones Category -->
                <div class="category-card">
                    <div class="category-image">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/images/category-smartphones.jpg" alt="Smartphones">
                        <div class="category-overlay">
                            <div class="category-badge"><?php echo esc_html__('LATEST', 'dubaidirect-rwanda'); ?></div>
                        </div>
                    </div>
                    <div class="category-content">
                        <h3 class="category-title"><?php echo esc_html__('Smartphones', 'dubaidirect-rwanda'); ?></h3>
                        <p class="category-description"><?php echo esc_html__('Latest iPhone, Samsung, and premium Android devices. Unlocked and ready for Rwandan networks.', 'dubaidirect-rwanda'); ?></p>
                        
                        <div class="subcategories">
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('iPhone', 'dubaidirect-rwanda'); ?></span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Samsung', 'dubaidirect-rwanda'); ?></span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Android', 'dubaidirect-rwanda'); ?></span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Accessories', 'dubaidirect-rwanda'); ?></span>
                            </div>
                        </div>
                        
                        <div class="category-features">
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <?php echo esc_html__('Unlocked', 'dubaidirect-rwanda'); ?>
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <?php echo esc_html__('Network Ready', 'dubaidirect-rwanda'); ?>
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <?php echo esc_html__('2 Year Warranty', 'dubaidirect-rwanda'); ?>
                            </span>
                        </div>
                        <a href="<?php echo esc_url(get_term_link('smartphones', 'product_cat')); ?>" class="btn btn-primary">
                            <?php echo esc_html__('Shop Smartphones', 'dubaidirect-rwanda'); ?>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>
                
                <!-- Laptops Category -->
                <div class="category-card">
                    <div class="category-image">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/images/category-laptops.jpg" alt="Laptops">
                        <div class="category-overlay">
                            <div class="category-badge"><?php echo esc_html__('PROFESSIONAL', 'dubaidirect-rwanda'); ?></div>
                        </div>
                    </div>
                    <div class="category-content">
                        <h3 class="category-title"><?php echo esc_html__('Laptops', 'dubaidirect-rwanda'); ?></h3>
                        <p class="category-description"><?php echo esc_html__('MacBook, Dell, HP, and Lenovo laptops. Perfect for business, education, and creative work.', 'dubaidirect-rwanda'); ?></p>
                        
                        <div class="subcategories">
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('MacBook', 'dubaidirect-rwanda'); ?></span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Dell', 'dubaidirect-rwanda'); ?></span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('HP', 'dubaidirect-rwanda'); ?></span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Lenovo', 'dubaidirect-rwanda'); ?></span>
                            </div>
                        </div>
                        
                        <div class="category-features">
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <?php echo esc_html__('Business Ready', 'dubaidirect-rwanda'); ?>
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <?php echo esc_html__('Latest Specs', 'dubaidirect-rwanda'); ?>
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <?php echo esc_html__('Setup Included', 'dubaidirect-rwanda'); ?>
                            </span>
                        </div>
                        <a href="<?php echo esc_url(get_term_link('laptops', 'product_cat')); ?>" class="btn btn-primary">
                            <?php echo esc_html__('Shop Laptops', 'dubaidirect-rwanda'); ?>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>
                
                <!-- Home Appliances Category -->
                <div class="category-card">
                    <div class="category-image">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/images/category-appliances.jpg" alt="Home Appliances">
                        <div class="category-overlay">
                            <div class="category-badge"><?php echo esc_html__('SMART HOME', 'dubaidirect-rwanda'); ?></div>
                        </div>
                    </div>
                    <div class="category-content">
                        <h3 class="category-title"><?php echo esc_html__('Home Appliances', 'dubaidirect-rwanda'); ?></h3>
                        <p class="category-description"><?php echo esc_html__('Refrigerators, washing machines, air conditioners, and smart home devices for modern living.', 'dubaidirect-rwanda'); ?></p>
                        
                        <div class="subcategories">
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M3 7l9-4 9 4M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Refrigerators', 'dubaidirect-rwanda'); ?></span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M3 7l9-4 9 4M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Washing Machines', 'dubaidirect-rwanda'); ?></span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M3 7l9-4 9 4M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Air Conditioners', 'dubaidirect-rwanda'); ?></span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M3 7l9-4 9 4M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Smart Home', 'dubaidirect-rwanda'); ?></span>
                            </div>
                        </div>
                        
                        <div class="category-features">
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <?php echo esc_html__('Energy Efficient', 'dubaidirect-rwanda'); ?>
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <?php echo esc_html__('Installation Service', 'dubaidirect-rwanda'); ?>
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <?php echo esc_html__('5 Year Warranty', 'dubaidirect-rwanda'); ?>
                            </span>
                        </div>
                        <a href="<?php echo esc_url(get_term_link('home-appliances', 'product_cat')); ?>" class="btn btn-primary">
                            <?php echo esc_html__('Shop Appliances', 'dubaidirect-rwanda'); ?>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>
                
                <!-- Performance Parts Category -->
                <div class="category-card">
                    <div class="category-image">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/images/category-performance.jpg" alt="Performance Parts">
                        <div class="category-overlay">
                            <div class="category-badge"><?php echo esc_html__('PERFORMANCE', 'dubaidirect-rwanda'); ?></div>
                        </div>
                    </div>
                    <div class="category-content">
                        <h3 class="category-title"><?php echo esc_html__('Performance Parts', 'dubaidirect-rwanda'); ?></h3>
                        <p class="category-description"><?php echo esc_html__('Exhaust systems, suspension components, and performance upgrades for enhanced vehicle performance.', 'dubaidirect-rwanda'); ?></p>
                        
                        <div class="subcategories">
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Exhaust Systems', 'dubaidirect-rwanda'); ?></span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Suspension', 'dubaidirect-rwanda'); ?></span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Turbo Kits', 'dubaidirect-rwanda'); ?></span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                </div>
                                <span><?php echo esc_html__('Brake Systems', 'dubaidirect-rwanda'); ?></span>
                            </div>
                        </div>
                        
                        <div class="category-features">
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <?php echo esc_html__('Racing Grade', 'dubaidirect-rwanda'); ?>
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <?php echo esc_html__('Installation Guide', 'dubaidirect-rwanda'); ?>
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <?php echo esc_html__('Lifetime Support', 'dubaidirect-rwanda'); ?>
                            </span>
                        </div>
                        <a href="<?php echo esc_url(get_term_link('performance-parts', 'product_cat')); ?>" class="btn btn-primary">
                            <?php echo esc_html__('Shop Performance', 'dubaidirect-rwanda'); ?>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Products -->
    <section class="featured-products">
        <div class="container">
            <h2 class="section-title"><?php echo esc_html__('Featured Products', 'dubaidirect-rwanda'); ?></h2>
            <div class="products-grid">
                <?php
                $featured_products = wc_get_featured_product_ids();
                if (!empty($featured_products)) {
                    $args = array(
                        'post_type' => 'product',
                        'posts_per_page' => 8,
                        'post__in' => $featured_products,
                        'meta_query' => array(
                            array(
                                'key' => '_visibility',
                                'value' => array('catalog', 'visible'),
                                'compare' => 'IN'
                            )
                        )
                    );
                    
                    $featured_query = new WP_Query($args);
                    
                    if ($featured_query->have_posts()) {
                        while ($featured_query->have_posts()) {
                            $featured_query->the_post();
                            wc_get_template_part('content', 'product');
                        }
                        wp_reset_postdata();
                    }
                }
                ?>
            </div>
            <div class="text-center">
                <a href="<?php echo esc_url(get_permalink(get_option('woocommerce_shop_page_id'))); ?>" class="btn btn-primary">
                    <?php echo esc_html__('View All Products', 'dubaidirect-rwanda'); ?>
                </a>
            </div>
        </div>
    </section>

    <!-- Delivery Options -->
    <section class="delivery-options">
        <div class="container">
            <h2 class="section-title"><?php echo esc_html__('Flexible Delivery Options', 'dubaidirect-rwanda'); ?></h2>
            <div class="delivery-grid">
                <div class="delivery-tier">
                    <div class="tier-header">
                        <h3><?php echo esc_html__('Express', 'dubaidirect-rwanda'); ?></h3>
                        <span class="tier-price"><?php echo esc_html__('200-300%', 'dubaidirect-rwanda'); ?></span>
                    </div>
                    <p class="tier-timeline"><?php echo esc_html__('1-2 Days', 'dubaidirect-rwanda'); ?></p>
                    <p class="tier-description"><?php echo esc_html__('For emergency and critical business needs', 'dubaidirect-rwanda'); ?></p>
                </div>
                
                <div class="delivery-tier">
                    <div class="tier-header">
                        <h3><?php echo esc_html__('Priority', 'dubaidirect-rwanda'); ?></h3>
                        <span class="tier-price"><?php echo esc_html__('100-150%', 'dubaidirect-rwanda'); ?></span>
                    </div>
                    <p class="tier-timeline"><?php echo esc_html__('3-5 Days', 'dubaidirect-rwanda'); ?></p>
                    <p class="tier-description"><?php echo esc_html__('For urgent business operations', 'dubaidirect-rwanda'); ?></p>
                </div>
                
                <div class="delivery-tier">
                    <div class="tier-header">
                        <h3><?php echo esc_html__('Standard', 'dubaidirect-rwanda'); ?></h3>
                        <span class="tier-price"><?php echo esc_html__('50-75%', 'dubaidirect-rwanda'); ?></span>
                    </div>
                    <p class="tier-timeline"><?php echo esc_html__('1-2 Weeks', 'dubaidirect-rwanda'); ?></p>
                    <p class="tier-description"><?php echo esc_html__('For regular business purchases', 'dubaidirect-rwanda'); ?></p>
                </div>
                
                <div class="delivery-tier">
                    <div class="tier-header">
                        <h3><?php echo esc_html__('Economy', 'dubaidirect-rwanda'); ?></h3>
                        <span class="tier-price"><?php echo esc_html__('25-40%', 'dubaidirect-rwanda'); ?></span>
                    </div>
                    <p class="tier-timeline"><?php echo esc_html__('1 Month', 'dubaidirect-rwanda'); ?></p>
                    <p class="tier-description"><?php echo esc_html__('For cost-conscious customers', 'dubaidirect-rwanda'); ?></p>
                </div>
            </div>
        </div>
    </section>

    <!-- Customer Reviews -->
    <section class="customer-reviews">
        <div class="container">
            <h2 class="section-title"><?php echo esc_html__('What Our Customers Say', 'dubaidirect-rwanda'); ?></h2>
            <div class="reviews-grid">
                <?php
                // Display customer reviews/testimonials
                $testimonials = get_posts(array(
                    'post_type' => 'testimonial',
                    'posts_per_page' => 3,
                    'post_status' => 'publish'
                ));
                
                foreach ($testimonials as $testimonial) {
                    ?>
                    <div class="review-card">
                        <div class="review-content">
                            <p><?php echo esc_html(get_post_meta($testimonial->ID, '_testimonial_content', true)); ?></p>
                        </div>
                        <div class="review-author">
                            <div class="author-avatar">
                                <?php echo get_avatar(get_post_meta($testimonial->ID, '_testimonial_email', true), 60); ?>
                            </div>
                            <div class="author-info">
                                <h4><?php echo esc_html($testimonial->post_title); ?></h4>
                                <p><?php echo esc_html(get_post_meta($testimonial->ID, '_testimonial_location', true)); ?></p>
                            </div>
                        </div>
                    </div>
                    <?php
                }
                ?>
            </div>
        </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section">
        <div class="container">
            <div class="cta-content">
                <h2><?php echo esc_html__('Ready to Shop Quality Products?', 'dubaidirect-rwanda'); ?></h2>
                <p><?php echo esc_html__('Join thousands of satisfied customers in Rwanda who trust DubaiDirect for their electronics and auto parts needs.', 'dubaidirect-rwanda'); ?></p>
                <div class="cta-actions">
                    <a href="<?php echo esc_url(get_permalink(get_option('woocommerce_shop_page_id'))); ?>" class="btn btn-primary btn-large">
                        <?php echo esc_html__('Start Shopping', 'dubaidirect-rwanda'); ?>
                    </a>
                    <a href="<?php echo esc_url(get_permalink(get_page_by_path('contact'))); ?>" class="btn btn-secondary btn-large">
                        <?php echo esc_html__('Contact Us', 'dubaidirect-rwanda'); ?>
                    </a>
                </div>
            </div>
        </div>
    </section>

</main>

<?php get_footer(); ?> 