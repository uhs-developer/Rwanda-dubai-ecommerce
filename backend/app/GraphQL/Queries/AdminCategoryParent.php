<?php

namespace App\GraphQL\Queries;

use App\Models\Category;

class AdminCategoryParent
{
    /**
     * @param Category $root
     */
    public function __invoke($root, array $args = [])
    {
        return $root->parent()->first();
    }
}


