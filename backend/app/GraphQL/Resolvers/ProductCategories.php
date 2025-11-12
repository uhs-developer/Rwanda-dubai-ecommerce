<?php

namespace App\GraphQL\Resolvers;

use App\Models\Product;

class ProductCategories
{
    public function __invoke(Product $product)
    {
        // Return categories relation, ensuring it's always an array
        return $product->categories ?? [];
    }
}
