<?php

// Test script to verify cart API session support
echo "Testing Cart API Session Support...\n";

// Test cart summary endpoint
$url = 'http://localhost:8000/api/cart/summary';
echo "Testing: $url\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_COOKIEJAR, 'cookies.txt'); // Save cookies
curl_setopt($ch, CURLOPT_COOKIEFILE, 'cookies.txt'); // Send cookies

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

echo "HTTP Code: $httpCode\n";
echo "Response:\n$response\n";

curl_close($ch);

// Test adding item to cart
echo "\n\nTesting Add to Cart...\n";
$addUrl = 'http://localhost:8000/api/cart/add';
$postData = json_encode([
    'product_id' => 1,
    'quantity' => 2
]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $addUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_COOKIEFILE, 'cookies.txt'); // Send cookies

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

echo "HTTP Code: $httpCode\n";
echo "Response:\n$response\n";

curl_close($ch);

echo "\nTest completed!\n";
