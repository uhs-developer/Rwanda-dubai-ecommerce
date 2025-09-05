<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Cloudinary\Cloudinary;

class CloudinaryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(Cloudinary::class, function ($app) {
            return new Cloudinary([
                'cloud' => [
                    'cloud_name' => config('cloudinary.cloud_url') ? parse_url(config('cloudinary.cloud_url'), PHP_URL_HOST) : env('CLOUDINARY_CLOUD_NAME'),
                    'api_key' => config('cloudinary.cloud_url') ? parse_url(config('cloudinary.cloud_url'), PHP_URL_USER) : env('CLOUDINARY_API_KEY'),
                    'api_secret' => config('cloudinary.cloud_url') ? parse_url(config('cloudinary.cloud_url'), PHP_URL_PASS) : env('CLOUDINARY_API_SECRET'),
                ],
                'url' => [
                    'secure' => true
                ],
                'http' => [
                    'verify_ssl' => false, // Disable SSL verification for development
                    'timeout' => 60
                ]
            ]);
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Set cURL options globally to handle SSL issues
        if (function_exists('curl_setopt_array')) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
            curl_close($ch);
        }
    }
}



