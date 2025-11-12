@extends('admin.layouts.app')

@section('title', 'Dashboard')
@section('page-title', 'Dashboard')

@section('content')
<div class="space-y-6">
    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Sales -->
        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-600">Total Sales (Today)</p>
                    <p class="text-2xl font-bold text-gray-900">${{ number_format($todaySales ?? 0, 2) }}</p>
                    <p class="text-sm text-green-600 mt-1">+12% from yesterday</p>
                </div>
                <div class="p-3 bg-blue-100 rounded-full">
                    <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Total Orders -->
        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-600">Total Orders</p>
                    <p class="text-2xl font-bold text-gray-900">{{ $totalOrders ?? 0 }}</p>
                    <p class="text-sm text-green-600 mt-1">+8% from last week</p>
                </div>
                <div class="p-3 bg-green-100 rounded-full">
                    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Average Order Value -->
        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-600">Average Order Value</p>
                    <p class="text-2xl font-bold text-gray-900">${{ number_format($avgOrderValue ?? 0, 2) }}</p>
                    <p class="text-sm text-red-600 mt-1">-3% from last month</p>
                </div>
                <div class="p-3 bg-yellow-100 rounded-full">
                    <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Total Customers -->
        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-600">Total Customers</p>
                    <p class="text-2xl font-bold text-gray-900">{{ $totalCustomers ?? 0 }}</p>
                    <p class="text-sm text-green-600 mt-1">+15% from last month</p>
                </div>
                <div class="p-3 bg-purple-100 rounded-full">
                    <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                </div>
            </div>
        </div>
    </div>

    <!-- Recent Orders & Top Products -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Orders -->
        <div class="bg-white rounded-lg shadow">
            <div class="p-6 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Recent Orders</h3>
            </div>
            <div class="p-6">
                <div class="space-y-4">
                    @forelse($recentOrders ?? [] as $order)
                    <div class="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <div>
                            <p class="font-medium text-gray-900">#{{ $order->number ?? 'N/A' }}</p>
                            <p class="text-sm text-gray-600">{{ $order->customer_name ?? 'Guest' }}</p>
                        </div>
                        <div class="text-right">
                            <p class="font-medium text-gray-900">${{ number_format($order->total ?? 0, 2) }}</p>
                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full
                                @if(($order->status ?? '') === 'completed') bg-green-100 text-green-800
                                @elseif(($order->status ?? '') === 'processing') bg-blue-100 text-blue-800
                                @else bg-gray-100 text-gray-800
                                @endif">
                                {{ ucfirst($order->status ?? 'pending') }}
                            </span>
                        </div>
                    </div>
                    @empty
                    <p class="text-center text-gray-500 py-8">No recent orders</p>
                    @endforelse
                </div>
                <div class="mt-4">
                    <a href="{{ route('admin.orders.index') }}" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View all orders →
                    </a>
                </div>
            </div>
        </div>

        <!-- Top Products -->
        <div class="bg-white rounded-lg shadow">
            <div class="p-6 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Top Selling Products</h3>
            </div>
            <div class="p-6">
                <div class="space-y-4">
                    @forelse($topProducts ?? [] as $product)
                    <div class="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-gray-200 rounded flex-shrink-0"></div>
                            <div>
                                <p class="font-medium text-gray-900">{{ $product->name ?? 'Product' }}</p>
                                <p class="text-sm text-gray-600">SKU: {{ $product->sku ?? 'N/A' }}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-medium text-gray-900">{{ $product->total_sales ?? 0 }} sold</p>
                            <p class="text-sm text-gray-600">${{ number_format($product->price ?? 0, 2) }}</p>
                        </div>
                    </div>
                    @empty
                    <p class="text-center text-gray-500 py-8">No sales data available</p>
                    @endforelse
                </div>
                <div class="mt-4">
                    <a href="{{ route('admin.products.index') }}" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View all products →
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
