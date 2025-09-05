<?php

echo "Testing cURL SSL connection to Cloudinary...\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.cloudinary.com/v1_1/djmqshe6o/test');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);

$response = curl_exec($ch);
$error = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: " . $httpCode . "\n";
echo "Error: " . ($error ?: 'None') . "\n";
echo "Response length: " . strlen($response) . "\n";
echo "SSL Working: " . (empty($error) ? 'Yes' : 'No') . "\n";

if ($error) {
    echo "cURL Error Details: " . $error . "\n";
} else {
    echo "Connection successful!\n";
}



