<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    /**
     * Get customer dashboard data
     */
    public function getDashboardData()
    {
        try {
            $user = Auth::user();
            
            // Get customer statistics
            $stats = $this->getCustomerStats();
            
            // Get recent orders
            $recentOrders = $this->getRecentOrders(5);
            
            // Get notifications
            $notifications = $this->getNotifications();
            
            // Get quick actions
            $quickActions = $this->getQuickActions();
            
            return response()->json([
                'success' => true,
                'message' => 'Dashboard data retrieved successfully',
                'data' => [
                    'stats' => $stats,
                    'recent_orders' => $recentOrders,
                    'notifications' => $notifications,
                    'quick_actions' => $quickActions
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve dashboard data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get customer statistics
     */
    public function getCustomerStats()
    {
        try {
            $user = Auth::user();
            
            $totalOrders = Order::where('user_id', $user->id)->count();
            $totalSpent = Order::where('user_id', $user->id)
                ->where('is_paid', true)
                ->sum('total_amount');
            $pendingOrders = Order::where('user_id', $user->id)
                ->whereIn('status', ['pending', 'processing'])
                ->count();
            $deliveredOrders = Order::where('user_id', $user->id)
                ->where('status', 'delivered')
                ->count();
            
            // Get wishlist items count (if wishlist table exists)
            $wishlistItems = 0;
            if (DB::getSchemaBuilder()->hasTable('wishlist_items')) {
                $wishlistItems = DB::table('wishlist_items')
                    ->where('user_id', $user->id)
                    ->count();
            }
            
            $lastOrder = Order::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->first();
            
            return [
                'total_orders' => $totalOrders,
                'total_spent' => (float) $totalSpent,
                'pending_orders' => $pendingOrders,
                'delivered_orders' => $deliveredOrders,
                'wishlist_items' => $wishlistItems,
                'account_status' => $user->status ?? 'active',
                'last_order_date' => $lastOrder ? $lastOrder->created_at->toISOString() : null,
                'member_since' => $user->created_at->toISOString()
            ];
        } catch (\Exception $e) {
            return [
                'total_orders' => 0,
                'total_spent' => 0.0,
                'pending_orders' => 0,
                'delivered_orders' => 0,
                'wishlist_items' => 0,
                'account_status' => 'active',
                'last_order_date' => null,
                'member_since' => now()->toISOString()
            ];
        }
    }

    /**
     * Get recent orders
     */
    public function getRecentOrders($limit = 5)
    {
        try {
            $user = Auth::user();
            
            $orders = Order::where('user_id', $user->id)
                ->with(['items' => function($query) {
                    $query->with('product');
                }])
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get();
            
            return $orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'total_amount' => (float) $order->total_amount,
                    'currency' => $order->currency ?? 'USD',
                    'created_at' => $order->created_at->toISOString(),
                    'items_count' => $order->items->count(),
                    'tracking_number' => $order->tracking_number,
                    'items' => $order->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'product_id' => $item->product_id,
                            'product_name' => $item->product_name,
                            'quantity' => $item->quantity,
                            'unit_price' => (float) $item->unit_price,
                            'total_price' => (float) $item->total_price,
                            'product' => $item->product ? [
                                'id' => $item->product->id,
                                'name' => $item->product->name,
                                'slug' => $item->product->slug ?? null,
                                'primary_image' => $item->product->primary_image ?? null,
                            ] : null,
                        ];
                    })
                ];
            });
        } catch (\Exception $e) {
            return [];
        }
    }

    /**
     * Get customer notifications
     */
    public function getNotifications()
    {
        try {
            $user = Auth::user();
            
            // For now, return mock notifications
            // In a real application, you would have a notifications table
            $notifications = [
                [
                    'id' => 1,
                    'type' => 'order_update',
                    'title' => 'Order Status Update',
                    'message' => 'Your order #ORD-001 has been shipped and is on its way.',
                    'is_read' => false,
                    'created_at' => now()->subHours(2)->toISOString(),
                    'action_url' => '/orders/1'
                ],
                [
                    'id' => 2,
                    'type' => 'promotion',
                    'title' => 'Special Offer',
                    'message' => 'Get 20% off on your next order. Use code SAVE20.',
                    'is_read' => false,
                    'created_at' => now()->subDays(1)->toISOString(),
                    'action_url' => '/products'
                ],
                [
                    'id' => 3,
                    'type' => 'security',
                    'title' => 'Account Security',
                    'message' => 'Your password was changed successfully.',
                    'is_read' => true,
                    'created_at' => now()->subDays(3)->toISOString()
                ]
            ];
            
            return $notifications;
        } catch (\Exception $e) {
            return [];
        }
    }

    /**
     * Get quick actions
     */
    public function getQuickActions()
    {
        return [
            [
                'id' => 'view_orders',
                'title' => 'View Orders',
                'description' => 'Check your order history and status',
                'icon' => 'shopping-bag',
                'action' => 'navigate',
                'color' => 'blue'
            ],
            [
                'id' => 'manage_addresses',
                'title' => 'Manage Addresses',
                'description' => 'Update your shipping addresses',
                'icon' => 'map-pin',
                'action' => 'navigate',
                'color' => 'green'
            ],
            [
                'id' => 'profile_settings',
                'title' => 'Profile Settings',
                'description' => 'Update your personal information',
                'icon' => 'user',
                'action' => 'navigate',
                'color' => 'purple'
            ],
            [
                'id' => 'account_security',
                'title' => 'Account Security',
                'description' => 'Change password and security settings',
                'icon' => 'shield',
                'action' => 'navigate',
                'color' => 'red'
            ]
        ];
    }

    /**
     * Get user orders with filtering
     */
    public function getUserOrders(Request $request)
    {
        try {
            $user = Auth::user();
            
            $query = Order::where('user_id', $user->id)
                ->with(['items' => function($query) {
                    $query->with('product');
                }]);
            
            // Apply filters
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }
            
            if ($request->has('search') && $request->search) {
                $query->where(function($q) use ($request) {
                    $q->where('order_number', 'like', '%' . $request->search . '%')
                      ->orWhere('customer_name', 'like', '%' . $request->search . '%');
                });
            }
            
            $perPage = $request->get('per_page', 15);
            $orders = $query->orderBy('created_at', 'desc')->paginate($perPage);
            
            $formattedOrders = $orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'total_amount' => (float) $order->total_amount,
                    'currency' => $order->currency ?? 'USD',
                    'created_at' => $order->created_at->toISOString(),
                    'items_count' => $order->items->count(),
                    'tracking_number' => $order->tracking_number,
                    'items' => $order->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'product_id' => $item->product_id,
                            'product_name' => $item->product_name,
                            'quantity' => $item->quantity,
                            'unit_price' => (float) $item->unit_price,
                            'total_price' => (float) $item->total_price,
                            'product' => $item->product ? [
                                'id' => $item->product->id,
                                'name' => $item->product->name,
                                'slug' => $item->product->slug ?? null,
                                'primary_image' => $item->product->primary_image ?? null,
                            ] : null,
                        ];
                    })
                ];
            });
            
            return response()->json([
                'success' => true,
                'message' => 'Orders retrieved successfully',
                'data' => [
                    'data' => $formattedOrders->toArray(),
                    'meta' => [
                        'total' => $orders->total(),
                        'per_page' => $orders->perPage(),
                        'current_page' => $orders->currentPage(),
                        'last_page' => $orders->lastPage()
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve orders: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single order details
     */
    public function getOrderDetails($id)
    {
        try {
            $user = Auth::user();
            
            $order = Order::where('user_id', $user->id)
                ->where('id', $id)
                ->with(['items.product', 'items.product.brand'])
                ->first();
            
            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found'
                ], 404);
            }
            
            $orderData = [
                'order' => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'total_amount' => (float) $order->total_amount,
                    'currency' => $order->currency ?? 'USD',
                    'created_at' => $order->created_at->toISOString(),
                    'items_count' => $order->items->count(),
                    'tracking_number' => $order->tracking_number
                ],
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product->name ?? 'Unknown Product',
                        'product_image' => $item->product->image ?? null,
                        'quantity' => $item->quantity,
                        'unit_price' => (float) $item->unit_price,
                        'total_price' => (float) $item->total_price,
                        'brand_name' => $item->product->brand->name ?? null
                    ];
                }),
                'shipping_address' => [
                    'name' => $order->customer_name,
                    'street' => $order->shipping_address,
                    'phone' => $order->customer_phone ?? '',
                    'email' => $order->customer_email
                ],
                'payment_info' => [
                    'method' => $order->payment_method ?? 'Unknown',
                    'reference' => $order->payment_reference,
                    'paid_at' => $order->paid_at ? $order->paid_at->toISOString() : null
                ]
            ];
            
            return response()->json([
                'success' => true,
                'message' => 'Order details retrieved successfully',
                'data' => $orderData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve order details: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        try {
            $user = Auth::user();
            
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'phone' => 'sometimes|nullable|string|max:20',
                'avatar' => 'sometimes|nullable|url|max:500'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $updateData = $request->only(['name', 'phone', 'avatar']);
            $user->update($updateData);
            
            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'avatar' => $user->avatar,
                    'status' => $user->status,
                    'last_login_at' => $user->last_login_at,
                    'created_at' => $user->created_at->toISOString(),
                    'updated_at' => $user->updated_at->toISOString()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Change password
     */
    public function changePassword(Request $request)
    {
        try {
            $user = Auth::user();
            
            $validator = Validator::make($request->all(), [
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8|confirmed',
                'new_password_confirmation' => 'required|string|min:8'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // Check current password
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ], 400);
            }
            
            // Update password
            $user->update([
                'password' => Hash::make($request->new_password)
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Password changed successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to change password: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get real-time updates
     */
    public function getRealTimeUpdates()
    {
        try {
            $user = Auth::user();
            
            $stats = $this->getCustomerStats();
            $newNotifications = $this->getNotifications();
            
            // Get recent order updates
            $orderUpdates = Order::where('user_id', $user->id)
                ->where('updated_at', '>', now()->subMinutes(5))
                ->get(['id', 'status', 'updated_at'])
                ->map(function ($order) {
                    return [
                        'order_id' => $order->id,
                        'status' => $order->status,
                        'updated_at' => $order->updated_at->toISOString()
                    ];
                });
            
            return response()->json([
                'success' => true,
                'message' => 'Real-time updates retrieved successfully',
                'data' => [
                    'stats' => $stats,
                    'new_notifications' => $newNotifications,
                    'order_updates' => $orderUpdates
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve real-time updates: ' . $e->getMessage()
            ], 500);
        }
    }
}

