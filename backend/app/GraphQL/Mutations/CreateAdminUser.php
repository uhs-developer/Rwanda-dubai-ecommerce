<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser
{
    public function __invoke($_, array $args)
    {
        $input = $args['input'];

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
            'status' => 'active',
        ]);

        // Assign roles
        if (!empty($input['roleIds'])) {
            $user->syncRoles($input['roleIds']);
        }

        return $user->load('roles');
    }
}

