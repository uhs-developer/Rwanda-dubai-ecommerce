<?php

namespace App\GraphQL\Queries;

use App\Models\Category;

class Categories
{
    /**
     * Get all categories (tree structure)
     */
    public function __invoke($_, array $args)
    {
        // TODO: Add proper multi-tenancy when ready
        // For now, use default tenant_id = 1 or null for single-tenant setup
        return Category::whereNull('parent_id')
            ->with('children')
            ->orderBy('sort_order')
            ->get();
    }
}
