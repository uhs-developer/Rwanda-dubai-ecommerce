<?php

/**
 * Test script for Cart and Wishlist functionality
 * Run this script to test the cart and wishlist API endpoints
 */

// Base URL for the API
$baseUrl = 'http://localhost:8000/api';

// Test data
$testProductId = 1; // Assuming product with ID 1 exists
$testQuantity = 2;

echo "=== Cart and Wishlist API Testing ===\n\n";

// Function to make HTTP requests
function makeRequest($url, $method = 'GET', $data = null, $headers = []) {
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array_merge([
        'Content-Type: application/json',
        'Accept: application/json'
    ], $headers));
    
    if ($data && in_array($method, ['POST', 'PUT', 'PATCH'])) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'code' => $httpCode,
        'body' => json_decode($response, true)
    ];
}

// Test 1: Get cart items (should be empty initially)
echo "1. Testing GET /cart - Get cart items\n";
$response = makeRequest("$baseUrl/cart");
echo "Status: " . $response['code'] . "\n";
echo "Response: " . json_encode($response['body'], JSON_PRETTY_PRINT) . "\n\n";

// Test 2: Add item to cart
echo "2. Testing POST /cart/add - Add item to cart\n";
$cartData = [
    'product_id' => $testProductId,
    'quantity' => $testQuantity,
    'product_options' => ['size' => 'M', 'color' => 'Blue']
];
$response = makeRequest("$baseUrl/cart/add", 'POST', $cartData);
echo "Status: " . $response['code'] . "\n";
echo "Response: " . json_encode($response['body'], JSON_PRETTY_PRINT) . "\n\n";

// Test 3: Get cart items again (should have the added item)
echo "3. Testing GET /cart - Get cart items after adding\n";
$response = makeRequest("$baseUrl/cart");
echo "Status: " . $response['code'] . "\n";
echo "Response: " . json_encode($response['body'], JSON_PRETTY_PRINT) . "\n\n";

// Test 4: Get cart summary
echo "4. Testing GET /cart/summary - Get cart summary\n";
$response = makeRequest("$baseUrl/cart/summary");
echo "Status: " . $response['code'] . "\n";
echo "Response: " . json_encode($response['body'], JSON_PRETTY_PRINT) . "\n\n";

// Test 5: Add item to wishlist
echo "5. Testing POST /wishlist/add - Add item to wishlist\n";
$wishlistData = [
    'product_id' => $testProductId
];
$response = makeRequest("$baseUrl/wishlist/add", 'POST', $wishlistData);
echo "Status: " . $response['code'] . "\n";
echo "Response: " . json_encode($response['body'], JSON_PRETTY_PRINT) . "\n\n";

// Test 6: Get wishlist items
echo "6. Testing GET /wishlist - Get wishlist items\n";
$response = makeRequest("$baseUrl/wishlist");
echo "Status: " . $response['code'] . "\n";
echo "Response: " . json_encode($response['body'], JSON_PRETTY_PRINT) . "\n\n";

// Test 7: Check if product is in wishlist
echo "7. Testing GET /wishlist/check/{productId} - Check wishlist status\n";
$response = makeRequest("$baseUrl/wishlist/check/$testProductId");
echo "Status: " . $response['code'] . "\n";
echo "Response: " . json_encode($response['body'], JSON_PRETTY_PRINT) . "\n\n";

// Test 8: Get wishlist count
echo "8. Testing GET /wishlist/count - Get wishlist count\n";
$response = makeRequest("$baseUrl/wishlist/count");
echo "Status: " . $response['code'] . "\n";
echo "Response: " . json_encode($response['body'], JSON_PRETTY_PRINT) . "\n\n";

// Test 9: Update cart item quantity
echo "9. Testing PUT /cart/update/{id} - Update cart item quantity\n";
// First get the cart item ID from the cart
$cartResponse = makeRequest("$baseUrl/cart");
if ($cartResponse['code'] === 200 && !empty($cartResponse['body']['data']['items'])) {
    $cartItemId = $cartResponse['body']['data']['items'][0]['id'];
    $updateData = ['quantity' => 3];
    $response = makeRequest("$baseUrl/cart/update/$cartItemId", 'PUT', $updateData);
    echo "Status: " . $response['code'] . "\n";
    echo "Response: " . json_encode($response['body'], JSON_PRETTY_PRINT) . "\n\n";
} else {
    echo "No cart items found to update\n\n";
}

// Test 10: Remove item from wishlist by product ID
echo "10. Testing DELETE /wishlist/remove-product/{productId} - Remove from wishlist\n";
$response = makeRequest("$baseUrl/wishlist/remove-product/$testProductId", 'DELETE');
echo "Status: " . $response['code'] . "\n";
echo "Response: " . json_encode($response['body'], JSON_PRETTY_PRINT) . "\n\n";

// Test 11: Clear cart
echo "11. Testing DELETE /cart/clear - Clear cart\n";
$response = makeRequest("$baseUrl/cart/clear", 'DELETE');
echo "Status: " . $response['code'] . "\n";
echo "Response: " . json_encode($response['body'], JSON_PRETTY_PRINT) . "\n\n";

echo "=== Testing Complete ===\n";
echo "Note: Make sure your Laravel server is running on http://localhost:8000\n";
echo "Also ensure you have at least one product in your database with ID 1\n";

