<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class Register
{
    /**
     * Register a new customer user
     */
    public function __invoke($_, array $args)
    {
        $tenant = app('tenant');

        // Validate email uniqueness within tenant
        $existingUser = User::where('email', $args['email'])
            ->where('tenant_id', $tenant->id)
            ->first();

        if ($existingUser) {
            throw ValidationException::withMessages([
                'email' => ['The email has already been taken.'],
            ]);
        }

        // Create customer user
        $user = User::create([
            'tenant_id' => $tenant->id,
            'name' => $args['name'],
            'email' => $args['email'],
            'password' => Hash::make($args['password']),
            'status' => 'active',
        ]);

        // Create Sanctum token
        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'token' => $token,
            'user' => $user,
        ];
    }
}
