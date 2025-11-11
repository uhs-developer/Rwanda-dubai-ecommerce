<?php

namespace App\GraphQL\Queries;

use App\Models\Brand as BrandModel;

class Brand
{
    /**
     * Get single brand by slug with tenant scoping
     */
    public function __invoke($_, array $args)
    {
        $tenant = app('tenant');

        return BrandModel::where('tenant_id', $tenant->id)
            ->where('slug', $args['slug'])
            ->firstOrFail();
    }
}
