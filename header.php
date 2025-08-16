<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div id="page" class="site">
    <a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e('Skip to content', 'dubaidirect-rwanda'); ?></a>

    <header id="masthead" class="site-header">
        <div class="container">
            <div class="header-content">
                
                <!-- Logo -->
                <div class="header-logo">
                    <a href="<?php echo esc_url(home_url('/')); ?>" rel="home">
                        <?php if (has_custom_logo()) : ?>
                            <?php the_custom_logo(); ?>
                        <?php else : ?>
                            <span class="site-title"><?php bloginfo('name'); ?></span>
                        <?php endif; ?>
                    </a>
                </div>
                
                <!-- Navigation Menu -->
                <nav id="site-navigation" class="main-navigation">
                    <button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false">
                        <span class="menu-toggle-icon"></span>
                        <span class="screen-reader-text"><?php esc_html_e('Menu', 'dubaidirect-rwanda'); ?></span>
                    </button>
                    
                    <div class="nav-menu-container">
                        <?php
                        wp_nav_menu(array(
                            'theme_location' => 'primary',
                            'menu_id'        => 'primary-menu',
                            'menu_class'     => 'nav-menu',
                            'container'      => false,
                            'fallback_cb'    => 'dubaidirect_default_menu',
                        ));
                        ?>
                    </div>
                </nav>
                
                <!-- Header Actions -->
                <div class="header-actions">
                    <!-- Search -->
                    <button class="header-action-btn search-toggle" aria-label="<?php esc_attr_e('Search', 'dubaidirect-rwanda'); ?>">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="M21 21l-4.35-4.35"></path>
                        </svg>
                    </button>
                    
                    <!-- Account -->
                    <a href="<?php echo esc_url(home_url('/')); ?>" class="header-action-btn" aria-label="<?php esc_attr_e('Account', 'dubaidirect-rwanda'); ?>">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </a>
                    
                    <!-- Cart -->
                    <a href="<?php echo esc_url(get_permalink(get_page_by_path('checkout'))); ?>" class="header-action-btn cart-link" aria-label="<?php esc_attr_e('Cart', 'dubaidirect-rwanda'); ?>">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        <span class="cart-count">0</span>
                    </a>
                </div>
                
            </div>
        </div>
        
        <!-- Search Overlay -->
        <div class="search-overlay" id="search-overlay">
            <div class="search-container">
                <div class="search-content">
                    <form role="search" method="get" class="search-form" action="<?php echo esc_url(home_url('/')); ?>">
                        <div class="search-input-wrapper">
                            <input type="search" class="search-field" placeholder="<?php esc_attr_e('Search products...', 'dubaidirect-rwanda'); ?>" value="<?php echo get_search_query(); ?>" name="s" />
                            <button type="submit" class="search-submit">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="M21 21l-4.35-4.35"></path>
                                </svg>
                            </button>
                        </div>
                    </form>
                    <button class="search-close" aria-label="<?php esc_attr_e('Close search', 'dubaidirect-rwanda'); ?>">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- Mobile Menu Overlay -->
    <div class="mobile-menu-overlay" id="mobile-menu-overlay">
        <div class="mobile-menu-container">
            <div class="mobile-menu-header">
                <h3><?php esc_html_e('Menu', 'dubaidirect-rwanda'); ?></h3>
                <button class="mobile-menu-close" aria-label="<?php esc_attr_e('Close menu', 'dubaidirect-rwanda'); ?>">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <nav class="mobile-navigation">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'menu_id'        => 'mobile-menu',
                    'menu_class'     => 'mobile-nav-menu',
                    'container'      => false,
                    'fallback_cb'    => 'dubaidirect_default_menu',
                ));
                ?>
            </nav>
        </div>
    </div>
