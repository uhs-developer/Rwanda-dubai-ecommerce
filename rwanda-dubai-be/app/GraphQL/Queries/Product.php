<?php

namespace App\GraphQL\Queries;

use App\Models\Product as ProductModel;

class Product
{
    /**
     * Get single product by slug with tenant scoping
     */
    public function __invoke($_, array $args)
    {
        $tenant = app('tenant');

        return ProductModel::where('tenant_id', $tenant->id)
            ->where('slug', $args['slug'])
            ->with(['category', 'brand', 'images'])
            ->active()
            ->firstOrFail();
    }
}
