<?php

namespace App\GraphQL\Queries;

use App\Models\Order;

class AdminOrder
{
    public function __invoke($_, array $args)
    {
        return Order::with(['user', 'items', 'billingAddress', 'shippingAddress'])
            ->findOrFail($args['id']);
    }
}

