<?php

namespace App\GraphQL\Mutations;

use App\Models\Order;

class CancelOrder
{
    public function __invoke($_, array $args)
    {
        $order = Order::findOrFail($args['id']);
        
        $order->update([
            'status' => 'cancelled',
            'cancel_reason' => $args['reason'] ?? null,
        ]);
        
        return $order->load(['user', 'items']);
    }
}

