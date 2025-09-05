<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            // Get current month start and end dates
            $currentMonthStart = now()->startOfMonth();
            $currentMonthEnd = now()->endOfMonth();
            
            // Get last month for comparison
            $lastMonthStart = now()->subMonth()->startOfMonth();
            $lastMonthEnd = now()->subMonth()->endOfMonth();
            
            // Get today's date range
            $todayStart = now()->startOfDay();
            $todayEnd = now()->endOfDay();
            
            // Get this week's date range
            $thisWeekStart = now()->startOfWeek();
            $thisWeekEnd = now()->endOfWeek();

            // Pending orders (orders that need attention - pending, processing)
            $pendingOrders = Order::whereIn('status', ['pending', 'processing'])->count();
            
            // New orders today
            $newOrdersToday = Order::whereBetween('created_at', [$todayStart, $todayEnd])->count();
            
            // Total customers (excluding admin and super-admin)
            $totalCustomers = User::whereDoesntHave('roles', function ($q) {
                $q->whereIn('slug', ['admin', 'super-admin']);
            })->count();
            
            // Active customers (customers with status 'active')
            $activeCustomers = User::whereDoesntHave('roles', function ($q) {
                $q->whereIn('slug', ['admin', 'super-admin']);
            })->where('status', 'active')->count();
            
            $activeCustomersPercentage = $totalCustomers > 0 ? round(($activeCustomers / $totalCustomers) * 100, 1) : 0;
            
            // Products pending approval (inactive products)
            $productsPending = Product::where('is_active', false)->count();
            
            // New products this week
            $newProductsThisWeek = Product::whereBetween('created_at', [$thisWeekStart, $thisWeekEnd])->count();
            
            // Monthly revenue (current month)
            $monthlyRevenue = Order::where('is_paid', true)
                ->whereBetween('created_at', [$currentMonthStart, $currentMonthEnd])
                ->sum('total_amount');
            
            // Last month revenue for growth calculation
            $lastMonthRevenue = Order::where('is_paid', true)
                ->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
                ->sum('total_amount');
            
            // Calculate revenue growth percentage
            $revenueGrowthPercentage = 0;
            if ($lastMonthRevenue > 0) {
                $revenueGrowthPercentage = round((($monthlyRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1);
            } elseif ($monthlyRevenue > 0) {
                $revenueGrowthPercentage = 100; // 100% growth if no previous revenue
            }

            $statistics = [
                'pending_orders' => $pendingOrders,
                'total_customers' => $totalCustomers,
                'products_pending' => $productsPending,
                'monthly_revenue' => $monthlyRevenue,
                'new_orders_today' => $newOrdersToday,
                'active_customers_percentage' => $activeCustomersPercentage,
                'new_products_this_week' => $newProductsThisWeek,
                'revenue_growth_percentage' => $revenueGrowthPercentage,
            ];

            return response()->json([
                'success' => true,
                'message' => 'Dashboard statistics retrieved successfully',
                'data' => $statistics
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve dashboard statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get dashboard cards data
     */
    public function cards(): JsonResponse
    {
        try {
            $statistics = $this->statistics();
            $stats = $statistics->getData()->data;

            $cards = [
                [
                    'title' => 'Pending Orders',
                    'value' => $stats->pending_orders,
                    'subtitle' => 'Need attention',
                    'badge' => $stats->new_orders_today . ' new',
                    'icon' => 'FolderOpen'
                ],
                [
                    'title' => 'Total Customers',
                    'value' => $stats->total_customers,
                    'subtitle' => 'Active users',
                    'badge' => $stats->active_customers_percentage . '%',
                    'icon' => 'Users'
                ],
                [
                    'title' => 'Products Pending',
                    'value' => $stats->products_pending,
                    'subtitle' => 'Awaiting approval',
                    'badge' => $stats->new_products_this_week . ' new',
                    'icon' => 'Package'
                ],
                [
                    'title' => 'Monthly Revenue',
                    'value' => $stats->monthly_revenue,
                    'subtitle' => 'This month',
                    'badge' => $stats->revenue_growth_percentage . '%',
                    'icon' => 'BarChart3'
                ]
            ];

            return response()->json([
                'success' => true,
                'message' => 'Dashboard cards retrieved successfully',
                'data' => $cards
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve dashboard cards',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

