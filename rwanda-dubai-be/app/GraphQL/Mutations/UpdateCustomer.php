<?php

namespace App\GraphQL\Mutations;

use App\Models\User;

class UpdateCustomer
{
    public function __invoke($_, array $args)
    {
        $customer = User::findOrFail($args['id']);
        $input = $args['input'];

        $updateData = array_filter([
            'name' => $input['name'] ?? null,
            'email' => $input['email'] ?? null,
            'phone' => $input['phone'] ?? null,
            'status' => $input['status'] ?? null,
        ], fn($value) => $value !== null);

        $customer->update($updateData);

        return $customer->load('roles');
    }
}

