<?php

namespace App\GraphQL\Queries;

use App\Models\Brand as BrandModel;

class Brand
{
    /**
     * Get single brand by slug
     */
    public function __invoke($_, array $args)
    {
        // TODO: Add proper multi-tenancy when ready
        return BrandModel::where('slug', $args['slug'])
            ->firstOrFail();
    }
}
