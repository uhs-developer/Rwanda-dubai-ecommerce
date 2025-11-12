<?php

namespace App\GraphQL\Mutations;

use App\Models\Brand;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CreateBrand
{
    public function __invoke($_, array $args)
    {
        $input = $args['input'];
        $slug = $input['slug'] ?? Str::slug($input['name']);

        // Check for duplicate name
        $existingByName = Brand::where('name', $input['name'])->first();
        if ($existingByName) {
            throw ValidationException::withMessages([
                'name' => ['A brand with this name already exists.']
            ]);
        }

        // Check for duplicate slug
        $existingBySlug = Brand::where('slug', $slug)->first();
        if ($existingBySlug) {
            throw ValidationException::withMessages([
                'slug' => ['A brand with this slug already exists.']
            ]);
        }

        $brand = Brand::create([
            'name' => $input['name'],
            'slug' => $slug,
        ]);

        return $brand;
    }
}


