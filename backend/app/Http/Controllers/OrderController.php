<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class OrderController extends Controller
{
    /**
     * Display a listing of orders
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Order::with(['user:id,name,email', 'items.product:id,name,slug'])
                ->orderBy('created_at', 'desc');

            // Apply filters
            if ($request->has('status')) {
                $query->byStatus($request->status);
            }

            if ($request->has('is_paid')) {
                $query->where('is_paid', $request->boolean('is_paid'));
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('order_number', 'like', "%{$search}%")
                      ->orWhere('customer_name', 'like', "%{$search}%")
                      ->orWhere('customer_email', 'like', "%{$search}%");
                });
            }

            // Pagination
            $perPage = min($request->get('per_page', 15), 50);
            $orders = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Orders retrieved successfully',
                'data' => $orders->items(),
                'pagination' => [
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                    'per_page' => $orders->perPage(),
                    'total' => $orders->total(),
                    'from' => $orders->firstItem(),
                    'to' => $orders->lastItem(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified order
     */
    public function show(string $id): JsonResponse
    {
        try {
            $order = Order::with(['user:id,name,email', 'items.product:id,name,slug,primary_image'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Order retrieved successfully',
                'data' => $order
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        try {
            $order = Order::findOrFail($id);

            $request->validate([
                'status' => 'required|in:pending,processing,shipped,delivered,cancelled,refunded',
            ]);

            $oldStatus = $order->status;
            $order->update([
                'status' => $request->status,
                'shipped_at' => $request->status === 'shipped' ? now() : $order->shipped_at,
                'delivered_at' => $request->status === 'delivered' ? now() : $order->delivered_at,
            ]);

            return response()->json([
                'success' => true,
                'message' => "Order status updated from {$oldStatus} to {$request->status}",
                'data' => $order->fresh(['user:id,name,email', 'items.product:id,name,slug'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update payment status
     */
    public function updatePaymentStatus(Request $request, string $id): JsonResponse
    {
        try {
            $order = Order::findOrFail($id);

            $request->validate([
                'is_paid' => 'required|boolean',
                'payment_method' => 'nullable|string|max:255',
                'payment_reference' => 'nullable|string|max:255',
            ]);

            $order->update([
                'is_paid' => $request->is_paid,
                'payment_method' => $request->payment_method,
                'payment_reference' => $request->payment_reference,
                'paid_at' => $request->is_paid ? now() : null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment status updated successfully',
                'data' => $order->fresh(['user:id,name,email', 'items.product:id,name,slug'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update payment status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update order
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $order = Order::findOrFail($id);

            $request->validate([
                'status' => 'sometimes|in:pending,processing,shipped,delivered,cancelled,refunded',
                'is_paid' => 'sometimes|boolean',
                'payment_method' => 'nullable|string|max:255',
                'payment_reference' => 'nullable|string|max:255',
                'notes' => 'nullable|string',
            ]);

            $updateData = $request->only([
                'status', 'is_paid', 'payment_method', 'payment_reference', 'notes'
            ]);

            // Set timestamps based on status changes
            if ($request->has('status')) {
                $updateData['shipped_at'] = $request->status === 'shipped' ? now() : $order->shipped_at;
                $updateData['delivered_at'] = $request->status === 'delivered' ? now() : $order->delivered_at;
            }

            if ($request->has('is_paid') && $request->is_paid) {
                $updateData['paid_at'] = now();
            }

            $order->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Order updated successfully',
                'data' => $order->fresh(['user:id,name,email', 'items.product:id,name,slug'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created order
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validate the request
            $validated = $request->validate([
                'customer_name' => 'required|string|max:255',
                'customer_email' => 'required|email|max:255',
                'customer_phone' => 'nullable|string|max:20',
                'shipping_address' => 'required|string|max:500',
                'billing_address' => 'nullable|string|max:500',
                'subtotal' => 'required|numeric|min:0',
                'tax_amount' => 'required|numeric|min:0',
                'shipping_amount' => 'required|numeric|min:0',
                'discount_amount' => 'nullable|numeric|min:0',
                'total_amount' => 'required|numeric|min:0',
                'currency' => 'required|string|max:3',
                'payment_method' => 'required|string|max:50',
                'payment_reference' => 'nullable|string|max:255',
                'notes' => 'nullable|string|max:1000',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|integer|exists:products,id',
                'items.*.product_name' => 'required|string|max:255',
                'items.*.product_sku' => 'nullable|string|max:100',
                'items.*.unit_price' => 'required|numeric|min:0',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.total_price' => 'required|numeric|min:0',
            ]);

            DB::beginTransaction();

            // Generate order number
            $orderNumber = 'ORD-' . str_pad(Order::count() + 1, 6, '0', STR_PAD_LEFT);

            // Resolve user: if authenticated use auth id; otherwise link or create a guest user by email
            $resolvedUserId = auth()->id();
            if (!$resolvedUserId) {
                $existing = User::where('email', $validated['customer_email'])->first();
                if ($existing) {
                    $resolvedUserId = $existing->id;
                } else {
                    // Create a minimal guest user to satisfy non-nullable foreign key
                    $guestUser = User::create([
                        'name' => $validated['customer_name'],
                        'email' => $validated['customer_email'],
                        'password' => bin2hex(random_bytes(16)),
                        'status' => 'active',
                        'phone' => $validated['customer_phone'] ?? null,
                    ]);
                    $resolvedUserId = $guestUser->id;
                }
            }

            // Create the order
            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $resolvedUserId,
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'] ?? null,
                'shipping_address' => $validated['shipping_address'],
                'billing_address' => $validated['billing_address'] ?? null,
                'subtotal' => $validated['subtotal'],
                'tax_amount' => $validated['tax_amount'],
                'shipping_amount' => $validated['shipping_amount'],
                'discount_amount' => $validated['discount_amount'] ?? 0,
                'total_amount' => $validated['total_amount'],
                'currency' => $validated['currency'],
                'status' => 'pending',
                'is_paid' => false,
                'payment_method' => $validated['payment_method'],
                'payment_reference' => $validated['payment_reference'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

            // Create order items
            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'product_name' => $item['product_name'],
                    'product_sku' => $item['product_sku'] ?? null,
                    'unit_price' => $item['unit_price'],
                    'quantity' => $item['quantity'],
                    'total_price' => $item['total_price'],
                ]);
            }

            DB::commit();

            // Load the order with relationships
            $order->load(['user:id,name,email', 'items.product:id,name,slug']);

            // For guest checkout, clear session-based cart items
            if (!auth()->check()) {
                try {
                    // Prefer explicit X-Session-Id header or query param if provided
                    $explicitSessionId = $request->header('X-Session-Id') ?: $request->query('session_id');
                    $sessionId = $explicitSessionId ?: ($request->hasSession() ? $request->session()->getId() : null);
                    if ($sessionId) {
                    CartItem::where('session_id', $sessionId)->delete();
                    }
                } catch (\Throwable $t) {
                    // Non-fatal: order succeeded; log or ignore cleanup errors
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'data' => $order
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get order statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_orders' => Order::count(),
                'pending_orders' => Order::byStatus('pending')->count(),
                'processing_orders' => Order::byStatus('processing')->count(),
                'shipped_orders' => Order::byStatus('shipped')->count(),
                'delivered_orders' => Order::byStatus('delivered')->count(),
                'paid_orders' => Order::paid()->count(),
                'unpaid_orders' => Order::unpaid()->count(),
                'total_revenue' => Order::paid()->sum('total_amount'),
                'recent_orders' => Order::with(['user:id,name,email'])
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get(['id', 'order_number', 'customer_name', 'total_amount', 'status', 'is_paid', 'created_at']),
            ];

            return response()->json([
                'success' => true,
                'message' => 'Order statistics retrieved successfully',
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve order statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
