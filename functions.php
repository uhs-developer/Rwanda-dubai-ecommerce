<?php
/**
 * DubaiDirect Rwanda functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package DubaiDirect_Rwanda
 */

if (!defined('_S_VERSION')) {
    // Replace the version number of the theme on each release.
    define('_S_VERSION', '1.0.0');
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function dubaidirect_setup() {
    /*
     * Make theme available for translation.
     * Translations can be filed in the /languages/ directory.
     */
    load_theme_textdomain('dubaidirect-rwanda', get_template_directory() . '/languages');

    // Add default posts and comments RSS feed links to head.
    add_theme_support('automatic-feed-links');

    /*
     * Let WordPress manage the document title.
     * By adding theme support, we declare that this theme does not use a
     * hard-coded <title> tag in the document head, and expect WordPress to
     * provide it for us.
     */
    add_theme_support('title-tag');

    /*
     * Enable support for Post Thumbnails on posts and pages.
     *
     * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
     */
    add_theme_support('post-thumbnails');

    // This theme uses wp_nav_menu() in one location.
    register_nav_menus(
        array(
            'primary' => esc_html__('Primary Menu', 'dubaidirect-rwanda'),
        )
    );

    /*
     * Switch default core markup for search form, comment form, and comments
     * to output valid HTML5.
     */
    add_theme_support(
        'html5',
        array(
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
            'style',
            'script',
        )
    );

    // Set up the WordPress core custom background feature.
    add_theme_support(
        'custom-background',
        apply_filters(
            'dubaidirect_custom_background_args',
            array(
                'default-color' => 'ffffff',
                'default-image' => '',
            )
        )
    );

    // Add theme support for selective refresh for widgets.
    add_theme_support('customize-selective-refresh-widgets');

    /**
     * Add support for core custom logo.
     *
     * @link https://codex.wordpress.org/Theme_Logo
     */
    add_theme_support(
        'custom-logo',
        array(
            'height'      => 250,
            'width'       => 250,
            'flex-width'  => true,
            'flex-height' => true,
        )
    );

    // Add WooCommerce support
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');
}
add_action('after_setup_theme', 'dubaidirect_setup');

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function dubaidirect_content_width() {
    $GLOBALS['content_width'] = apply_filters('dubaidirect_content_width', 640);
}
add_action('after_setup_theme', 'dubaidirect_content_width', 0);

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function dubaidirect_widgets_init() {
    register_sidebar(
        array(
            'name'          => esc_html__('Sidebar', 'dubaidirect-rwanda'),
            'id'            => 'sidebar-1',
            'description'   => esc_html__('Add widgets here.', 'dubaidirect-rwanda'),
            'before_widget' => '<section id="%1$s" class="widget %2$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h2 class="widget-title">',
            'after_title'   => '</h2>',
        )
    );
}
add_action('widgets_init', 'dubaidirect_widgets_init');

/**
 * Enqueue scripts and styles.
 */
function dubaidirect_scripts() {
    wp_enqueue_style('dubaidirect-style', get_stylesheet_uri(), array(), _S_VERSION);
    wp_style_add_data('dubaidirect-style', 'rtl', 'replace');

    // Font Awesome for social icons
    wp_enqueue_style(
        'font-awesome',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
        array(),
        '6.5.0'
    );

    wp_enqueue_script('dubaidirect-navigation', get_template_directory_uri() . '/js/navigation.js', array(), _S_VERSION, true);

    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }
}
add_action('wp_enqueue_scripts', 'dubaidirect_scripts');

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
if (defined('JETPACK__VERSION')) {
    require get_template_directory() . '/inc/jetpack.php';
}

/**
 * Fallback menu function
 */
