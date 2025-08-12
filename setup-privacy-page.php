<?php
/**
 * Temporary script to create the Privacy Policy page
 * Run this once, then delete the file
 */

// Include WordPress core
require_once('../../../wp-load.php');

// Check if Privacy page already exists
$privacy_page = get_page_by_path('privacy');

if (!$privacy_page) {
    // Create the Privacy Policy page
    $page_data = array(
        'post_title'    => 'Privacy Policy',
        'post_name'     => 'privacy',
        'post_status'   => 'publish',
        'post_type'     => 'page',
        'post_content'  => '',
        'page_template' => 'page-privacy.php'
    );
    
    $page_id = wp_insert_post($page_data);
    
    if ($page_id) {
        echo "Privacy Policy page created successfully with ID: " . $page_id;
        echo "<br>Page URL: " . get_permalink($page_id);
    } else {
        echo "Error creating Privacy Policy page";
    }
} else {
    echo "Privacy Policy page already exists with ID: " . $privacy_page->ID;
    echo "<br>Page URL: " . get_permalink($privacy_page->ID);
}
?>
