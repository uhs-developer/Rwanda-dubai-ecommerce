<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $tenant = app('tenant');

        $query = Order::where('tenant_id', $tenant->id)
            ->with(['user', 'items.product']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $orders = $query->latest()->paginate(20);

        return view('admin.orders.index', compact('orders'));
    }

    public function show(Order $order)
    {
        $tenant = app('tenant');

        // Ensure order belongs to tenant
        if ($order->tenant_id != $tenant->id) {
            abort(404);
        }

        $order->load(['user', 'items.product', 'shippingAddress', 'billingAddress', 'invoices', 'shipments', 'creditMemos']);

        return view('admin.orders.show', compact('order'));
    }

    public function updateStatus(Request $request, Order $order)
    {
        $tenant = app('tenant');

        // Ensure order belongs to tenant
        if ($order->tenant_id != $tenant->id) {
            abort(404);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,processing,on_hold,completed,cancelled,refunded,failed',
        ]);

        $order->update($validated);

        return back()->with('success', 'Order status updated successfully.');
    }
}