function dubaidirect_default_menu() {
    echo '<ul class="nav-menu">';
    echo '<li><a href="' . esc_url(home_url('/')) . '">' . esc_html__('Home', 'dubaidirect-rwanda') . '</a></li>';
    echo '<li><a href="' . esc_url(home_url('/product-page/')) . '">' . esc_html__('Shop', 'dubaidirect-rwanda') . '</a></li>';
    echo '<li><a href="' . esc_url(home_url('/about-us/')) . '">' . esc_html__('About Us', 'dubaidirect-rwanda') . '</a></li>';
    echo '<li><a href="' . esc_url(home_url('/privacy-policy/')) . '">' . esc_html__('Privacy', 'dubaidirect-rwanda') . '</a></li>';
    echo '<li><a href="' . esc_url(home_url('/blog/')) . '">' . esc_html__('Blog', 'dubaidirect-rwanda') . '</a></li>';
    echo '<li><a href="' . esc_url(home_url('/contact/')) . '">' . esc_html__('Contact', 'dubaidirect-rwanda') . '</a></li>';
    echo '</ul>';
}

/**
 * Add WooCommerce support
 */
function dubaidirect_woocommerce_setup() {
    add_theme_support('woocommerce', array(
        'thumbnail_image_width' => 300,
        'single_image_width'    => 600,
        'product_grid'          => array(
            'default_rows'    => 3,
            'min_rows'        => 1,
            'default_columns' => 2, // Exact 2-column grid
            'min_columns'     => 1,
            'max_columns'     => 2,
        ),
    ));
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');
}
add_action('after_setup_theme', 'dubaidirect_woocommerce_setup');

/**
 * WooCommerce specific scripts & stylesheets.
 */
function dubaidirect_woocommerce_scripts() {
    // Check if WooCommerce is active
    if (!class_exists('WooCommerce')) {
        return;
    }

    wp_enqueue_style('dubaidirect-woocommerce-style', get_template_directory_uri() . '/woocommerce.css');

    $font_path   = WC()->plugin_url() . '/assets/fonts/';
    $inline_font = '@font-face {
            font-family: "star";
            src: url("' . $font_path . 'star.eot");
            src: url("' . $font_path . 'star.eot?#iefix") format("embedded-opentype"),
                url("' . $font_path . 'star.woff") format("woff"),
                url("' . $font_path . 'star.ttf") format("truetype"),
                url("' . $font_path . 'star.svg#star") format("svg");
            font-weight: normal;
            font-style: normal;
        }';

    wp_add_inline_style('dubaidirect-woocommerce-style', $inline_font);
}
add_action('wp_enqueue_scripts', 'dubaidirect_woocommerce_scripts');

/**
 * Disable the default WooCommerce stylesheet.
 */
function dubaidirect_woocommerce_enqueue_styles($styles) {
    // Check if WooCommerce is active
    if (!class_exists('WooCommerce')) {
        return $styles;
    }
    return array();
}
add_filter('woocommerce_enqueue_styles', 'dubaidirect_woocommerce_enqueue_styles');

/**
 * Add 'woocommerce-active' class to the body tag.
 */
function dubaidirect_woocommerce_active_body_class($classes) {
    // Check if WooCommerce is active
    if (class_exists('WooCommerce')) {
        $classes[] = 'woocommerce-active';
    }
    return $classes;
}
add_filter('body_class', 'dubaidirect_woocommerce_active_body_class');

/**
 * Add page-specific body classes for independent styling
 */
function dubaidirect_page_specific_body_classes($classes) {
    // Add unique class for About Us page
    if (is_page('about-us') || is_page_template('page-about-us.php')) {
        $classes[] = 'page-about-us';
        $classes[] = 'about-us-template';
    }
    
    // Add unique class for Checkout page
    if (is_page('checkout') || is_page_template('page-checkout.php')) {
        $classes[] = 'page-checkout';
        $classes[] = 'checkout-template';
    }
    
    // Add unique class for Shop page
    if (is_page('shop') || is_page_template('page-shop.php')) {
        $classes[] = 'page-shop';
        $classes[] = 'shop-template';
    }
    
    // Add unique class for homepage
    if (is_front_page()) {
        $classes[] = 'page-homepage';
        $classes[] = 'homepage-template';
    }
    
    return $classes;
}
add_filter('body_class', 'dubaidirect_page_specific_body_classes');

