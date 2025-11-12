<?php

namespace App\GraphQL\Queries;

use Spatie\Permission\Models\Role;

class AdminRoles
{
    public function __invoke($_, array $args)
    {
        return Role::with('permissions')->get();
    }
}

