<?php

namespace App\GraphQL\Queries;

use App\Models\Category;

class Categories
{
    /**
     * Get all categories for tenant (tree structure)
     */
    public function __invoke($_, array $args)
    {
        $tenant = app('tenant');

        return Category::where('tenant_id', $tenant->id)
            ->whereNull('parent_id')
            ->with('children')
            ->orderBy('sort_order')
            ->get();
    }
}
