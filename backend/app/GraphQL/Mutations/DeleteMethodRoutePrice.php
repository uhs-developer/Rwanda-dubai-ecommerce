<?php

namespace App\GraphQL\Mutations;

use App\Models\ShippingMethodRoutePrice;

class DeleteMethodRoutePrice
{
    public function __invoke($_, array $args)
    {
        $price = ShippingMethodRoutePrice::findOrFail($args['id']);

        $price->delete();

        return $price;
    }
}
