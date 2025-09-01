<?php

// Simple test to verify server is working
echo "Testing basic server connectivity...\n";

// Test a simple endpoint first
$url = 'http://127.0.0.1:8000/';
echo "Testing: $url\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

echo "HTTP Code: $httpCode\n";
if ($error) {
    echo "cURL Error: $error\n";
}
echo "Response: " . substr($response, 0, 200) . "...\n";

curl_close($ch);

echo "\nBasic test completed!\n";
