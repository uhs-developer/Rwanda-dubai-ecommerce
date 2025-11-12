<?php

namespace App\GraphQL\Queries;

use App\Models\Order;

class AdminOrders
{
    public function __invoke($_, array $args)
    {
        $query = Order::query()->with(['user', 'items']);

        // Search
        if (!empty($args['q'])) {
            $query->where('order_number', 'like', '%' . $args['q'] . '%');
        }

        // Filter by status
        if (!empty($args['status'])) {
            $query->where('status', $args['status']);
        }

        // Filter by payment status
        if (!empty($args['paymentStatus'])) {
            $query->where('payment_status', $args['paymentStatus']);
        }

        $perPage = $args['perPage'] ?? 20;
        $page = $args['page'] ?? 1;

        $paginator = $query->orderBy('created_at', 'desc')->paginate($perPage, ['*'], 'page', $page);

        return [
            'data' => $paginator->items(),
            'paginatorInfo' => [
                'currentPage' => $paginator->currentPage(),
                'lastPage' => $paginator->lastPage(),
                'perPage' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ];
    }
}

