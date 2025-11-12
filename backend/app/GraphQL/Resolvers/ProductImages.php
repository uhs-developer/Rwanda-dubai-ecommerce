<?php

namespace App\GraphQL\Resolvers;

use App\Models\Product;

class ProductImages
{
    public function __invoke(Product $product)
    {
        // Filter out images with null URLs and ensure we have at least an empty array
        $images = $product->images()->get()->filter(function ($image) {
            return $image->image_url || $image->image_path;
        });

        // If no images, return empty array (GraphQL will handle this)
        return $images->values();
    }
}
