<?php

namespace App\GraphQL\Queries;

use App\Models\Brand;

class AdminBrands
{
    public function __invoke($_, array $args)
    {
        return Brand::orderBy('name')->get();
    }
}

