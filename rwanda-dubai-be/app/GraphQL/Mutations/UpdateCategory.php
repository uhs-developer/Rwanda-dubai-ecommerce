<?php

namespace App\GraphQL\Mutations;

use App\Models\Category;

class UpdateCategory
{
    public function __invoke($_, array $args)
    {
        $category = Category::findOrFail($args['id']);
        $input = $args['input'];

        $updateData = array_filter([
            'name' => $input['name'] ?? null,
            'slug' => $input['slug'] ?? null,
            'parent_id' => $input['parentId'] ?? null,
            'is_active' => isset($input['isActive']) ? $input['isActive'] : null,
        ], fn($value) => $value !== null);

        $category->update($updateData);

        return $category;
    }
}

