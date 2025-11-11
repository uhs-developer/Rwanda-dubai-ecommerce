<?php

namespace App\GraphQL\Mutations;

class Logout
{
    /**
     * Logout the authenticated user
     */
    public function __invoke($_, array $args, $context)
    {
        $user = $context->user();

        if ($user) {
            // Delete all tokens for this user
            $user->tokens()->delete();
            return true;
        }

        return false;
    }
}
