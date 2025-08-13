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
            <img src="<?php echo get_template_directory_uri(); ?>/assets/images/hero-rwanda.jpg" alt="Rwanda landscape"
                class="hero-image">
            <div class="hero-overlay"></div>
        </div>

        <div class="hero-content">
            <div class="container">
                <h1 class="hero-title">
                    <?php echo esc_html__('Premium Electronics & Auto Parts', 'dubaidirect-rwanda'); ?>
                    <span
                        class="hero-subtitle"><?php echo esc_html__('Direct from Dubai to Rwanda', 'dubaidirect-rwanda'); ?></span>
                </h1>
                <p class="hero-description">
                    <?php echo esc_html__('Quality-assured products with flexible delivery options. Trust, transparency, and excellence in every order.', 'dubaidirect-rwanda'); ?>
                </p>
                <div class="hero-actions">
                    <a href="<?php echo esc_url(get_permalink(get_option('woocommerce_shop_page_id'))); ?>"
                        class="btn btn-primary">
                        <?php echo esc_html__('Shop Now', 'dubaidirect-rwanda'); ?>
                    </a>
                    <a href="<?php echo esc_url(get_permalink(get_page_by_path('about-us'))); ?>"
                        class="btn btn-secondary">
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
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3><?php echo esc_html__('Quality Assured', 'dubaidirect-rwanda'); ?></h3>
                    <p><?php echo esc_html__('Every product tested in Dubai before shipment', 'dubaidirect-rwanda'); ?>
                    </p>
                </div>

                <div class="trust-item">
                    <div class="trust-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3><?php echo esc_html__('Fast Delivery', 'dubaidirect-rwanda'); ?></h3>
                    <p><?php echo esc_html__('1 day to 3 months - choose your timeline', 'dubaidirect-rwanda'); ?></p>
                </div>

                <div class="trust-item">
                    <div class="trust-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    <h3><?php echo esc_html__('Secure Payment', 'dubaidirect-rwanda'); ?></h3>
                    <p><?php echo esc_html__('Mobile Money, Cards, Bank Transfer', 'dubaidirect-rwanda'); ?></p>
                </div>

                <div class="trust-item">
                    <div class="trust-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path
                                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
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
            <h2 class="section-title">Shop by Category</h2>
            <p class="section-subtitle">
                Discover our premium selection of electronics and auto parts, carefully curated for the Rwandan market.
            </p>

            <div class="category-grid">
                <div class="category-card">
                    <div class="category-image">
                        <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop" alt="Electronics">
                    </div>
                    <div class="category-content">
                        <h3 class="category-title">Electronics</h3>
                        <p class="category-description">Smartphones, laptops, tablets, and home appliances. Quality-assured electronics with comprehensive warranty.</p>
                        
                        <div class="subcategories">
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <span>Smartphones</span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <span>Laptops</span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <span>Tablets</span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <span>Accessories</span>
                            </div>
                        </div>
                        
                        <div class="category-features">
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Dubai Tested
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                1 Year Warranty
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Free Support
                            </span>
                        </div>
                        <a href="' . esc_url(home_url('/product-page/')) . '" class="btn btn-primary">
                            Shop Electronics
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>

                <div class="category-card">
                    <div class="category-image">
                        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop" alt="Auto Parts">
                    </div>
                    <div class="category-content">
                        <h3 class="category-title">Auto Parts</h3>
                        <p class="category-description">Engine components, electrical systems, and performance parts. Genuine parts with compatibility guarantee.</p>
                        
                        <div class="subcategories">
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                </div>
                                <span>Engine Parts</span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <span>Electrical</span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <span>Performance</span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <span>Suspension</span>
                            </div>
                        </div>
                        
                        <div class="category-features">
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Genuine Parts
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Compatibility Check
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                               Expert Advice
                            </span>
                        </div>
                        <a href="' . esc_url(home_url('/product-page/')) . '" class="btn btn-primary">
                            Shop Auto Parts
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>             

                <div class="category-card">
                    <div class="category-image">
                        <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop" alt="Smartphones">
                    </div>
                    <div class="category-content">
                        <h3 class="category-title">Smartphones</h3>
                        <p class="category-description">Latest iPhone, Samsung, and premium Android devices. Unlocked and ready for Rwandan networks.</p>
                        
                        <div class="subcategories">
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <span>iPhone</span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <span>Samsung</span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <span>Android</span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <span>Accessories </span>
                            </div>
                        </div>
                        
                        <div class="category-features">
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Unlocked
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Network Ready
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                2 Year Warranty
                            </span>
                        </div>
                        <a href="' . esc_url(home_url('/product-page/')) . '" class="btn btn-primary">
                            Shop Smartphones
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>
                
                <div class="category-card">
                    <div class="category-image">
                        <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop" alt="Laptops">
                    </div>
                    <div class="category-content">
                        <h3 class="category-title">Laptops</h3>
                        <p class="category-description">MacBook, Dell, HP, and Lenovo laptops. Perfect for business, education, and creative work></p>
                        
                        <div class="subcategories">
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <span>MacBook</span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <span>Dell</span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <span>HP</span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <span>Lenovo</span>
                            </div>
                        </div>
                        
                        <div class="category-features">
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Business Ready
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Latest Specs
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Setup Included
                            </span>
                        </div>
                        <a href="' . esc_url(home_url('/product-page/')) . '" class="btn btn-primary">
                            Shop Laptops
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>
                
                <div class="category-card">
                    <div class="category-image">
                        <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop" alt="Home Appliances">
                    </div>
                    <div class="category-content">
                        <h3 class="category-title">Home Appliances</h3>
                        <p class="category-description">Refrigerators, washing machines, air conditioners, and smart home devices for modern living.</p>
                        
                        <div class="subcategories">
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M3 7l9-4 9 4M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <span>Refrigerators</span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M3 7l9-4 9 4M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <span>Washing Machines</span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M3 7l9-4 9 4M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <span>Air Conditioners</span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M3 7l9-4 9 4M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <span>Smart Home</span>
                            </div>
                        </div>
                        
                        <div class="category-features">
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Energy Efficient
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Installation Service
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                5 Year Warranty
                            </span>
                        </div>
                        <a href="' . esc_url(home_url('/product-page/')) . '" class="btn btn-primary">
                            Shop Appliances
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>
                
                <div class="category-card">
                    <div class="category-image">
                        <img src="https://images.unsplash.com/photo-1562141964-9d3c5a7124b0?w=400&h=400&fit=crop" alt="Performance Parts">
                    </div>
                    <div class="category-content">
                        <h3 class="category-title">Performance Parts</h3>
                        <p class="category-description">Exhaust systems, suspension components, and performance upgrades for enhanced vehicle performance</p>
                        
                        <div class="subcategories">
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                </div>
                                <span>Exhaust Systems</span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                </div>
                                <span>Suspension</span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                </div>
                                <span>Turbo Kits</span>
                            </div>
                            <div class="subcategory-item">
                                <div class="subcategory-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                </div>
                                <span>Brake Systems</span>
                            </div>
                        </div>
                        
                        <div class="category-features">
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Racing Grade
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Installation Guide
                            </span>
                            <span class="feature-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Lifetime Support
                            </span>
                        </div>
                       <a href="' . esc_url(home_url('/product-page/')) . '" class="btn btn-primary">
                            Shop Performance
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Latest Blogs -->
    <section class="latest-blogs">
        <div class="container">
            <h2 class="section-title">Latest Blogs</h2>

            <div class="blog-grid">
                <article class="blog-card">
                    <a href="#" class="blog-card-link">
                        <figure class="blog-card-media">
                            <img class="blog-card-image" loading="lazy" alt="Travel Inspiration"
                                 src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop" />
                            <figcaption class="blog-card-overlay">
                                <span class="blog-card-title">Travel Inspiration</span>
                            </figcaption>
                        </figure>
                    </a>
                </article>

                <article class="blog-card">
                    <a href="#" class="blog-card-link">
                        <figure class="blog-card-media">
                            <img class="blog-card-image" loading="lazy" alt="Beauty Trends"
                                 src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop" />
                            <figcaption class="blog-card-overlay">
                                <span class="blog-card-title">Beauty Trends</span>
                            </figcaption>
                        </figure>
                    </a>
                </article>

                <article class="blog-card">
                    <a href="#" class="blog-card-link">
                        <figure class="blog-card-media">
                            <img class="blog-card-image" loading="lazy" alt="Style Essentials"
                                 src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1200&auto=format&fit=crop" />
                            <figcaption class="blog-card-overlay">
                                <span class="blog-card-title">Style Essentials</span>
                            </figcaption>
                        </figure>
                    </a>
                </article>
            </div>
        </div>
    </section>

    <!-- Newsletter -->
    <section class="newsletter-section">
        <div class="container">
            <div class="newsletter-bar">
                <div class="newsletter-text">
                    <h3 class="newsletter-title">Newsletter</h3>
                    <p class="newsletter-subtitle">Subscribe to our newsletter and get 20% off your first purchase</p>
                </div>
                <form class="newsletter-inline-form" action="#" method="post" novalidate>
                    <input type="email" class="newsletter-input" placeholder="Your email" aria-label="Your email">
                    <button type="submit" class="newsletter-button">SUBSCRIBE</button>
                </form>
            </div>
        </div>
    </section>

</main>

<?php get_footer(); ?>