<?php

namespace App\GraphQL\Mutations;

use App\Models\Brand;
use Illuminate\Support\Str;

class UpdateBrand
{
    public function __invoke($_, array $args)
    {
        $brand = Brand::findOrFail($args['id']);
        $input = $args['input'];
        $brand->update([
            'name' => $input['name'] ?? $brand->name,
            'slug' => $input['slug'] ?? $brand->slug ?? Str::slug($brand->name),
        ]);
        return $brand;
    }
}


