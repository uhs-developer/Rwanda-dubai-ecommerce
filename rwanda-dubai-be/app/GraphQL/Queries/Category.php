<?php

namespace App\GraphQL\Queries;

use App\Models\Category as CategoryModel;

class Category
{
    /**
     * Get single category by slug
     */
    public function __invoke($_, array $args)
    {
        // TODO: Add proper multi-tenancy when ready
        return CategoryModel::where('slug', $args['slug'])
            ->with('children')
            ->firstOrFail();
    }
}
