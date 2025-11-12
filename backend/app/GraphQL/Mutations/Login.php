<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class Login
{
    /**
     * Login a customer user
     */
    public function __invoke($_, array $args)
    {
        $tenant = app('tenant');

        $user = User::where('email', $args['email'])
            ->where('tenant_id', $tenant->id)
            ->first();

        if (!$user || !Hash::check($args['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->status !== 'active') {
            throw ValidationException::withMessages([
                'email' => ['Your account is not active.'],
            ]);
        }

        // Update last login
        $user->update(['last_login_at' => now()]);

        // Create Sanctum token
        $token = $user->createToken('auth-token')->plainTextToken;

        // Log the login event
        AuditLog::logEvent('customer_login', $user, null, null, "Customer {$user->email} logged in");

        return [
            'token' => $token,
            'user' => $user,
        ];
    }
}
