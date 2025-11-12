<?php

namespace App\Http\Controllers;

use App\Services\SitemapService;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    protected SitemapService $sitemapService;

    public function __construct(SitemapService $sitemapService)
    {
        $this->sitemapService = $sitemapService;
    }

    /**
     * Generate and return XML sitemap
     */
    public function sitemap(): Response
    {
        $xml = $this->sitemapService->generateSitemap();

        return response($xml, 200)
            ->header('Content-Type', 'application/xml');
    }

    /**
     * Generate and return robots.txt
     */
    public function robots(): Response
    {
        $content = $this->sitemapService->generateRobotsTxt();

        return response($content, 200)
            ->header('Content-Type', 'text/plain');
    }
}
