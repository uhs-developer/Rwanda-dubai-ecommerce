<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Magento-parity permissions
        $permissions = [
            // Dashboard
            'view-dashboard',
            // Catalog - Products
            'view-products', 'create-products', 'edit-products', 'delete-products', 'manage-product-attributes',
            // Catalog - Categories
            'view-categories', 'create-categories', 'edit-categories', 'delete-categories',
            // Sales - Orders
            'view-orders', 'create-orders', 'edit-orders', 'cancel-orders', 'invoice-orders', 'ship-orders', 'refund-orders',
            // Customers
            'view-customers', 'create-customers', 'edit-customers', 'delete-customers', 'manage-customer-groups',
            // Marketing
            'view-promotions', 'create-promotions', 'edit-promotions', 'delete-promotions', 'manage-coupons',
            // Content - CMS
            'view-pages', 'create-pages', 'edit-pages', 'delete-pages', 'manage-blocks', 'manage-widgets',
            // Stores - Configuration
            'view-configuration', 'edit-configuration', 'manage-taxes', 'manage-shipping', 'manage-payment-methods',
            // System
            'manage-cache', 'manage-indexing', 'import-export', 'view-reports', 'manage-integrations', 'manage-users', 'manage-roles', 'view-audit-logs',
            // Multi-tenant
            'manage-tenants', 'switch-tenants',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles (Magento-like: superadmin and admin)
        $superAdminRole = Role::firstOrCreate(['name' => 'superadmin']);
        $adminRole = Role::firstOrCreate(['name' => 'admin']);

        // Super Admin gets all permissions
        $allPermissions = Permission::all();
        $superAdminRole->syncPermissions($allPermissions);

        // Admin gets most permissions (excluding tenant management and some system operations)
        $adminPermissions = Permission::whereNotIn('name', [
            'manage-tenants',
            'manage-users',
            'manage-roles',
        ])->get();
        $adminRole->syncPermissions($adminPermissions);

        // Create default admin users
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('SuperAdmin@123'),
                'status' => 'active',
            ]
        );
        $superAdmin->assignRole('superadmin');

        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('Admin@123'),
                'status' => 'active',
            ]
        );
        $admin->assignRole('admin');

        $this->command->info('Roles and permissions seeded successfully!');
        $this->command->info('Super Admin: superadmin@example.com / SuperAdmin@123');
        $this->command->info('Admin: admin@example.com / Admin@123');
    }
}
