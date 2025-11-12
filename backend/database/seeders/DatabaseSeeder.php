<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            TenantSeeder::class,
            RolesAndPermissionsSeeder::class,
            // UserSeeder::class, // Disabled - using Spatie Permission now
            ProductsAndCategoriesSeeder::class,
            ExchangeRatesSeeder::class,
            ShippingMethodSeeder::class,
            ShippingRouteSeeder::class,
            // ShippingMethodRoutePriceSeeder::class, // Empty seeder - skip for now
            TestOrdersSeeder::class, // Creates test orders and invoices
            // RwandaDubaiCommerceSeeder::class,
            // BlogPostsSeeder::class,
        ]);
    }
}
