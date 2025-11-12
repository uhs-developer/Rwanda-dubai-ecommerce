<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\Cache;

class SitemapService
{
    /**
     * Generate XML sitemap for all products and categories
     * Includes multilingual support with hreflang tags
     */
    public function generateSitemap(): string
    {
        return Cache::remember('sitemap', 3600, function () {
            $baseUrl = config('app.url');
            $languages = ['en', 'fr', 'rw', 'ar'];
            
            $xml = '<?xml version="1.0" encoding="UTF-8"?>';
            $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ';
            $xml .= 'xmlns:xhtml="http://www.w3.org/1999/xhtml">';

            // Homepage
            $xml .= $this->generateUrlEntry($baseUrl, now(), 'daily', '1.0', $languages);

            // Products
            $products = Product::where('is_active', true)->get();
            foreach ($products as $product) {
                $url = "{$baseUrl}/products/{$product->slug}";
                $xml .= $this->generateUrlEntry(
                    $url,
                    $product->updated_at,
                    'weekly',
                    '0.8',
                    $languages,
                    $product->slug
                );
            }

            // Categories
            $categories = Category::where('is_active', true)->get();
            foreach ($categories as $category) {
                $url = "{$baseUrl}/category/{$category->slug}";
                $xml .= $this->generateUrlEntry(
                    $url,
                    $category->updated_at,
                    'daily',
                    '0.7',
                    $languages,
                    $category->slug
                );
            }

            $xml .= '</urlset>';

            return $xml;
        });
    }

    /**
     * Generate single URL entry with multilingual support
     */
    private function generateUrlEntry(
        string $url,
        $lastmod,
        string $changefreq,
        string $priority,
        array $languages,
        ?string $slug = null
    ): string {
        $xml = '<url>';
        $xml .= "<loc>{$url}</loc>";
        $xml .= '<lastmod>' . $lastmod->toW3cString() . '</lastmod>';
        $xml .= "<changefreq>{$changefreq}</changefreq>";
        $xml .= "<priority>{$priority}</priority>";

        // Add hreflang tags for multilingual SEO
        if ($slug) {
            foreach ($languages as $lang) {
                $langUrl = $lang === 'en' ? $url : "{$url}?lang={$lang}";
                $xml .= '<xhtml:link rel="alternate" hreflang="' . $lang . '" href="' . $langUrl . '"/>';
            }
        }

        $xml .= '</url>';

        return $xml;
    }

    /**
     * Generate robots.txt content
     */
    public function generateRobotsTxt(): string
    {
        $baseUrl = config('app.url');
        
        return "User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /graphql

# Sitemaps
Sitemap: {$baseUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1";
    }
}
