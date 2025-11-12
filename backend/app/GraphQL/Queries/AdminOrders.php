<?php

namespace App\GraphQL\Queries;

use App\Models\Order;
use Illuminate\Database\Eloquent\Builder;

class AdminOrders
{
    public function __invoke($_, array $args)
    {
        $query = Order::query()->with(['user', 'items']);

        // Search by order number
        if (!empty($args['q'])) {
            $q = trim($args['q']);
            $query->where(function (Builder $qb) use ($q) {
                $qb->where('order_number', 'like', '%'.$q.'%');
            });
        }

        // Filter by status
        if (!empty($args['status'])) {
            $query->where('status', $args['status']);
        }

        // Filter by payment status
        if (!empty($args['paymentStatus'])) {
            $query->where('payment_status', $args['paymentStatus']);
        }

        // Filter by payment method
        if (!empty($args['paymentMethod'])) {
            $query->where('payment_method', $args['paymentMethod']);
        }

        // Filter by shipping method
        if (!empty($args['shippingMethod'])) {
            $query->where('shipping_method', $args['shippingMethod']);
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

        // Filter by customer
        if (!empty($args['customerEmail'])) {
            $email = trim($args['customerEmail']);
            $query->whereHas('user', function (Builder $qb) use ($email) {
                $qb->where('email', 'like', '%'.$email.'%');
            });
        }
        if (!empty($args['customerName'])) {
            $name = trim($args['customerName']);
            $query->whereHas('user', function (Builder $qb) use ($name) {
                $qb->where('name', 'like', '%'.$name.'%');
            });
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

