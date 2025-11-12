<?php

namespace App\GraphQL\Queries;

use App\Models\Invoice;

class AdminInvoices
{
    public function __invoke($_, array $args)
    {
        $query = Invoice::query();

        if (!empty($args['orderId'])) {
            $query->where('order_id', $args['orderId']);
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
