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
        // Get default tenant
        $tenant = DB::table('tenants')->first();
        if (!$tenant) {
            $this->command->warn('No tenant found. Please run TenantSeeder first.');
            return;
        }

        $methods = [
            [
                'tenant_id' => $tenant->id,
                'name' => 'Air Express',
                'code' => 'air_express',
                'description' => 'Fast air freight delivery with priority handling',
                'carrier' => 'Emirates SkyCargo',
                'is_active' => true,
                'sort_order' => 1,
                'config' => [
                    'type' => 'air',
                    'base_price' => 150.00,
                    'estimated_days_min' => 3,
                    'estimated_days_max' => 5,
                ],
            ],
            [
                'tenant_id' => $tenant->id,
                'name' => 'Air Standard',
                'code' => 'air_standard',
                'description' => 'Standard air freight delivery',
                'carrier' => 'Kenya Airways Cargo',
                'is_active' => true,
                'sort_order' => 2,
                'config' => [
                    'type' => 'air',
                    'base_price' => 100.00,
                    'estimated_days_min' => 5,
                    'estimated_days_max' => 8,
                ],
            ],
            [
                'tenant_id' => $tenant->id,
                'name' => 'Sea Freight Express',
                'code' => 'sea_express',
                'description' => 'Expedited sea freight with direct shipping',
                'carrier' => 'Maersk Line',
                'is_active' => true,
                'sort_order' => 3,
                'config' => [
                    'type' => 'sea',
                    'base_price' => 80.00,
                    'estimated_days_min' => 25,
                    'estimated_days_max' => 30,
                ],
            ],
            [
                'tenant_id' => $tenant->id,
                'name' => 'Sea Freight Standard',
                'code' => 'sea_standard',
                'description' => 'Cost-effective sea freight with consolidated shipping',
                'carrier' => 'MSC Mediterranean Shipping',
                'is_active' => true,
                'sort_order' => 4,
                'config' => [
                    'type' => 'sea',
                    'base_price' => 50.00,
                    'estimated_days_min' => 35,
                    'estimated_days_max' => 45,
                ],
            ],
            [
                'tenant_id' => $tenant->id,
                'name' => 'Sea Freight Economy',
                'code' => 'sea_economy',
                'description' => 'Budget-friendly sea freight for non-urgent shipments',
                'carrier' => 'CMA CGM',
                'is_active' => true,
                'sort_order' => 5,
                'config' => [
                    'type' => 'sea',
                    'base_price' => 35.00,
                    'estimated_days_min' => 45,
                    'estimated_days_max' => 60,
                ],
            ],
            [
                'tenant_id' => $tenant->id,
                'name' => 'Land Express',
                'code' => 'land_express',
                'description' => 'Fast overland delivery for regional shipments',
                'carrier' => 'DHL Express East Africa',
                'is_active' => true,
                'sort_order' => 6,
                'config' => [
                    'type' => 'land',
                    'base_price' => 75.00,
                    'estimated_days_min' => 2,
                    'estimated_days_max' => 4,
                ],
            ],
        ];

        foreach ($methods as $method) {
            ShippingMethod::updateOrCreate(
                ['code' => $method['code']], // Find by unique code
                $method // Update or create with these values
            );
        }

        $this->command->info('Shipping methods seeded successfully!');
    }
}
