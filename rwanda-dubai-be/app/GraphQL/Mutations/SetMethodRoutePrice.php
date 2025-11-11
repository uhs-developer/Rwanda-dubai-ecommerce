<?php

namespace App\GraphQL\Mutations;

use App\Models\ShippingMethodRoutePrice;

class SetMethodRoutePrice
{
    public function __invoke($_, array $args)
    {
        $input = $args['input'];

        $price = ShippingMethodRoutePrice::updateOrCreate(
            [
                'shipping_method_id' => $input['shippingMethodId'],
                'shipping_route_id' => $input['shippingRouteId'],
            ],
            [
                'price_per_kg' => $input['pricePerKg'] ?? null,
                'price_per_cbm' => $input['pricePerCbm'] ?? null,
                'flat_rate' => $input['flatRate'] ?? null,
                'min_weight_kg' => $input['minWeightKg'] ?? null,
                'max_weight_kg' => $input['maxWeightKg'] ?? null,
                'handling_fee' => $input['handlingFee'] ?? null,
                'fuel_surcharge_percent' => $input['fuelSurchargePercent'] ?? null,
                'insurance_percent' => $input['insurancePercent'] ?? null,
                'customs_clearance_fee' => $input['customsClearanceFee'] ?? null,
                'customs_duty_percent' => $input['customsDutyPercent'] ?? null,
                'customs_vat_percent' => $input['customsVatPercent'] ?? null,
                'estimated_days_min' => $input['estimatedDaysMin'] ?? null,
                'estimated_days_max' => $input['estimatedDaysMax'] ?? null,
                'is_active' => $input['isActive'] ?? true,
            ]
        );

        return $price;
    }
}
