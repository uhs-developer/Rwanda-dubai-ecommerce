<?php

namespace Database\Seeders;

use App\Models\Tenant;
use Illuminate\Database\Seeder;

class TenantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default tenant
        Tenant::firstOrCreate(
            ['slug' => 'default'],
            [
                'name' => 'Default Store',
                'domain' => 'localhost',
                'config' => [
                    'currency' => 'USD',
                    'timezone' => 'Africa/Kigali',
                    'locale' => 'en',
                ],
                'is_active' => true,
            ]
        );

        $this->command->info('Default tenant created successfully!');
    }
}
