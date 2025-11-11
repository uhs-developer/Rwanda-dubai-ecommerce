<?php

namespace App\GraphQL\Mutations;

use App\Models\User;

class DeleteCustomer
{
    public function __invoke($_, array $args)
    {
        $customer = User::findOrFail($args['id']);
        
        // Prevent deleting superadmin/admin users
        if ($customer->hasRole(['superadmin', 'admin'])) {
            throw new \Exception('Cannot delete admin users');
        }
        
        $customer->delete();
        return true;
    }
}

