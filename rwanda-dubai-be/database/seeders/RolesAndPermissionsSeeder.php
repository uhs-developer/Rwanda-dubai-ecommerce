<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = [
            // User management
            ['name' => 'View Users', 'slug' => 'view-users', 'description' => 'View all users'],
            ['name' => 'Create Users', 'slug' => 'create-users', 'description' => 'Create new users'],
            ['name' => 'Edit Users', 'slug' => 'edit-users', 'description' => 'Edit user information'],
            ['name' => 'Delete Users', 'slug' => 'delete-users', 'description' => 'Delete users'],
            
            // Role management
            ['name' => 'View Roles', 'slug' => 'view-roles', 'description' => 'View all roles'],
            ['name' => 'Create Roles', 'slug' => 'create-roles', 'description' => 'Create new roles'],
            ['name' => 'Edit Roles', 'slug' => 'edit-roles', 'description' => 'Edit role information'],
            ['name' => 'Delete Roles', 'slug' => 'delete-roles', 'description' => 'Delete roles'],
            
            // Content management
            ['name' => 'View Content', 'slug' => 'view-content', 'description' => 'View all content'],
            ['name' => 'Create Content', 'slug' => 'create-content', 'description' => 'Create new content'],
            ['name' => 'Edit Content', 'slug' => 'edit-content', 'description' => 'Edit content'],
            ['name' => 'Delete Content', 'slug' => 'delete-content', 'description' => 'Delete content'],
            ['name' => 'Publish Content', 'slug' => 'publish-content', 'description' => 'Publish content'],
            
            // System management
            ['name' => 'View Settings', 'slug' => 'view-settings', 'description' => 'View system settings'],
            ['name' => 'Edit Settings', 'slug' => 'edit-settings', 'description' => 'Edit system settings'],
            ['name' => 'View Reports', 'slug' => 'view-reports', 'description' => 'View system reports'],
            ['name' => 'System Backup', 'slug' => 'system-backup', 'description' => 'Perform system backup'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['slug' => $permission['slug']], $permission);
        }

        // Create roles
        $superAdminRole = Role::firstOrCreate(
            ['slug' => 'super-admin'],
            [
                'name' => 'Super Admin',
                'description' => 'Full system access with all permissions'
            ]
        );

        $adminRole = Role::firstOrCreate(
            ['slug' => 'admin'],
            [
                'name' => 'Admin',
                'description' => 'Administrative access with most permissions'
            ]
        );

        $editorRole = Role::firstOrCreate(
            ['slug' => 'editor'],
            [
                'name' => 'Editor',
                'description' => 'Content management and editing permissions'
            ]
        );

        $userRole = Role::firstOrCreate(
            ['slug' => 'user'],
            [
                'name' => 'User',
                'description' => 'Basic user permissions'
            ]
        );

        // Assign permissions to roles
        
        // Super Admin gets all permissions
        $allPermissions = Permission::all();
        $superAdminRole->permissions()->sync($allPermissions->pluck('id'));

        // Admin gets most permissions (excluding system backup)
        $adminPermissions = Permission::whereNotIn('slug', ['system-backup'])->get();
        $adminRole->permissions()->sync($adminPermissions->pluck('id'));

        // Editor gets content-related permissions
        $editorPermissions = Permission::whereIn('slug', [
            'view-content',
            'create-content',
            'edit-content',
            'delete-content',
            'publish-content',
            'view-users'
        ])->get();
        $editorRole->permissions()->sync($editorPermissions->pluck('id'));

        // User gets basic view permissions
        $userPermissions = Permission::whereIn('slug', [
            'view-content'
        ])->get();
        $userRole->permissions()->sync($userPermissions->pluck('id'));

        // Create default users
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@test.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password123'),
                'status' => 'active',
            ]
        );
        $superAdmin->assignRole('super-admin');

        $admin = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password123'),
                'status' => 'active',
            ]
        );
        $admin->assignRole('admin');

        $editor = User::firstOrCreate(
            ['email' => 'editor@test.com'],
            [
                'name' => 'Editor User',
                'password' => Hash::make('password123'),
                'status' => 'active',
            ]
        );
        $editor->assignRole('editor');

        $user = User::firstOrCreate(
            ['email' => 'user@test.com'],
            [
                'name' => 'Regular User',
                'password' => Hash::make('password123'),
                'status' => 'active',
            ]
        );
        $user->assignRole('user');
    }
}


