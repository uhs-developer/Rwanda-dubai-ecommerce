<?php

namespace App\GraphQL\Queries;

use App\Models\ShippingMethodRoutePrice;

class GetMethodRoutePrice
{
    public function __invoke($_, array $args)
    {
        $query = ShippingMethodRoutePrice::where('shipping_method_id', $args['shippingMethodId'])
            ->where('shipping_route_id', $args['shippingRouteId']);

        return $query->first();
    }
}
