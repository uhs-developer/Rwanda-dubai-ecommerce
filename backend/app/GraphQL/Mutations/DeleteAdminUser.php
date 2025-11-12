<?php

namespace App\GraphQL\Mutations;

use App\Models\User;

class DeleteAdminUser
{
    public function __invoke($_, array $args)
    {
        $user = User::findOrFail($args['id']);
        
        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            throw new \Exception('Cannot delete your own account');
        }
        
        // Prevent deleting the primary superadmin
        if ($user->id === 1 && $user->hasRole('superadmin')) {
            throw new \Exception('Cannot delete primary superadmin account');
        }
        
        $user->delete();
        return true;
    }
}

