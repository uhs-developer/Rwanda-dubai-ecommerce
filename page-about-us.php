<?php
/**
 * Template Name: About Us
 * 
 * @package DubaiDirect_Rwanda
 * @version 1.0.0
 */

get_header(); ?>

<main id="primary" class="site-main">
    
    <!-- Hero Section -->
    <section class="page-hero">
        <div class="hero-background">
        </div>
        
        <div class="hero-content">
            <div class="container">
                <h1 class="hero-title"><?php echo esc_html__('About DubaiDirect Rwanda', 'dubaidirect-rwanda'); ?></h1>
                <p class="hero-subtitle"><?php echo esc_html__('Connecting Rwanda to Quality Products from Dubai', 'dubaidirect-rwanda'); ?></p>
            </div>
        </div>
    </section>

    <!-- Our Story -->
    <section class="our-story">
        <div class="container">
            <div class="story-content">
                <div class="story-text">
                    <h2><?php echo esc_html__('Our Story', 'dubaidirect-rwanda'); ?></h2>
                    <p><?php echo esc_html__('Founded with a vision to bridge the gap between Dubai\'s premium electronics and automotive markets and Rwanda\'s growing demand for quality products, DubaiDirect Rwanda emerged from a deep understanding of the challenges faced by Rwandan consumers and businesses.', 'dubaidirect-rwanda'); ?></p>
                    
                    <p><?php echo esc_html__('After extensive market research and years of experience in international logistics, we identified the critical need for a trusted platform that could deliver quality-assured products with transparent pricing and flexible delivery options.', 'dubaidirect-rwanda'); ?></p>
                    
                    <p><?php echo esc_html__('Today, we serve thousands of satisfied customers across Rwanda, providing access to premium electronics and auto parts with the reliability and trust that the Rwandan market deserves.', 'dubaidirect-rwanda'); ?></p>
                </div>
                <div class="story-image">
                    <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80" alt="Our Story">
                </div>
            </div>
        </div>
    </section>

    <!-- Mission & Vision -->
    <section class="mission-vision">
        <div class="container">
            <div class="mission-vision-grid">
                <div class="mission-card">
                    <div class="card-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <h3><?php echo esc_html__('Our Mission', 'dubaidirect-rwanda'); ?></h3>
                    <p><?php echo esc_html__('To provide Rwandan consumers and businesses with access to premium quality electronics and automotive parts from Dubai, delivered with transparency, reliability, and exceptional customer service.', 'dubaidirect-rwanda'); ?></p>
                </div>
                
                <div class="vision-card">
                    <div class="card-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                    </div>
                    <h3><?php echo esc_html__('Our Vision', 'dubaidirect-rwanda'); ?></h3>
                    <p><?php echo esc_html__('To become East Africa\'s premier cross-border e-commerce logistics platform, revolutionizing how Rwandans access quality products while building sustainable, trust-based relationships.', 'dubaidirect-rwanda'); ?></p>
                </div>
            </div>
        </div>
    </section>

    <!-- Values -->
    <section class="our-values">
        <div class="container">
            <h2 class="section-title"><?php echo esc_html__('Our Values', 'dubaidirect-rwanda'); ?></h2>
            <div class="values-grid">
                <div class="value-item">
                    <div class="value-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <h3><?php echo esc_html__('Quality Excellence', 'dubaidirect-rwanda'); ?></h3>
                    <p><?php echo esc_html__('Every product undergoes rigorous testing in Dubai before shipment to ensure the highest quality standards.', 'dubaidirect-rwanda'); ?></p>
                </div>
                
                <div class="value-item">
                    <div class="value-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/>
                        </svg>
                    </div>
                    <h3><?php echo esc_html__('Transparency', 'dubaidirect-rwanda'); ?></h3>
                    <p><?php echo esc_html__('We believe in complete transparency in pricing, quality reports, and delivery tracking to build lasting trust.', 'dubaidirect-rwanda'); ?></p>
                </div>
                
                <div class="value-item">
                    <div class="value-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                    </div>
                    <h3><?php echo esc_html__('Community Focus', 'dubaidirect-rwanda'); ?></h3>
                    <p><?php echo esc_html__('We are committed to supporting the Rwandan community through local partnerships and sustainable business practices.', 'dubaidirect-rwanda'); ?></p>
                </div>
                
                <div class="value-item">
                    <div class="value-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                    </div>
                    <h3><?php echo esc_html__('Innovation', 'dubaidirect-rwanda'); ?></h3>
                    <p><?php echo esc_html__('We continuously innovate our logistics and technology to provide the best possible experience for our customers.', 'dubaidirect-rwanda'); ?></p>
                </div>
            </div>
        </div>
    </section>

    <!-- Quality Assurance -->
    <section class="quality-assurance">
        <div class="container">
            <div class="quality-content">
                <div class="quality-text">
                    <h2><?php echo esc_html__('Quality Assurance Process', 'dubaidirect-rwanda'); ?></h2>
                    <p><?php echo esc_html__('Our comprehensive quality control process ensures that every product meets the highest standards before reaching our customers in Rwanda.', 'dubaidirect-rwanda'); ?></p>
                    
                    <div class="quality-steps">
                        <div class="quality-step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4><?php echo esc_html__('Visual Inspection', 'dubaidirect-rwanda'); ?></h4>
                                <p><?php echo esc_html__('Comprehensive exterior and interior examination of all products', 'dubaidirect-rwanda'); ?></p>
                            </div>
                        </div>
                        
                        <div class="quality-step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4><?php echo esc_html__('Functional Testing', 'dubaidirect-rwanda'); ?></h4>
                                <p><?php echo esc_html__('Complete operational verification of all product functions', 'dubaidirect-rwanda'); ?></p>
                            </div>
                        </div>
                        
                        <div class="quality-step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4><?php echo esc_html__('Performance Benchmarking', 'dubaidirect-rwanda'); ?></h4>
                                <p><?php echo esc_html__('Comparison against manufacturer specifications', 'dubaidirect-rwanda'); ?></p>
                            </div>
                        </div>
                        
                        <div class="quality-step">
                            <div class="step-number">4</div>
                            <div class="step-content">
                                <h4><?php echo esc_html__('Documentation Review', 'dubaidirect-rwanda'); ?></h4>
                                <p><?php echo esc_html__('Verification of warranty, manuals, and certifications', 'dubaidirect-rwanda'); ?></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="quality-image">
                    <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Quality Assurance">
                </div>
            </div>
        </div>
    </section>

    <!-- Team -->
    <section class="our-team">
        <div class="container">
            <h2 class="section-title"><?php echo esc_html__('Our Leadership Team', 'dubaidirect-rwanda'); ?></h2>
            <div class="team-grid">
                <div class="team-member">
                    <div class="member-photo">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" alt="CEO">
                    </div>
                    <div class="member-info">
                        <h3><?php echo esc_html__('Jean Pierre Ndayisaba', 'dubaidirect-rwanda'); ?></h3>
                        <p class="member-title"><?php echo esc_html__('Chief Executive Officer', 'dubaidirect-rwanda'); ?></p>
                        <p class="member-bio"><?php echo esc_html__('With over 10 years of experience in international e-commerce and logistics, Jean Pierre leads our mission to connect Rwanda with quality products from Dubai.', 'dubaidirect-rwanda'); ?></p>
                    </div>
                </div>
                
                <div class="team-member">
                    <div class="member-photo">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" alt="CTO">
                    </div>
                    <div class="member-info">
                        <h3><?php echo esc_html__('Marie Uwimana', 'dubaidirect-rwanda'); ?></h3>
                        <p class="member-title"><?php echo esc_html__('Chief Technology Officer', 'dubaidirect-rwanda'); ?></p>
                        <p class="member-bio"><?php echo esc_html__('Marie oversees our technology platform, ensuring seamless user experience and robust e-commerce infrastructure.', 'dubaidirect-rwanda'); ?></p>
                    </div>
                </div>
                
                <div class="team-member">
                    <div class="member-photo">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" alt="Operations">
                    </div>
                    <div class="member-info">
                        <h3><?php echo esc_html__('David Mwambari', 'dubaidirect-rwanda'); ?></h3>
                        <p class="member-title"><?php echo esc_html__('Head of Operations', 'dubaidirect-rwanda'); ?></p>
                        <p class="member-bio"><?php echo esc_html__('David manages our logistics and quality control processes, ensuring every order meets our high standards.', 'dubaidirect-rwanda'); ?></p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact CTA -->
    <section class="contact-cta">
        <div class="container">
            <div class="cta-content">
                <h2><?php echo esc_html__('Ready to Experience Quality?', 'dubaidirect-rwanda'); ?></h2>
                <p><?php echo esc_html__('Join thousands of satisfied customers who trust DubaiDirect Rwanda for their electronics and auto parts needs.', 'dubaidirect-rwanda'); ?></p>
                <div class="cta-actions">
                    <a href="<?php echo esc_url(get_permalink(get_option('woocommerce_shop_page_id'))); ?>" class="btn btn-primary">
                        <?php echo esc_html__('Shop Now', 'dubaidirect-rwanda'); ?>
                    </a>
                    <a href="<?php echo esc_url(get_permalink(get_page_by_path('contact'))); ?>" class="btn btn-secondary">
                        <?php echo esc_html__('Contact Us', 'dubaidirect-rwanda'); ?>
                    </a>
                </div>
            </div>
        </div>
    </section>

</main>

<?php get_footer(); ?> 