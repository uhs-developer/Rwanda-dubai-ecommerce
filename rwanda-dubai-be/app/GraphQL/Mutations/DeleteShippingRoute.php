<?php

namespace App\GraphQL\Mutations;

use App\Models\ShippingRoute;

class DeleteShippingRoute
{
    public function __invoke($_, array $args)
    {
        $route = ShippingRoute::findOrFail($args['id']);

        $route->delete();

        return $route;
    }
}
