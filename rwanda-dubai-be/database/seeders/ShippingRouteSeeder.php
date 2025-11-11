<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ShippingRoute;

class ShippingRouteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $routes = [
            [
                'name' => 'Dubai to Kigali Direct',
                'code' => 'dxb_kgl_direct',
                'origin_country' => 'United Arab Emirates',
                'origin_city' => 'Dubai',
                'destination_country' => 'Rwanda',
                'destination_city' => 'Kigali',
                'transit_points' => null,
                'description' => 'Direct route from Dubai to Kigali International Airport',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Dubai to Kigali via Nairobi',
                'code' => 'dxb_kgl_nbo',
                'origin_country' => 'United Arab Emirates',
                'origin_city' => 'Dubai',
                'destination_country' => 'Rwanda',
                'destination_city' => 'Kigali',
                'transit_points' => ['Nairobi'],
                'description' => 'Route from Dubai to Kigali with transit through Nairobi',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Dubai to Kigali via Addis Ababa',
                'code' => 'dxb_kgl_add',
                'origin_country' => 'United Arab Emirates',
                'origin_city' => 'Dubai',
                'destination_country' => 'Rwanda',
                'destination_city' => 'Kigali',
                'transit_points' => ['Addis Ababa'],
                'description' => 'Route from Dubai to Kigali with transit through Addis Ababa',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Dubai to Mombasa Sea',
                'code' => 'dxb_msa_sea',
                'origin_country' => 'United Arab Emirates',
                'origin_city' => 'Dubai',
                'destination_country' => 'Kenya',
                'destination_city' => 'Mombasa',
                'transit_points' => null,
                'description' => 'Sea freight route from Dubai to Mombasa port',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Mombasa to Kigali Land',
                'code' => 'msa_kgl_land',
                'origin_country' => 'Kenya',
                'origin_city' => 'Mombasa',
                'destination_country' => 'Rwanda',
                'destination_city' => 'Kigali',
                'transit_points' => ['Nairobi', 'Kampala'],
                'description' => 'Overland route from Mombasa to Kigali via Nairobi and Kampala',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Dubai to Dar es Salaam Sea',
                'code' => 'dxb_dar_sea',
                'origin_country' => 'United Arab Emirates',
                'origin_city' => 'Dubai',
                'destination_country' => 'Tanzania',
                'destination_city' => 'Dar es Salaam',
                'transit_points' => null,
                'description' => 'Sea freight route from Dubai to Dar es Salaam port',
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'name' => 'Dar es Salaam to Kigali Land',
                'code' => 'dar_kgl_land',
                'origin_country' => 'Tanzania',
                'origin_city' => 'Dar es Salaam',
                'destination_country' => 'Rwanda',
                'destination_city' => 'Kigali',
                'transit_points' => ['Dodoma', 'Mwanza'],
                'description' => 'Overland route from Dar es Salaam to Kigali',
                'is_active' => true,
                'sort_order' => 7,
            ],
            [
                'name' => 'Dubai to Entebbe',
                'code' => 'dxb_ebb_air',
                'origin_country' => 'United Arab Emirates',
                'origin_city' => 'Dubai',
                'destination_country' => 'Uganda',
                'destination_city' => 'Entebbe',
                'transit_points' => null,
                'description' => 'Air route from Dubai to Entebbe International Airport',
                'is_active' => true,
                'sort_order' => 8,
            ],
            [
                'name' => 'Entebbe to Kigali Land',
                'code' => 'ebb_kgl_land',
                'origin_country' => 'Uganda',
                'origin_city' => 'Entebbe',
                'destination_country' => 'Rwanda',
                'destination_city' => 'Kigali',
                'transit_points' => ['Kampala'],
                'description' => 'Short overland route from Entebbe/Kampala to Kigali',
                'is_active' => true,
                'sort_order' => 9,
            ],
        ];

        foreach ($routes as $route) {
            ShippingRoute::updateOrCreate(
                ['code' => $route['code']], // Find by unique code
                $route // Update or create with these values
            );
        }

        $this->command->info('Shipping routes seeded successfully!');
    }
}
