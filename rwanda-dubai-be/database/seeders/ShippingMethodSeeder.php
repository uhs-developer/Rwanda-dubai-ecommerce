<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ShippingMethod;
use Illuminate\Support\Facades\DB;

class ShippingMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $methods = [
            [
                'name' => 'Air Express',
                'code' => 'air_express',
                'description' => 'Fast air freight delivery with priority handling',
                'carrier' => 'Emirates SkyCargo',
                'type' => 'air',
                'base_price' => 150.00,
                'estimated_days_min' => 3,
                'estimated_days_max' => 5,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Air Standard',
                'code' => 'air_standard',
                'description' => 'Standard air freight delivery',
                'carrier' => 'Kenya Airways Cargo',
                'type' => 'air',
                'base_price' => 100.00,
                'estimated_days_min' => 5,
                'estimated_days_max' => 8,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Sea Freight Express',
                'code' => 'sea_express',
                'description' => 'Expedited sea freight with direct shipping',
                'carrier' => 'Maersk Line',
                'type' => 'sea',
                'base_price' => 80.00,
                'estimated_days_min' => 25,
                'estimated_days_max' => 30,
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Sea Freight Standard',
                'code' => 'sea_standard',
                'description' => 'Cost-effective sea freight with consolidated shipping',
                'carrier' => 'MSC Mediterranean Shipping',
                'type' => 'sea',
                'base_price' => 50.00,
                'estimated_days_min' => 35,
                'estimated_days_max' => 45,
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Sea Freight Economy',
                'code' => 'sea_economy',
                'description' => 'Budget-friendly sea freight for non-urgent shipments',
                'carrier' => 'CMA CGM',
                'type' => 'sea',
                'base_price' => 35.00,
                'estimated_days_min' => 45,
                'estimated_days_max' => 60,
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Land Express',
                'code' => 'land_express',
                'description' => 'Fast overland delivery for regional shipments',
                'carrier' => 'DHL Express East Africa',
                'type' => 'land',
                'base_price' => 75.00,
                'estimated_days_min' => 2,
                'estimated_days_max' => 4,
                'is_active' => true,
                'sort_order' => 6,
            ],
        ];

        foreach ($methods as $method) {
            ShippingMethod::create($method);
        }

        $this->command->info('Shipping methods seeded successfully!');
    }
}
