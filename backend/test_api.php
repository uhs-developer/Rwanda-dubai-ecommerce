<?php

// Simple API test script
$baseUrl = 'http://127.0.0.1:8000/api';

echo "Testing API endpoints...\n\n";

// Test 1: Get all products
echo "1. Testing GET /products\n";
$response = file_get_contents($baseUrl . '/products?per_page=5');
$data = json_decode($response, true);
if ($data['success']) {
    echo "✓ Success: Found " . count($data['data']) . " products\n";
    echo "  Total: " . ($data['pagination']['total'] ?? 'N/A') . "\n";
} else {
    echo "✗ Failed: " . $data['message'] . "\n";
}

echo "\n";

// Test 2: Test brand filtering
echo "2. Testing brand filtering\n";
$response = file_get_contents($baseUrl . '/products?brands=1&per_page=5');
$data = json_decode($response, true);
if ($data['success']) {
    echo "✓ Success: Found " . count($data['data']) . " products for brand ID 1\n";
} else {
    echo "✗ Failed: " . $data['message'] . "\n";
}

echo "\n";

// Test 3: Test category filtering
echo "3. Testing category filtering\n";
$response = file_get_contents($baseUrl . '/products?category_id=1&per_page=5');
$data = json_decode($response, true);
if ($data['success']) {
    echo "✓ Success: Found " . count($data['data']) . " products for category ID 1\n";
} else {
    echo "✗ Failed: " . $data['message'] . "\n";
}

echo "\n";

// Test 4: Test search
echo "4. Testing search\n";
$response = file_get_contents($baseUrl . '/products/search?q=iPhone&per_page=5');
$data = json_decode($response, true);
if ($data['success']) {
    echo "✓ Success: Found " . count($data['data']) . " products matching 'iPhone'\n";
} else {
    echo "✗ Failed: " . $data['message'] . "\n";
}

echo "\n";

// Test 5: Test price filtering
echo "5. Testing price filtering\n";
$response = file_get_contents($baseUrl . '/products?min_price=500&max_price=1000&per_page=5');
$data = json_decode($response, true);
if ($data['success']) {
    echo "✓ Success: Found " . count($data['data']) . " products in price range $500-$1000\n";
} else {
    echo "✗ Failed: " . $data['message'] . "\n";
}

echo "\nAPI testing completed!\n";
