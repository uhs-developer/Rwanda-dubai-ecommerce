<?php

namespace App\GraphQL\Mutations;

use App\Models\Brand;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class UpdateBrand
{
    public function __invoke($_, array $args)
    {
        $brand = Brand::findOrFail($args['id']);
        $input = $args['input'];

        $name = $input['name'] ?? $brand->name;
        $slug = $input['slug'] ?? Str::slug($name);

        // Check for duplicate name (excluding current brand)
        if (isset($input['name'])) {
            $existingByName = Brand::where('name', $name)
                ->where('id', '!=', $brand->id)
                ->first();
            if ($existingByName) {
                throw ValidationException::withMessages([
                    'name' => ['A brand with this name already exists.']
                ]);
            }
        }

        // Check for duplicate slug (excluding current brand)
        if (isset($input['slug']) || isset($input['name'])) {
            $existingBySlug = Brand::where('slug', $slug)
                ->where('id', '!=', $brand->id)
                ->first();
            if ($existingBySlug) {
                throw ValidationException::withMessages([
                    'slug' => ['A brand with this slug already exists.']
                ]);
            }
        }

        $brand->update([
            'name' => $name,
            'slug' => $slug,
        ]);

        return $brand->fresh();
    }
}


