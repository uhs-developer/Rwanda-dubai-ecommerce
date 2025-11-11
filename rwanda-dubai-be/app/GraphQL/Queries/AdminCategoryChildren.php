<?php

namespace App\GraphQL\Queries;

use App\Models\Category;

class AdminCategoryChildren
{
    /**
     * @param Category $root
     */
    public function __invoke($root, array $args = [])
    {
        // Return direct children ordered by sort_order then name
        return $root->children()->orderBy('sort_order')->orderBy('name')->get();
    }
}


