<?php

namespace App\GraphQL\Mutations;

use App\Services\GeminiSEOService;
use Illuminate\Support\Facades\Log;

class GeneratePageSEO
{
    protected GeminiSEOService $seoService;

    public function __construct(GeminiSEOService $seoService)
    {
        $this->seoService = $seoService;
    }

    /**
     * Generate SEO content for a CMS page using AI
     */
    public function __invoke($_, array $args)
    {
        $pageKey = $args['pageKey'] ?? '';
        $content = $args['content'] ?? '';
        $title = $args['title'] ?? ucfirst($pageKey);

        try {
            $seoData = $this->seoService->generatePageSEO([
                'pageKey' => $pageKey,
                'title' => $title,
                'content' => $content,
            ]);

            return [
                'success' => true,
                'message' => 'SEO content generated successfully',
                'seoData' => $seoData,
            ];
        } catch (\Exception $e) {
            Log::error('Generate Page SEO Error', [
                'error' => $e->getMessage(),
                'pageKey' => $pageKey
            ]);

            return [
                'success' => false,
                'message' => 'Failed to generate SEO content: ' . $e->getMessage(),
                'seoData' => null,
            ];
        }
    }
}