/**
 * Enqueue page-specific styles
 */
function dubaidirect_page_specific_styles() {
    // Enqueue About Us page styles only when needed
    if (is_page('about-us') || is_page_template('page-about-us.php')) {
        wp_enqueue_style(
            'dubaidirect-about-us',
            get_template_directory_uri() . '/assets/css/about-us.css',
            array('dubaidirect-style'),
            _S_VERSION
        );
    }
    
    // Enqueue Checkout page styles only when needed
    if (is_page('checkout') || is_page_template('page-checkout.php')) {
        wp_enqueue_style(
            'dubaidirect-checkout',
            get_template_directory_uri() . '/assets/css/checkout.css',
            array('dubaidirect-style'),
            _S_VERSION
        );
    }
    
    // Enqueue Shop page styles only when needed
    if (is_page('shop') || is_page_template('page-shop.php')) {
        wp_enqueue_style(
            'dubaidirect-shop',
            get_template_directory_uri() . '/assets/css/shop.css',
            array('dubaidirect-style'),
            _S_VERSION
        );
    }
}
add_action('wp_enqueue_scripts', 'dubaidirect_page_specific_styles');

/**
 * Products per page.
 */
function dubaidirect_woocommerce_products_per_page() {
    // Check if WooCommerce is active
    if (!class_exists('WooCommerce')) {
        return 10;
    }
    return 12;
}
add_filter('loop_shop_per_page', 'dubaidirect_woocommerce_products_per_page');

/**
 * Product gallery thumnbail columns.
 */
function dubaidirect_woocommerce_thumbnail_columns() {
    // Check if WooCommerce is active
    if (!class_exists('WooCommerce')) {
        return 3;
    }
    return 4;
}
add_filter('woocommerce_product_thumbnails_columns', 'dubaidirect_woocommerce_thumbnail_columns');

/**
 * Single product gallery thumnbail columns.
 */
function dubaidirect_woocommerce_related_products_args($args) {
    // Check if WooCommerce is active
    if (!class_exists('WooCommerce')) {
        return $args;
    }
    
    $defaults = array(
        'posts_per_page' => 4,
        'columns'        => 4,
    );

    $args = wp_parse_args($defaults, $args);

    return $args;
}
add_filter('woocommerce_output_related_products_args', 'dubaidirect_woocommerce_related_products_args');

/**
 * Default loop columns on product archives.
 */
function dubaidirect_woocommerce_loop_columns() {
    // Check if WooCommerce is active
    if (!class_exists('WooCommerce')) {
        return 2;
    }
    return 2;
}
add_filter('loop_shop_columns', 'dubaidirect_woocommerce_loop_columns');



/**
 * Show a "New" eyebrow badge on products published within the last 30 days
 */
function dubaidirect_show_new_badge() {
    if (!class_exists('WooCommerce')) {
        return;
    }

    global $product;
    if (!$product) {
        return;
    }

    $product_id = $product->get_id();
    $published_timestamp = get_post_time('U', true, $product_id);
    $days_threshold = 30 * DAY_IN_SECONDS;

    if ($published_timestamp && (time() - $published_timestamp) <= $days_threshold) {
        echo '<span class="new-badge eyebrow eyebrow--new">' . esc_html__('New', 'dubaidirect-rwanda') . '</span>';
    }
}
add_action('woocommerce_before_shop_loop_item_title', 'dubaidirect_show_new_badge', 9);

/**
 * Add 'featured' class to featured products to allow 2-column spanning tiles
 */
function dubaidirect_featured_product_class($classes, $product) {
    if (is_a($product, 'WC_Product') && $product->is_featured()) {
        $classes[] = 'featured';
    }
    return $classes;
}
add_filter('woocommerce_post_class', 'dubaidirect_featured_product_class', 10, 2);

