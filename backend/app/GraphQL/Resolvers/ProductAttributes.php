<?php

namespace App\GraphQL\Resolvers;

use App\Models\Product;

class ProductAttributes
{
    public function __invoke(Product $product)
    {
        // Return empty array for now - attributes can be implemented later
        return [];
    }
}
