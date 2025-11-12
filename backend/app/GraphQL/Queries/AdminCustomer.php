<?php

namespace App\GraphQL\Queries;

use App\Models\User;

class AdminCustomer
{
    public function __invoke($_, array $args)
    {
        return User::with('roles')->findOrFail($args['id']);
    }
}

