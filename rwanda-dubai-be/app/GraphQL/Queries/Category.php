<?php

namespace App\GraphQL\Queries;

use App\Models\Category as CategoryModel;

class Category
{
    /**
     * Get single category by slug with tenant scoping
     */
    public function __invoke($_, array $args)
    {
        $tenant = app('tenant');

        return CategoryModel::where('tenant_id', $tenant->id)
            ->where('slug', $args['slug'])
            ->with('children')
            ->firstOrFail();
    }
}
