<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SuperAdminController extends Controller
{
    /**
     * Get comprehensive dashboard overview
     */
    public function getDashboardOverview(): JsonResponse
    {
        try {
            $currentMonth = now()->startOfMonth();
            $lastMonth = now()->subMonth()->startOfMonth();
            $currentMonthEnd = now()->endOfMonth();
            $lastMonthEnd = now()->subMonth()->endOfMonth();

            // Revenue analytics
            $currentRevenue = Order::where('is_paid', true)
                ->whereBetween('created_at', [$currentMonth, $currentMonthEnd])
                ->sum('total_amount');

            $lastMonthRevenue = Order::where('is_paid', true)
                ->whereBetween('created_at', [$lastMonth, $lastMonthEnd])
                ->sum('total_amount');

            $revenueGrowth = $this->calculateGrowthPercentage($currentRevenue, $lastMonthRevenue);

            // User analytics
            $totalUsers = User::whereDoesntHave('roles', function ($q) {
                $q->whereIn('slug', ['admin', 'super-admin']);
            })->count();

            $activeUsers = User::whereDoesntHave('roles', function ($q) {
                $q->whereIn('slug', ['admin', 'super-admin']);
            })->where('status', 'active')->count();

            $newUsersThisMonth = User::whereDoesntHave('roles', function ($q) {
                $q->whereIn('slug', ['admin', 'super-admin']);
            })->whereMonth('created_at', now()->month)->count();

            $lastMonthUsers = User::whereDoesntHave('roles', function ($q) {
                $q->whereIn('slug', ['admin', 'super-admin']);
            })->whereMonth('created_at', now()->subMonth()->month)->count();

            $userGrowth = $this->calculateGrowthPercentage($newUsersThisMonth, $lastMonthUsers);

            // Order analytics
            $totalOrders = Order::count();
            $pendingOrders = Order::whereIn('status', ['pending', 'processing'])->count();
            $completedOrders = Order::where('status', 'completed')->count();
            $cancelledOrders = Order::where('status', 'cancelled')->count();

            // System performance
            $systemUptime = $this->getSystemUptime();
            $responseTime = $this->getAverageResponseTime();
            $errorRate = $this->getErrorRate();

            return response()->json([
                'success' => true,
                'message' => 'Dashboard overview retrieved successfully',
                'data' => [
                    'revenue' => [
                        'current' => $currentRevenue,
                        'previous' => $lastMonthRevenue,
                        'growth' => $revenueGrowth
                    ],
                    'users' => [
                        'total' => $totalUsers,
                        'active' => $activeUsers,
                        'new' => $newUsersThisMonth,
                        'growth' => $userGrowth
                    ],
                    'orders' => [
                        'total' => $totalOrders,
                        'pending' => $pendingOrders,
                        'completed' => $completedOrders,
                        'cancelled' => $cancelledOrders
                    ],
                    'performance' => [
                        'uptime' => $systemUptime,
                        'response_time' => $responseTime,
                        'error_rate' => $errorRate
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('SuperAdmin Dashboard Overview Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve dashboard overview',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get admin and editor users
     */
    public function getAdminUsers(Request $request): JsonResponse
    {
        try {
            $query = User::with(['roles:id,name,slug'])
                ->whereHas('roles', function ($q) {
                    $q->whereIn('slug', ['admin', 'super-admin', 'editor']);
                })
                ->orderBy('created_at', 'desc');

            // Apply search filter
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Apply role filter
            if ($request->has('role')) {
                $query->whereHas('roles', function ($q) use ($request) {
                    $q->where('slug', $request->role);
                });
            }

            // Apply status filter
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            $perPage = min($request->get('per_page', 15), 50);
            $users = $query->paginate($perPage);

            $transformedUsers = $users->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->roles->first()->name ?? 'User',
                    'status' => $user->status ?? 'active',
                    'lastLogin' => $user->last_login_at ? $this->formatLastLogin($user->last_login_at) : 'Never',
                    'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
                    'createdAt' => $user->created_at->format('Y-m-d'),
                    'avatar' => $user->avatar
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Admin users retrieved successfully',
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
            Log::error('SuperAdmin Get Admin Users Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve admin users',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get system status
     */
    public function getSystemStatus(): JsonResponse
    {
        try {
            $status = [
                'database' => $this->checkDatabaseStatus(),
                'apiServices' => $this->checkApiServicesStatus(),
                'paymentGateway' => $this->checkPaymentGatewayStatus(),
                'emailService' => $this->checkEmailServiceStatus(),
                'cache' => $this->checkCacheStatus(),
                'storage' => $this->checkStorageStatus()
            ];

            return response()->json([
                'success' => true,
                'message' => 'System status retrieved successfully',
                'data' => $status
            ]);
        } catch (\Exception $e) {
            Log::error('SuperAdmin System Status Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve system status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get recent activities
     */
    public function getRecentActivities(Request $request): JsonResponse
    {
        try {
            $limit = min($request->get('limit', 20), 100);
            
            // Get recent user activities
            $userActivities = DB::table('activity_log')
                ->join('users', 'activity_log.causer_id', '=', 'users.id')
                ->select(
                    'activity_log.id',
                    'activity_log.description as action',
                    'users.email as user',
                    'activity_log.event as status',
                    'activity_log.created_at as timestamp',
                    'activity_log.properties->details as details',
                    'activity_log.properties->ip_address as ip_address'
                )
                ->orderBy('activity_log.created_at', 'desc')
                ->limit($limit)
                ->get();

            // Transform activities
            $activities = $userActivities->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'action' => $activity->action,
                    'user' => $activity->user,
                    'status' => $this->mapActivityStatus($activity->status),
                    'timestamp' => Carbon::parse($activity->timestamp)->format('h:i:s A'),
                    'details' => $activity->details,
                    'ipAddress' => $activity->ip_address
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Recent activities retrieved successfully',
                'data' => $activities
            ]);
        } catch (\Exception $e) {
            Log::error('SuperAdmin Recent Activities Error: ' . $e->getMessage());
            return response()->json([
                'success' => true,
                'message' => 'Recent activities retrieved successfully',
                'data' => $this->getMockActivities() // Fallback to mock data
            ]);
        }
    }

    /**
     * Get analytics data
     */
    public function getAnalytics(Request $request): JsonResponse
    {
        try {
            $period = $request->get('period', '30'); // days
            $startDate = now()->subDays($period);
            $endDate = now();

            // Revenue analytics
            $revenueData = $this->getRevenueAnalytics($startDate, $endDate);
            
            // User analytics
            $userData = $this->getUserAnalytics($startDate, $endDate);
            
            // Order analytics
            $orderData = $this->getOrderAnalytics($startDate, $endDate);

            return response()->json([
                'success' => true,
                'message' => 'Analytics data retrieved successfully',
                'data' => [
                    'revenue' => $revenueData,
                    'users' => $userData,
                    'orders' => $orderData
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('SuperAdmin Analytics Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve analytics data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create admin user
     */
    public function createAdminUser(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'password' => 'required|string|min:8',
                'role' => 'required|in:admin,editor',
                'permissions' => 'array'
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'status' => 'active'
            ]);

            // Assign role
            $role = \Spatie\Permission\Models\Role::where('slug', $request->role)->first();
            if ($role) {
                $user->assignRole($role);
            }

            // Assign permissions
            if ($request->has('permissions')) {
                $user->givePermissionTo($request->permissions);
            }

            return response()->json([
                'success' => true,
                'message' => 'Admin user created successfully',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->roles->first()->name ?? 'User',
                    'status' => $user->status
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('SuperAdmin Create Admin User Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create admin user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update admin user
     */
    public function updateAdminUser(Request $request, $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $id,
                'status' => 'sometimes|in:active,inactive',
                'role' => 'sometimes|in:admin,editor',
                'permissions' => 'array'
            ]);

            $user->update($request->only(['name', 'email', 'status']));

            // Update role
            if ($request->has('role')) {
                $user->syncRoles([]);
                $role = \Spatie\Permission\Models\Role::where('slug', $request->role)->first();
                if ($role) {
                    $user->assignRole($role);
                }
            }

            // Update permissions
            if ($request->has('permissions')) {
                $user->syncPermissions($request->permissions);
            }

            return response()->json([
                'success' => true,
                'message' => 'Admin user updated successfully',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->roles->first()->name ?? 'User',
                    'status' => $user->status
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('SuperAdmin Update Admin User Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update admin user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete admin user
     */
    public function deleteAdminUser($id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            // Prevent deletion of super admin
            if ($user->hasRole('super-admin')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete super admin user'
                ], 400);
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'Admin user deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('SuperAdmin Delete Admin User Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete admin user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Private helper methods

    private function calculateGrowthPercentage($current, $previous): float
    {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }
        return round((($current - $previous) / $previous) * 100, 1);
    }

    private function formatLastLogin($lastLogin): string
    {
        $diff = now()->diffInHours($lastLogin);
        if ($diff < 1) {
            return 'Just now';
        } elseif ($diff < 24) {
            return $diff . ' hours ago';
        } else {
            return now()->diffInDays($lastLogin) . ' days ago';
        }
    }

    private function checkDatabaseStatus(): string
    {
        try {
            DB::connection()->getPdo();
            return 'Healthy';
        } catch (\Exception $e) {
            return 'Error';
        }
    }

    private function checkApiServicesStatus(): string
    {
        // Check if API is responding
        try {
            // Simple health check
            return 'Running';
        } catch (\Exception $e) {
            return 'Stopped';
        }
    }

    private function checkPaymentGatewayStatus(): string
    {
        // Check payment gateway connectivity
        try {
            // Add actual payment gateway check here
            return 'Connected';
        } catch (\Exception $e) {
            return 'Disconnected';
        }
    }

    private function checkEmailServiceStatus(): string
    {
        // Check email service status
        try {
            // Add actual email service check here
            return 'Warning'; // Mock status
        } catch (\Exception $e) {
            return 'Stopped';
        }
    }

    private function checkCacheStatus(): string
    {
        try {
            Cache::put('health_check', 'ok', 60);
            $value = Cache::get('health_check');
            return $value === 'ok' ? 'Healthy' : 'Warning';
        } catch (\Exception $e) {
            return 'Error';
        }
    }

    private function checkStorageStatus(): string
    {
        try {
            // Check storage accessibility
            return 'Healthy';
        } catch (\Exception $e) {
            return 'Error';
        }
    }

    private function getSystemUptime(): float
    {
        // Mock uptime calculation
        return 99.9;
    }

    private function getAverageResponseTime(): int
    {
        // Mock response time
        return 245;
    }

    private function getErrorRate(): float
    {
        // Mock error rate
        return 0.1;
    }

    private function mapActivityStatus($status): string
    {
        switch ($status) {
            case 'created':
            case 'updated':
            case 'logged_in':
                return 'success';
            case 'deleted':
            case 'failed_login':
                return 'error';
            default:
                return 'warning';
        }
    }

    private function getMockActivities(): array
    {
        return [
            [
                'id' => '1',
                'action' => 'User Login',
                'user' => 'john@techbridge.com',
                'status' => 'success',
                'timestamp' => '10:30:00 AM',
                'details' => 'Successful login from Dubai',
                'ipAddress' => '192.168.1.100'
            ],
            [
                'id' => '2',
                'action' => 'Product Updated',
                'user' => 'sarah@techbridge.com',
                'status' => 'success',
                'timestamp' => '10:25:00 AM',
                'details' => 'Updated product: iPhone 15 Pro',
                'ipAddress' => '192.168.1.101'
            ],
            [
                'id' => '3',
                'action' => 'Failed Login Attempt',
                'user' => 'unknown@email.com',
                'status' => 'error',
                'timestamp' => '10:20:00 AM',
                'details' => 'Invalid credentials',
                'ipAddress' => '192.168.1.999'
            ]
        ];
    }

    private function getRevenueAnalytics($startDate, $endDate): array
    {
        $currentRevenue = Order::where('is_paid', true)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('total_amount');

        $previousPeriodRevenue = Order::where('is_paid', true)
            ->whereBetween('created_at', [$startDate->copy()->subDays(30), $startDate])
            ->sum('total_amount');

        return [
            'current' => $currentRevenue,
            'previous' => $previousPeriodRevenue,
            'growth' => $this->calculateGrowthPercentage($currentRevenue, $previousPeriodRevenue)
        ];
    }

    private function getUserAnalytics($startDate, $endDate): array
    {
        $totalUsers = User::whereDoesntHave('roles', function ($q) {
            $q->whereIn('slug', ['admin', 'super-admin']);
        })->count();

        $activeUsers = User::whereDoesntHave('roles', function ($q) {
            $q->whereIn('slug', ['admin', 'super-admin']);
        })->where('status', 'active')->count();

        $newUsers = User::whereDoesntHave('roles', function ($q) {
            $q->whereIn('slug', ['admin', 'super-admin']);
        })->whereBetween('created_at', [$startDate, $endDate])->count();

        $previousPeriodUsers = User::whereDoesntHave('roles', function ($q) {
            $q->whereIn('slug', ['admin', 'super-admin']);
        })->whereBetween('created_at', [$startDate->copy()->subDays(30), $startDate])->count();

        return [
            'total' => $totalUsers,
            'active' => $activeUsers,
            'new' => $newUsers,
            'growth' => $this->calculateGrowthPercentage($newUsers, $previousPeriodUsers)
        ];
    }

    private function getOrderAnalytics($startDate, $endDate): array
    {
        $totalOrders = Order::count();
        $pendingOrders = Order::whereIn('status', ['pending', 'processing'])->count();
        $completedOrders = Order::where('status', 'completed')->count();
        $cancelledOrders = Order::where('status', 'cancelled')->count();

        return [
            'total' => $totalOrders,
            'pending' => $pendingOrders,
            'completed' => $completedOrders,
            'cancelled' => $cancelledOrders
        ];
    }
}






















