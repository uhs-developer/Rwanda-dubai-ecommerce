<?php

namespace App\GraphQL\Mutations;

use App\Models\Category;
use Illuminate\Support\Str;

class CreateCategory
{
    public function __invoke($_, array $args)
    {
        $input = $args['input'];

        $category = Category::create([
            'name' => $input['name'],
            'slug' => $input['slug'] ?? Str::slug($input['name']),
            'parent_id' => $input['parentId'] ?? null,
            'is_active' => $input['isActive'] ?? true,
        ]);

        return $category;
    }
}

