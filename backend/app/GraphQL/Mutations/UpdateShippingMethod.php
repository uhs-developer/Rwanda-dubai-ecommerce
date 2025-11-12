<?php

namespace App\GraphQL\Mutations;

use App\Models\ShippingMethod;

class UpdateShippingMethod
{
    public function __invoke($_, array $args)
    {
        $input = $args['input'];

        $method = ShippingMethod::findOrFail($args['id']);

        $method->update([
            'name' => $input['name'],
            'code' => $input['code'],
            'description' => $input['description'] ?? null,
            'carrier' => $input['carrier'] ?? null,
            'type' => $input['type'],
            'base_price' => $input['basePrice'] ?? 0,
            'estimated_days_min' => $input['estimatedDaysMin'] ?? null,
            'estimated_days_max' => $input['estimatedDaysMax'] ?? null,
            'is_active' => $input['isActive'] ?? true,
            'sort_order' => $input['sortOrder'] ?? 0,
        ]);

        return $method->fresh();
    }
}
