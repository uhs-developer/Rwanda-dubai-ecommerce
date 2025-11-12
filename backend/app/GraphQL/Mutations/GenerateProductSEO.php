<?php

namespace App\GraphQL\Mutations;

use App\Models\Product;
use App\Services\GeminiSEOService;
use Illuminate\Support\Facades\Log;

class GenerateProductSEO
{
    protected GeminiSEOService $seoService;

    public function __construct(GeminiSEOService $seoService)
    {
        $this->seoService = $seoService;
    }

    /**
     * Generate SEO content for a product using AI
     */
    public function __invoke($_, array $args)
    {
        $productId = $args['productId'] ?? null;
        $productData = $args['productData'] ?? [];

        try {
            // If product ID provided, fetch existing product
            if ($productId) {
                $product = Product::findOrFail($productId);
                $productData = [
                    'name' => $product->name,
                    'description' => $product->description ?? $product->short_description,
                    'category' => $product->category->name ?? '',
                    'brand' => $product->brand->name ?? '',
                    'price' => $product->price,
                    'slug' => $product->slug,
                ];
            }

            // Generate SEO content
            $seoData = $this->seoService->generateProductSEO($productData);

            // If updating existing product, save the SEO data
            if ($productId) {
                $product->update($seoData);
                $product->refresh();

                return [
                    'success' => true,
                    'message' => 'SEO content generated successfully',
                    'product' => $product,
                    'seoData' => $seoData,
                ];
            }

            // Return SEO data for new product
            return [
                'success' => true,
                'message' => 'SEO content generated successfully',
                'product' => null,
                'seoData' => $seoData,
            ];

        } catch (\Exception $e) {
            Log::error('Generate Product SEO Error', [
                'error' => $e->getMessage(),
                'productId' => $productId
            ]);

            return [
                'success' => false,
                'message' => 'Failed to generate SEO content: ' . $e->getMessage(),
                'product' => null,
                'seoData' => null,
            ];
        }
    }
}
