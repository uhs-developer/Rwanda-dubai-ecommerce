<?php

namespace App\GraphQL\Mutations;

use App\Models\Brand;

class DeleteBrand
{
    public function __invoke($_, array $args)
    {
        $brand = Brand::findOrFail($args['id']);
        return (bool) $brand->delete();
    }
}


