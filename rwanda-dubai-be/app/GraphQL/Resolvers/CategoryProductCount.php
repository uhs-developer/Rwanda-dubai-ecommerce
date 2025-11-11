<?php

namespace App\GraphQL\Resolvers;

use App\Models\Category;
use App\Models\Product;

class CategoryProductCount
{
    /**
     * Get the product count for a category (including all subcategories)
     */
    public function __invoke($category, array $args)
    {
        // Get the category model
        if (!$category instanceof Category) {
            return 0;
        }

        // Count products directly associated with this category
        $directCount = Product::where('category_id', $category->id)
            ->active()
            ->count();

        // Count products in all subcategories
        $subcategoryIds = $category->children()->pluck('id')->toArray();
        $subcategoryCount = 0;

        if (!empty($subcategoryIds)) {
            $subcategoryCount = Product::whereIn('category_id', $subcategoryIds)
                ->active()
                ->count();
        }

        // Also count products from many-to-many relationship if exists
        $manyToManyCount = 0;
        if (method_exists($category, 'products')) {
            $manyToManyCount = $category->products()->active()->count();
        }

        return $directCount + $subcategoryCount + $manyToManyCount;
    }
}
