<?php

namespace App\GraphQL\Mutations;

use App\Models\Product;
use Illuminate\Support\Str;

class CreateProduct
{
    public function __invoke($_, array $args)
    {
        $input = $args['input'];
        
        // Generate slug if not provided
        if (empty($input['slug'])) {
            $input['slug'] = Str::slug($input['name']);
        }

        $product = Product::create([
            'sku' => $input['sku'],
            'name' => $input['name'],
            'slug' => $input['slug'] ?? Str::slug($input['name']),
            'price' => $input['price'],
            'original_price' => $input['originalPrice'] ?? null,
            'stock_quantity' => $input['stockQuantity'] ?? 0,
            'weight' => $input['weight'] ?? null,
            'category_id' => $input['categoryId'] ?? null,
            'brand_id' => $input['brandId'] ?? null,
            'description' => $input['description'] ?? null,
            'short_description' => $input['shortDescription'] ?? null,
            'is_active' => $input['isActive'] ?? true,
            'is_featured' => $input['isFeatured'] ?? false,
        ]);

        // Sync pivot categories/subcategories if provided
        if (!empty($input['categoryIds']) && is_array($input['categoryIds'])) {
            $product->categories()->sync($input['categoryIds']);
        } elseif (!empty($input['categoryId'])) {
            // If only single category provided, also reflect in pivot
            $product->categories()->sync([$input['categoryId']]);
        }
        if (!empty($input['subcategoryIds']) && is_array($input['subcategoryIds'])) {
            $product->subcategories()->sync($input['subcategoryIds']);
        }

        return $product->load(['category', 'categories', 'subcategories', 'brand']);
    }
}

