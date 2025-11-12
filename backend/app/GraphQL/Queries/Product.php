<?php

namespace App\GraphQL\Queries;

use App\Models\Product as ProductModel;

class Product
{
    /**
     * Get single product by slug
     */
    public function __invoke($_, array $args)
    {
        // TODO: Add proper multi-tenancy when ready
        return ProductModel::where('slug', $args['slug'])
            ->with(['category', 'brand', 'images'])
            ->active()
            ->firstOrFail();
    }
}
