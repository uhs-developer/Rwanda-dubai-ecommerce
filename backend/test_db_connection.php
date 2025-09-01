<?php

// Test database connection directly
echo "Testing database connection...\n";

// Load Laravel environment
require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    // Test database connection
    $pdo = DB::connection()->getPdo();
    echo "Database connection: SUCCESS\n";
    echo "Database: " . DB::connection()->getDatabaseName() . "\n";
    
    // Test a simple query
    $result = DB::select('SELECT 1 as test');
    echo "Query test: SUCCESS\n";
    
} catch (Exception $e) {
    echo "Database connection: FAILED\n";
    echo "Error: " . $e->getMessage() . "\n";
}

echo "\nDatabase test completed!\n";
