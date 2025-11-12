<?php

namespace App\GraphQL\Queries;

class Me
{
    /**
     * Get the currently authenticated user
     */
    public function __invoke($_, array $args, $context)
    {
        return $context->user();
    }
}
