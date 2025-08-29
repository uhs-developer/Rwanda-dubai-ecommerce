<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get roles
        $superAdminRole = Role::where('name', 'super_admin')->first();
        $adminRole = Role::where('name', 'admin')->first();
        $merchantRole = Role::where('name', 'merchant')->first();
        $customerRole = Role::where('name', 'customer')->first();

        // Create Super Admin
        $superAdmin = User::create([
            'name' => 'Rwanda Dubai E-commerce Admin',
            'email' => 'admin@rwandadubai.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password123'),
            'phone' => '+250788123456',
            'status' => 'active',
        ]);
        $superAdmin->roles()->attach($superAdminRole);

        // Create Dubai Merchants
        $dubaiMerchants = [
            [
                'name' => 'Ahmed Al-Rashid Electronics',
                'email' => 'ahmed.electronics@dubaishop.com',
                'phone' => '+971501234567',
            ],
            [
                'name' => 'Fatima Auto Parts',
                'email' => 'fatima.autoparts@dubaishop.com',
                'phone' => '+971502345678',
            ],
            [
                'name' => 'Omar Home Appliances',
                'email' => 'omar.appliances@dubaishop.com',
                'phone' => '+971503456789',
            ],
            [
                'name' => 'Layla Fashion & Textiles',
                'email' => 'layla.fashion@dubaishop.com',
                'phone' => '+971504567890',
            ],
        ];

        foreach ($dubaiMerchants as $merchantData) {
            $merchant = User::create([
                'name' => $merchantData['name'],
                'email' => $merchantData['email'],
                'email_verified_at' => now(),
                'password' => Hash::make('merchant123'),
                'phone' => $merchantData['phone'],
                'status' => 'active',
            ]);
            $merchant->roles()->attach($merchantRole);
        }

        // Create Rwanda Customers
        $rwandaCustomers = [
            [
                'name' => 'Jean Baptiste Nkurunziza',
                'email' => 'jean.baptiste@email.com',
                'phone' => '+250788234567',
            ],
            [
                'name' => 'Marie Claire Uwimana',
                'email' => 'marie.claire@email.com',
                'phone' => '+250788345678',
            ],
            [
                'name' => 'Peter Mugisha',
                'email' => 'peter.mugisha@email.com',
                'phone' => '+250788456789',
            ],
            [
                'name' => 'Grace Mukamana',
                'email' => 'grace.mukamana@email.com',
                'phone' => '+250788567890',
            ],
            [
                'name' => 'David Ndayishimiye',
                'email' => 'david.ndayishimiye@email.com',
                'phone' => '+250788678901',
            ],
        ];

        foreach ($rwandaCustomers as $customerData) {
            $customer = User::create([
                'name' => $customerData['name'],
                'email' => $customerData['email'],
                'email_verified_at' => now(),
                'password' => Hash::make('customer123'),
                'phone' => $customerData['phone'],
                'status' => 'active',
            ]);
            $customer->roles()->attach($customerRole);
        }

        // Create Additional Admin Users
        $admins = [
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah.johnson@rwandadubai.com',
                'phone' => '+250788789012',
            ],
            [
                'name' => 'Michael Omondi',
                'email' => 'michael.omondi@rwandadubai.com',
                'phone' => '+250788890123',
            ],
        ];

        foreach ($admins as $adminData) {
            $admin = User::create([
                'name' => $adminData['name'],
                'email' => $adminData['email'],
                'email_verified_at' => now(),
                'password' => Hash::make('admin123'),
                'phone' => $adminData['phone'],
                'status' => 'active',
            ]);
            $admin->roles()->attach($adminRole);
        }

        $this->command->info('Created users: 1 Super Admin, 2 Admins, 4 Merchants, 5 Customers');
    }
}
