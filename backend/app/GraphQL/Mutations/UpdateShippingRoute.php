<?php

namespace App\GraphQL\Mutations;

use App\Models\ShippingRoute;

class UpdateShippingRoute
{
    public function __invoke($_, array $args)
    {
        $input = $args['input'];

        $route = ShippingRoute::findOrFail($args['id']);

        $route->update([
            'name' => $input['name'],
            'code' => $input['code'],
            'origin_country' => $input['originCountry'],
            'origin_city' => $input['originCity'] ?? null,
            'destination_country' => $input['destinationCountry'],
            'destination_city' => $input['destinationCity'] ?? null,
            'transit_points' => $input['transitPoints'] ?? null,
            'description' => $input['description'] ?? null,
            'is_active' => $input['isActive'] ?? true,
            'sort_order' => $input['sortOrder'] ?? 0,
        ]);

        return $route->fresh();
    }
}
