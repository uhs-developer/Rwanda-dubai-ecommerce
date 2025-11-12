<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateCustomer
{
    public function __invoke($_, array $args)
    {
        $input = $args['input'];

        $customer = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
            'phone' => $input['phone'] ?? null,
            'status' => 'active',
        ]);

        // Assign default 'user' role
        $customer->assignRole('user');

        return $customer->load('roles');
    }
}

