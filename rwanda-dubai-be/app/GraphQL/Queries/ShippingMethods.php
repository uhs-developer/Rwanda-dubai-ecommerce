<?php

namespace App\GraphQL\Queries;

use App\Models\ShippingMethod;

class ShippingMethods
{
    public function __invoke($_, array $args)
    {
        $query = ShippingMethod::query();

        if (isset($args['isActive'])) {
            $query->where('is_active', $args['isActive']);
        }

        return $query->orderBy('sort_order')->orderBy('name')->get();
    }
}
