<?php

namespace App\GraphQL\Mutations;

use App\Models\Order;

class UpdateOrderStatus
{
    public function __invoke($_, array $args)
    {
        $order = Order::findOrFail($args['id']);
        $order->update(['status' => $args['status']]);
        
        return $order->load(['user', 'items']);
    }
}

