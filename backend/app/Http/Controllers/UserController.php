<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Display a listing of users (customers)
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = User::with(['roles:id,name,slug'])
                ->withCount(['orders as total_orders'])
                ->withSum('orders as total_spent', 'total_amount')
                ->whereDoesntHave('roles', function ($q) {
                    $q->whereIn('slug', ['admin', 'super-admin']);
                })
                ->orderBy('created_at', 'desc');

            // Apply filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%");
                });
            }

            // Pagination
            $perPage = min($request->get('per_page', 15), 50);
            $users = $query->paginate($perPage);

            // Transform users for response
            $transformedUsers = $users->through(function ($user) {
                return $this->transformUser($user);
            });

            return response()->json([
                'success' => true,
                'message' => 'Users retrieved successfully',
                'data' => $transformedUsers->items(),
                'pagination' => [
                    'current_page' => $transformedUsers->currentPage(),
                    'last_page' => $transformedUsers->lastPage(),
                    'per_page' => $transformedUsers->perPage(),
                    'total' => $transformedUsers->total(),
                    'from' => $transformedUsers->firstItem(),
                    'to' => $transformedUsers->lastItem(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve users',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified user
     */
    public function show(string $id): JsonResponse
    {
        try {
            $user = User::with(['roles:id,name,slug', 'orders' => function ($query) {
                $query->orderBy('created_at', 'desc')->limit(10);
            }])
                ->withCount(['orders as total_orders'])
                ->withSum('orders as total_spent', 'total_amount')
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'User retrieved successfully',
                'data' => $this->transformUser($user, true)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update user status
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            $request->validate([
                'status' => 'required|in:active,inactive,suspended',
            ]);

            $oldStatus = $user->status;
            $user->update([
                'status' => $request->status,
            ]);

            return response()->json([
                'success' => true,
                'message' => "User status updated from {$oldStatus} to {$request->status}",
                'data' => $this->transformUser($user->fresh(['roles:id,name,slug']))
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $id,
                'phone' => 'sometimes|nullable|string|max:20',
                'status' => 'sometimes|in:active,inactive,suspended',
            ]);

            $updateData = $request->only(['name', 'email', 'phone', 'status']);

            $user->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $this->transformUser($user->fresh(['roles:id,name,slug']))
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete user
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            // Check if user has orders
            if ($user->orders()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete user with existing orders. Please suspend instead.',
                ], 400);
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $baseQuery = User::whereDoesntHave('roles', function ($q) {
                $q->whereIn('slug', ['admin', 'super-admin']);
            });

            $stats = [
                'total_users' => $baseQuery->count(),
                'active_users' => $baseQuery->where('status', 'active')->count(),
                'inactive_users' => $baseQuery->where('status', 'inactive')->count(),
                'suspended_users' => $baseQuery->where('status', 'suspended')->count(),
                'new_users_this_month' => $baseQuery->whereMonth('created_at', now()->month)->count(),
                'users_with_orders' => $baseQuery->has('orders')->count(),
                'total_revenue' => Order::where('is_paid', true)->sum('total_amount'),
                'recent_users' => User::with(['roles:id,name,slug'])
                    ->whereDoesntHave('roles', function ($q) {
                        $q->whereIn('slug', ['admin', 'super-admin']);
                    })
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get(['id', 'name', 'email', 'status', 'created_at']),
            ];

            return response()->json([
                'success' => true,
                'message' => 'User statistics retrieved successfully',
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Transform user for API response
     */
    private function transformUser($user, $detailed = false): array
    {
        $baseData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'status' => $user->status ?? 'active',
            'avatar' => $user->avatar,
            'last_login_at' => $user->last_login_at,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
            'roles' => $user->roles->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'slug' => $role->slug,
                ];
            }),
            'total_orders' => $user->total_orders ?? 0,
            'total_spent' => $user->total_spent ?? 0,
        ];

        if ($detailed) {
            $baseData['orders'] = $user->orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'is_paid' => $order->is_paid,
                    'created_at' => $order->created_at,
                ];
            });
        }

        return $baseData;
    }
}
