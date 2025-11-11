<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UpdateAdminUser
{
    public function __invoke($_, array $args)
    {
        $user = User::findOrFail($args['id']);
        $input = $args['input'];

        $updateData = array_filter([
            'name' => $input['name'] ?? null,
            'email' => $input['email'] ?? null,
            'status' => $input['status'] ?? null,
        ], fn($value) => $value !== null);

        if (!empty($input['password'])) {
            $updateData['password'] = Hash::make($input['password']);
        }

        $user->update($updateData);

        // Update roles
        if (isset($input['roleIds'])) {
            $user->syncRoles($input['roleIds']);
        }

        return $user->load('roles');
    }
}

