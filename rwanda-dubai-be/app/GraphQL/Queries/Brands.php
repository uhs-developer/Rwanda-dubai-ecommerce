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
        $tenant = app('tenant');

        return Brand::where('tenant_id', $tenant->id)
            ->orderBy('name')
            ->get();
    }
}
