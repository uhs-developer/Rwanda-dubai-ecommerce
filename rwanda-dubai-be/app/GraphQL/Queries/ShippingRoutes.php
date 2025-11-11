<?php

namespace App\GraphQL\Queries;

use App\Models\ShippingRoute;

class ShippingRoutes
{
    public function __invoke($_, array $args)
    {
        $query = ShippingRoute::query();

        if (isset($args['isActive'])) {
            $query->where('is_active', $args['isActive']);
        }

        return $query->orderBy('sort_order')->orderBy('name')->get();
    }
}
