<?php

namespace App\GraphQL\Mutations;

use App\Models\Brand;
use Illuminate\Support\Str;

class CreateBrand
{
    public function __invoke($_, array $args)
    {
        $input = $args['input'];
        $brand = Brand::create([
            'name' => $input['name'],
            'slug' => $input['slug'] ?? Str::slug($input['name']),
        ]);
        return $brand;
    }
}


