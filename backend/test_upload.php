<?php

require_once 'vendor/autoload.php';

// Load environment variables
$envFile = '.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
        }
    }
}

echo "Testing Cloudinary signed upload...\n";

$cloudName = $_ENV['CLOUDINARY_CLOUD_NAME'] ?? 'djmqshe6o';
$apiKey = $_ENV['CLOUDINARY_API_KEY'] ?? '923348981214924';
$apiSecret = $_ENV['CLOUDINARY_API_SECRET'] ?? 'gzqBWifJjvsDNEFnNx_RVoYL744';

echo "Cloud Name: $cloudName\n";
echo "API Key: $apiKey\n";
echo "API Secret: " . (strlen($apiSecret) > 0 ? 'Set' : 'Not set') . "\n";

// Create a simple test file
$testContent = "This is a test file for Cloudinary upload";
$testFile = tempnam(sys_get_temp_dir(), 'test_upload_');
file_put_contents($testFile, $testContent);

echo "Test file created: $testFile\n";

// Prepare upload data
$timestamp = time();
$signature = sha1($timestamp . $apiSecret);

$uploadData = [
    'file' => new CURLFile($testFile, 'text/plain', 'test.txt'),
    'folder' => 'test_uploads',
    'public_id' => 'test_upload_' . $timestamp,
    'resource_type' => 'auto',
    'api_key' => $apiKey,
    'timestamp' => $timestamp,
    'signature' => $signature
];

echo "Upload data prepared:\n";
foreach ($uploadData as $key => $value) {
    if ($key === 'file') {
        echo "  $key: " . get_class($value) . "\n";
    } else {
        echo "  $key: $value\n";
    }
}

// Upload using cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.cloudinary.com/v1_1/{$cloudName}/auto/upload");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $uploadData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 60);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);

echo "Sending upload request...\n";
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Clean up test file
unlink($testFile);

echo "\nResults:\n";
echo "HTTP Code: $httpCode\n";
echo "cURL Error: " . ($curlError ?: 'None') . "\n";
echo "Response: " . substr($response, 0, 200) . (strlen($response) > 200 ? '...' : '') . "\n";

if ($httpCode === 200) {
    $result = json_decode($response, true);
    if ($result && isset($result['public_id'])) {
        echo "SUCCESS: File uploaded with public_id: " . $result['public_id'] . "\n";
        echo "URL: " . $result['secure_url'] . "\n";
    } else {
        echo "ERROR: Upload response doesn't contain expected data\n";
    }
} else {
    echo "ERROR: Upload failed with HTTP $httpCode\n";
}



