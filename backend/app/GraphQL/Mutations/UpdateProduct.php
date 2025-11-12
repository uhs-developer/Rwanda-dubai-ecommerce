<?php

namespace App\GraphQL\Mutations;

use App\Models\Product;

class UpdateProduct
{
    public function __invoke($_, array $args)
    {
        $product = Product::findOrFail($args['id']);
        $input = $args['input'];

        $updateData = [];
        if (array_key_exists('sku', $input)) $updateData['sku'] = $input['sku'];
        if (array_key_exists('name', $input)) $updateData['name'] = $input['name'];
        if (array_key_exists('slug', $input)) $updateData['slug'] = $input['slug'];
        if (array_key_exists('price', $input)) $updateData['price'] = $input['price'];
        if (array_key_exists('originalPrice', $input)) $updateData['original_price'] = $input['originalPrice'];
        if (array_key_exists('stockQuantity', $input)) $updateData['stock_quantity'] = $input['stockQuantity'];
        if (array_key_exists('weight', $input)) $updateData['weight'] = $input['weight'];
        if (array_key_exists('categoryId', $input)) $updateData['category_id'] = $input['categoryId'];
        if (array_key_exists('brandId', $input)) $updateData['brand_id'] = $input['brandId'];
        if (array_key_exists('description', $input)) $updateData['description'] = $input['description'];
        if (array_key_exists('shortDescription', $input)) $updateData['short_description'] = $input['shortDescription'];
        if (array_key_exists('isActive', $input)) $updateData['is_active'] = $input['isActive'];
        if (array_key_exists('isFeatured', $input)) $updateData['is_featured'] = $input['isFeatured'];
        // Note: primaryImage is derived from images relation; skipping direct column update here.

        $product->update($updateData);

        // Sync pivots if arrays provided
        if (array_key_exists('categoryIds', $input)) {
            $ids = is_array($input['categoryIds']) ? $input['categoryIds'] : [];
            $product->categories()->sync($ids);
        } elseif (array_key_exists('categoryId', $input) && $input['categoryId']) {
            // If only single categoryId provided
            $product->categories()->sync([$input['categoryId']]);
        }
        if (array_key_exists('subcategoryIds', $input)) {
            $ids = is_array($input['subcategoryIds']) ? $input['subcategoryIds'] : [];
            $product->subcategories()->sync($ids);
        }

        return $product->load(['category', 'categories', 'subcategories', 'brand']);
    }
}

