<?php

namespace App\GraphQL\Queries;

use App\Models\Category;

class AdminCategory
{
    public function __invoke($_, array $args)
    {
        return Category::findOrFail($args['id']);
    }
}