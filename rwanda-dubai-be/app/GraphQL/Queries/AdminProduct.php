<?php

namespace App\GraphQL\Queries;

use App\Models\Product;

class AdminProduct
{
    public function __invoke($_, array $args)
    {
        return Product::with(['category', 'subcategory', 'brand', 'images'])
            ->findOrFail($args['id']);
    }
}

