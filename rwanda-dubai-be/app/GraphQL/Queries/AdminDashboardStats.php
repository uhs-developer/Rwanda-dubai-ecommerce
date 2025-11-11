<?php

namespace App\GraphQL\Queries;

use App\Models\Order;
use App\Models\User;
use App\Models\Product;

class AdminDashboardStats
{
    public function __invoke($_, array $args)
    {
        $totalRevenue = Order::where('payment_status', 'paid')->sum('grand_total');
        $totalOrders = Order::count();
        $totalCustomers = User::whereHas('roles', function($q) {
            $q->where('name', 'user');
        })->count();
        $totalProducts = Product::count();
        
        $recentOrders = Order::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return [
            'totalRevenue' => (float) $totalRevenue,
            'totalOrders' => $totalOrders,
            'totalCustomers' => $totalCustomers,
            'totalProducts' => $totalProducts,
            'recentOrders' => $recentOrders,
        ];
    }
}

