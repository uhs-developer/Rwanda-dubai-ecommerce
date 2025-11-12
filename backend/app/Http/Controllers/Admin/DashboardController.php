<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $tenant = app('tenant');

        // Calculate KPIs (placeholder data for now)
        $todaySales = 0; // TODO: Calculate from orders
        $totalOrders = 0; // TODO: Get from orders table
        $avgOrderValue = 0; // TODO: Calculate average
        $totalCustomers = User::where('tenant_id', $tenant->id)->count();

        // Recent orders (placeholder)
        $recentOrders = collect([]);

        // Top products
        $topProducts = Product::where('tenant_id', $tenant->id)
            ->orderBy('total_sales', 'desc')
            ->take(5)
            ->get();

        return view('admin.dashboard.index', compact(
            'todaySales',
            'totalOrders',
            'avgOrderValue',
            'totalCustomers',
            'recentOrders',
            'topProducts'
        ));
    }
}
