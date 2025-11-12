<?php

namespace App\GraphQL\Queries;

use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Database\Eloquent\Builder;

class ProductFilters
{
    /**
     * Get filter options - always return all available categories and brands
     * Price range can be dynamic based on search query only
     */
    public function __invoke($_, array $args)
    {
        // Start with base query for price range calculation
        $priceQuery = Product::query()->active();

        // Only apply search query to price range, not other filters
        if (isset($args['q']) && !empty($args['q'])) {
            $priceQuery->search($args['q']);
        }

        // Get price range from all products (or search-filtered products)
        $priceStats = $priceQuery
            ->selectRaw('MIN(price) as min_price, MAX(price) as max_price')
            ->first();

        $minPrice = $priceStats->min_price ?? 0;
        $maxPrice = $priceStats->max_price ?? 1000;

        // Always get ALL categories that have products (not filtered by current selection)
        $categoryIds = Product::query()
            ->active()
            ->distinct()
            ->pluck('category_id')
            ->filter()
            ->toArray();

        $categories = Category::whereIn('id', $categoryIds)
            ->with(['children', 'children.children'])
            ->orderBy('name')
            ->get();

        // Always get ALL brands that have products (not filtered by current selection)
        $brandIds = Product::query()
            ->active()
            ->distinct()
            ->pluck('brand_id')
            ->filter()
            ->toArray();

        $brands = Brand::whereIn('id', $brandIds)
            ->orderBy('name')
            ->get();

        return [
            'maxPrice' => $maxPrice,
            'categories' => $categories,
            'brands' => $brands,
            'availableFilters' => [
                'hasInStockFilter' => true,
                'priceRange' => [
                    'min' => $minPrice,
                    'max' => $maxPrice,
                ],
                'categoryCount' => count($categories),
                'brandCount' => count($brands),
            ],
        ];
    }
}
