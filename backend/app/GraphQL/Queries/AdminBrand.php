<?php

namespace App\GraphQL\Queries;

use App\Models\Brand;

class AdminBrand
{
    /**
     * Get a single brand by ID
     */
    public function __invoke($_, array $args)
    {
        return Brand::findOrFail($args['id']);
    }
}
