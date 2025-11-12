<?php

namespace App\GraphQL\Queries;

use App\Models\Invoice;
use Illuminate\Database\Eloquent\Builder;

class AdminInvoices
{
    public function __invoke($_, array $args)
    {
        $query = Invoice::query()->with(['order']);

        // Search by invoice number
        if (!empty($args['q'])) {
            $q = trim($args['q']);
            $query->where('invoice_number', 'like', '%'.$q.'%');
        }

        // Filter by order ID
        if (!empty($args['orderId'])) {
            $query->where('order_id', $args['orderId']);
        }

        // Filter by status
        if (!empty($args['status'])) {
            $query->where('status', $args['status']);
        }

        // Filter by currency
        if (!empty($args['currency'])) {
            $query->where('currency', $args['currency']);
        }

        // Filter by totals
        if (isset($args['minTotal'])) {
            $query->where('grand_total', '>=', (float)$args['minTotal']);
        }
        if (isset($args['maxTotal'])) {
            $query->where('grand_total', '<=', (float)$args['maxTotal']);
        }

        // Filter by date range
        if (!empty($args['dateFrom'])) {
            $query->where('created_at', '>=', $args['dateFrom']);
        }
        if (!empty($args['dateTo'])) {
            $query->where('created_at', '<=', $args['dateTo']);
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
