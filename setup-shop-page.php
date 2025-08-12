<?php
/**
 * Shop Page Setup Script
 * Run this once to create the shop page automatically
 */

// Include WordPress
require_once('wp-config.php');
require_once('wp-load.php');

// Check if shop page already exists
$shop_page = get_page_by_path('shop');

if (!$shop_page) {
    // Create the shop page
    $page_data = array(
        'post_title'    => 'Shop',
        'post_name'     => 'shop',
        'post_status'   => 'publish',
        'post_type'     => 'page',
        'post_content'  => '',
        'page_template' => 'page-shop.php'
    );
    
    // Insert the page
    $page_id = wp_insert_post($page_data);
    
    if ($page_id) {
        echo "✅ Shop page created successfully!<br>";
        echo "Page ID: " . $page_id . "<br>";
        echo "URL: <a href='" . get_permalink($page_id) . "'>" . get_permalink($page_id) . "</a><br>";
        echo "<br>You can now delete this setup file.";
    } else {
        echo "❌ Error creating shop page.";
    }
} else {
    echo "✅ Shop page already exists!<br>";
    echo "URL: <a href='" . get_permalink($shop_page->ID) . "'>" . get_permalink($shop_page->ID) . "</a><br>";
    echo "<br>You can now delete this setup file.";
}
?>
