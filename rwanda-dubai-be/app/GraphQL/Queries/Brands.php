<?php

namespace App\GraphQL\Queries;

use App\Models\Brand;

class Brands
{
    /**
     * Get all brands for tenant
     */
    public function __invoke($_, array $args)
    {
        // TODO: Add proper multi-tenancy when ready
        return Brand::orderBy('name')
            ->get();
    }
}
