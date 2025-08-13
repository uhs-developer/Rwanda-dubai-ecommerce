<?php
/**
 * Temporary script to create the Contact page
 * Run this once, then delete the file
 */

// Include WordPress core
require_once('../../../wp-load.php');

// Check if Contact page already exists
$contact_page = get_page_by_path('contact');

if (!$contact_page) {
    // Create the Contact page
    $page_data = array(
        'post_title'    => 'Contact Us',
        'post_name'     => 'contact',
        'post_status'   => 'publish',
        'post_type'     => 'page',
        'post_content'  => '',
        'page_template' => 'page-contact.php'
    );
    
    $page_id = wp_insert_post($page_data);
    
    if ($page_id) {
        echo "Contact page created successfully with ID: " . $page_id;
        echo "<br>Page URL: " . get_permalink($page_id);
    } else {
        echo "Error creating Contact page";
    }
} else {
    echo "Contact page already exists with ID: " . $contact_page->ID;
    echo "<br>Page URL: " . get_permalink($contact_page->ID);
}
?>

