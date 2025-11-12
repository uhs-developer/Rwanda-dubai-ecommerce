<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiSEOService
{
    private string $apiKey;
    private string $baseUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';

    public function __construct()
    {
        $this->apiKey = env('GEMINI_API_KEY', env('VITE_GEMINI_API_KEY'));
    }

    /**
     * Generate comprehensive SEO content for a product
     * Supports multiple languages: English, French, Kinyarwanda
     */
    public function generateProductSEO(array $productData): array
    {
        $productName = $productData['name'] ?? '';
        $description = $productData['description'] ?? '';
        $category = $productData['category'] ?? '';
        $price = $productData['price'] ?? '';
        $brand = $productData['brand'] ?? '';

        $prompt = $this->buildSEOPrompt($productName, $description, $category, $price, $brand);

        try {
            $response = Http::timeout(30)
                ->post("{$this->baseUrl}?key={$this->apiKey}", [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.7,
                        'topK' => 40,
                        'topP' => 0.95,
                        'maxOutputTokens' => 8192,
                    ]
                ]);

            if ($response->successful()) {
                $responseData = $response->json();
                $content = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? '';

                return $this->parseSEOResponse($content, $productData);
            }

            Log::error('Gemini API Error', ['response' => $response->body()]);
            return $this->getDefaultSEO($productData);

        } catch (\Exception $e) {
            Log::error('Gemini SEO Generation Error', ['error' => $e->getMessage()]);
            return $this->getDefaultSEO($productData);
        }
    }

    private function buildSEOPrompt(string $name, string $description, string $category, string $price, string $brand): string
    {
        return <<<PROMPT
You are an expert SEO specialist for an e-commerce platform. Generate comprehensive SEO content for the following product.

Product Details:
- Name: {$name}
- Description: {$description}
- Category: {$category}
- Brand: {$brand}
- Price: {$price}

Generate the following in JSON format:
1. **meta_title**: SEO-optimized title (50-60 characters, include brand, product name, and key benefit)
2. **meta_description**: Compelling description (150-160 characters, include call-to-action)
3. **meta_keywords**: Array of 10-15 relevant keywords for search engines
4. **search_keywords**: Array of 20+ search terms people might use in different languages (English, French, Kinyarwanda, Arabic)
5. **multilingual_seo**: Object with translations for title/description in:
   - en (English)
   - fr (French - "Acheter", "Prix", etc.)
   - rw (Kinyarwanda - "Gura", "Ikiguzi", etc.)
   - ar (Arabic)
6. **structured_data**: Schema.org Product JSON-LD markup
7. **suggestions**: Array of 5 suggestions to improve product listing
8. **seo_score**: Number from 0-100 rating the SEO quality

Important for multilingual keywords:
- Include common searches like "buy iPhone", "acheter iPhone", "gura iPhone", "شراء iPhone"
- Include price-related searches: "iPhone price Rwanda", "prix iPhone Rwanda", "ikiguzi cya iPhone"
- Include location searches: "iPhone Kigali", "iPhone Rwanda"
- Include condition searches: "new iPhone", "iPhone neuf", "iPhone nshya"

Return ONLY valid JSON, no markdown formatting.
PROMPT;
    }

    private function parseSEOResponse(string $content, array $productData): array
    {
        // Remove markdown code blocks if present
        $content = preg_replace('/```json\s*|\s*```/', '', $content);
        $content = trim($content);

        try {
            $seoData = json_decode($content, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('JSON decode error: ' . json_last_error_msg());
            }

            if (!$seoData) {
                throw new \Exception('Empty JSON response');
            }

            return [
                'metaTitle' => $seoData['meta_title'] ?? $this->generateFallbackTitle($productData),
                'metaDescription' => $seoData['meta_description'] ?? $this->generateFallbackDescription($productData),
                'metaKeywords' => $seoData['meta_keywords'] ?? [],
                'searchKeywords' => implode(', ', $seoData['search_keywords'] ?? []),
                'seoTranslations' => $seoData['multilingual_seo'] ?? $this->getDefaultTranslations($productData),
                'structuredData' => $seoData['structured_data'] ?? $this->generateStructuredData($productData),
                'aiSuggestions' => $seoData['suggestions'] ?? [],
                'seoScore' => $seoData['seo_score'] ?? 50,
                'lastSeoOptimization' => now(),
            ];

        } catch (\Exception $e) {
            Log::error('SEO Response Parsing Error', ['error' => $e->getMessage(), 'content' => $content]);
            return $this->getDefaultSEO($productData);
        }
    }

    private function getDefaultSEO(array $productData): array
    {
        return [
            'metaTitle' => $this->generateFallbackTitle($productData),
            'metaDescription' => $this->generateFallbackDescription($productData),
            'metaKeywords' => $this->generateFallbackKeywords($productData),
            'searchKeywords' => $this->generateFallbackSearchKeywords($productData),
            'seoTranslations' => $this->getDefaultTranslations($productData),
            'structuredData' => $this->generateStructuredData($productData),
            'aiSuggestions' => [],
            'seoScore' => 40,
            'lastSeoOptimization' => now(),
        ];
    }

    private function generateFallbackTitle(array $data): string
    {
        $brand = $data['brand'] ?? '';
        $name = $data['name'] ?? '';
        return trim("{$brand} {$name} - Buy Online in Rwanda | RwandaDubai");
    }

    private function generateFallbackDescription(array $data): string
    {
        $name = $data['name'] ?? '';
        $price = $data['price'] ?? '';
        return "Buy {$name} online in Rwanda. Best price: {$price} RWF. Fast delivery across Kigali. Shop now at RwandaDubai!";
    }

    private function generateFallbackKeywords(array $data): array
    {
        $name = strtolower($data['name'] ?? '');
        $brand = strtolower($data['brand'] ?? '');
        $category = strtolower($data['category'] ?? '');

        return [
            "buy {$name}",
            "{$name} price",
            "{$name} Rwanda",
            "{$brand} {$category}",
            "{$name} Kigali",
            "acheter {$name}",
            "gura {$name}",
        ];
    }

    private function generateFallbackSearchKeywords(array $data): string
    {
        $name = $data['name'] ?? '';
        $brand = $data['brand'] ?? '';
        
        return implode(', ', [
            // English
            "buy {$name}",
            "{$name} price Rwanda",
            "{$name} online Kigali",
            "best {$name} deals",
            // French
            "acheter {$name}",
            "prix {$name} Rwanda",
            "{$name} en ligne Kigali",
            // Kinyarwanda
            "gura {$name}",
            "ikiguzi cya {$name}",
            "{$name} muri Kigali",
        ]);
    }

    private function getDefaultTranslations(array $data): array
    {
        $name = $data['name'] ?? '';
        $brand = $data['brand'] ?? '';

        return [
            'en' => [
                'title' => "Buy {$brand} {$name} - Best Price in Rwanda",
                'description' => "Shop {$brand} {$name} online. Fast delivery in Kigali & across Rwanda. Genuine products, best prices.",
            ],
            'fr' => [
                'title' => "Acheter {$brand} {$name} - Meilleur Prix au Rwanda",
                'description' => "Achetez {$brand} {$name} en ligne. Livraison rapide à Kigali et dans tout le Rwanda. Produits authentiques, meilleurs prix.",
            ],
            'rw' => [
                'title' => "Gura {$brand} {$name} - Ikiguzi Cyiza mu Rwanda",
                'description' => "Gura {$brand} {$name} kuri interineti. Twoherereza vuba i Kigali no mu Rwanda yose. Ibicuruzwa nyabyo, ibiciro byiza.",
            ],
        ];
    }

    private function generateStructuredData(array $data): array
    {
        return [
            '@context' => 'https://schema.org/',
            '@type' => 'Product',
            'name' => $data['name'] ?? '',
            'description' => $data['description'] ?? '',
            'brand' => [
                '@type' => 'Brand',
                'name' => $data['brand'] ?? ''
            ],
            'offers' => [
                '@type' => 'Offer',
                'url' => config('app.url') . '/products/' . ($data['slug'] ?? ''),
                'priceCurrency' => 'RWF',
                'price' => $data['price'] ?? 0,
                'availability' => 'https://schema.org/InStock',
                'seller' => [
                    '@type' => 'Organization',
                    'name' => 'RwandaDubai'
                ]
            ]
        ];
    }

    /**
     * Generate AI suggestions for improving product content
     */
    public function generateContentSuggestions(string $name, string $description): array
    {
        $prompt = <<<PROMPT
Analyze this e-commerce product and provide 5 specific suggestions to improve its SEO and conversion rate:

Product Name: {$name}
Description: {$description}

Provide suggestions as a JSON array of strings. Focus on:
1. Title optimization
2. Description improvements
3. Missing key features to highlight
4. Call-to-action improvements
5. Keyword opportunities

Return ONLY a JSON array of 5 strings, no markdown.
PROMPT;

        try {
            $response = Http::timeout(15)
                ->post("{$this->baseUrl}?key={$this->apiKey}", [
                    'contents' => [['parts' => [['text' => $prompt]]]]
                ]);

            if ($response->successful()) {
                $content = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? '[]';
                $content = preg_replace('/```json\s*|\s*```/', '', $content);
                return json_decode(trim($content), true) ?? [];
            }
        } catch (\Exception $e) {
            Log::error('Suggestion Generation Error', ['error' => $e->getMessage()]);
        }

        return [
            "Add specific technical specifications",
            "Include brand name in title",
            "Add delivery information",
            "Highlight unique selling points",
            "Include call-to-action phrases"
        ];
    }
}
