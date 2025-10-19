<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\ReturnController;
use App\Http\Controllers\ProductBulkController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\PerformanceController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\WishlistController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public checkout (guest or authenticated)
Route::post('/checkout', [OrderController::class, 'store']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Authenticated cart endpoints (token-based)
    Route::prefix('auth/cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/add', [CartController::class, 'add']);
        Route::put('/update/{id}', [CartController::class, 'update']);
        Route::delete('/remove/{id}', [CartController::class, 'remove']);
        Route::delete('/clear', [CartController::class, 'clear']);
        Route::get('/summary', [CartController::class, 'summary']);
    });

    // Authenticated wishlist endpoints (token-based)
    Route::prefix('auth/wishlist')->group(function () {
        Route::get('/', [WishlistController::class, 'index']);
        Route::post('/add', [WishlistController::class, 'add']);
        Route::delete('/remove/{id}', [WishlistController::class, 'remove']);
        Route::delete('/remove-product/{productId}', [WishlistController::class, 'removeByProduct']);
        Route::delete('/clear', [WishlistController::class, 'clear']);
        Route::get('/check/{productId}', [WishlistController::class, 'check']);
        Route::get('/count', [WishlistController::class, 'count']);
    });
    // Authentication routes
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::get('/account/export', [AuthController::class, 'exportAccountData']);
    Route::delete('/account', [AuthController::class, 'deleteAccount']);

    // Super Admin Dashboard Routes
    Route::middleware('role:super-admin')->group(function () {
        Route::prefix('super-admin')->group(function () {
            // Dashboard overview
            Route::get('/dashboard/overview', [SuperAdminController::class, 'getDashboardOverview']);
            
            // User management
            Route::get('/users', [SuperAdminController::class, 'getAdminUsers']);
            Route::post('/users', [SuperAdminController::class, 'createAdminUser']);
            Route::put('/users/{id}', [SuperAdminController::class, 'updateAdminUser']);
            Route::delete('/users/{id}', [SuperAdminController::class, 'deleteAdminUser']);
            
            // System monitoring
            Route::get('/system/status', [SuperAdminController::class, 'getSystemStatus']);
            Route::get('/system/activities', [SuperAdminController::class, 'getRecentActivities']);
            
            // Analytics
            Route::get('/analytics', [SuperAdminController::class, 'getAnalytics']);
            
            // Legacy routes for backward compatibility
            Route::get('/dashboard', function () {
                return response()->json([
                    'success' => true,
                    'message' => 'Super Admin Dashboard Access Granted',
                    'data' => [
                        'user' => auth()->user()->name,
                        'role' => 'Super Admin',
                        'permissions' => auth()->user()->getAllPermissions()->pluck('name')
                    ]
                ]);
            });
            
            Route::get('/system-backup', function () {
                return response()->json([
                    'success' => true,
                    'message' => 'System backup functionality - Super Admin only',
                    'data' => ['backup_status' => 'available']
                ]);
            });
        });
    });

    Route::middleware('role:super-admin,admin')->group(function () {
        Route::get('/admin/dashboard', function () {
            return response()->json([
                'success' => true,
                'message' => 'Admin Dashboard Access Granted',
                'data' => [
                    'user' => auth()->user()->name,
                    'roles' => auth()->user()->roles->pluck('name'),
                    'permissions' => auth()->user()->getAllPermissions()->pluck('name')
                ]
            ]);
        });

        Route::get('/admin/users', function () {
            return response()->json([
                'success' => true,
                'message' => 'User management access',
                'data' => ['total_users' => \App\Models\User::count()]
            ]);
        });
    });

    Route::middleware('role:editor')->group(function () {
        Route::get('/editor/dashboard', function () {
            return response()->json([
                'success' => true,
                'message' => 'Editor Dashboard Access Granted',
                'data' => [
                    'user' => auth()->user()->name,
                    'role' => 'Editor',
                    'permissions' => auth()->user()->getAllPermissions()->pluck('name')
                ]
            ]);
        });

        Route::get('/editor/content', function () {
            return response()->json([
                'success' => true,
                'message' => 'Content management access',
                'data' => ['content_items' => 'Available for editing']
            ]);
        });
    });

    // Permission-based protected routes examples
    Route::middleware('permission:view-users')->group(function () {
        Route::get('/users', function () {
            return response()->json([
                'success' => true,
                'message' => 'Users list access granted',
                'data' => \App\Models\User::with('roles')->get()
            ]);
        });
    });

    Route::middleware('permission:create-content,edit-content')->group(function () {
        Route::post('/content', function () {
            return response()->json([
                'success' => true,
                'message' => 'Content creation/editing access granted'
            ]);
        });
    });

    // General authenticated user routes
    Route::get('/user/dashboard', function () {
        return response()->json([
            'success' => true,
            'message' => 'User Dashboard - Available to all authenticated users',
            'data' => [
                'user' => auth()->user()->name,
                'roles' => auth()->user()->roles->pluck('name'),
                'status' => auth()->user()->status
            ]
        ]);
    });

    // Customer Dashboard Routes
    Route::prefix('customer')->group(function () {
        // Dashboard data
        Route::get('/dashboard', [CustomerController::class, 'getDashboardData']);
        Route::get('/stats', [CustomerController::class, 'getCustomerStats']);
        Route::get('/orders/recent', [CustomerController::class, 'getRecentOrders']);
        Route::get('/orders', [CustomerController::class, 'getUserOrders']);
        Route::get('/orders/{id}', [CustomerController::class, 'getOrderDetails']);
        Route::get('/real-time-updates', [CustomerController::class, 'getRealTimeUpdates']);
        
        // Profile management
        Route::put('/profile', [CustomerController::class, 'updateProfile']);
        Route::post('/change-password', [CustomerController::class, 'changePassword']);
        
        // Address management
        Route::prefix('addresses')->group(function () {
            Route::get('/', [AddressController::class, 'getAddresses']);
            Route::post('/', [AddressController::class, 'createAddress']);
            Route::put('/{id}', [AddressController::class, 'updateAddress']);
            Route::delete('/{id}', [AddressController::class, 'deleteAddress']);
            Route::patch('/{id}/default', [AddressController::class, 'setDefaultAddress']);
        });
        
        // Order management for customers
        Route::prefix('orders')->group(function () {
            Route::post('/', [OrderController::class, 'store']);
        });
        
        // Notifications
        Route::prefix('notifications')->group(function () {
            Route::get('/', [NotificationController::class, 'getNotifications']);
            Route::patch('/{id}/read', [NotificationController::class, 'markAsRead']);
            Route::patch('/read-all', [NotificationController::class, 'markAllAsRead']);
        });
    });

    // Test endpoints for different user types
    Route::get('/test/super-admin', function () {
        $user = auth()->user();
        return response()->json([
            'success' => true,
            'message' => 'Testing Super Admin Access',
            'data' => [
                'is_super_admin' => $user->isSuperAdmin(),
                'has_system_backup_permission' => $user->hasPermission('system-backup'),
                'user_roles' => $user->roles->pluck('name')
            ]
        ]);
    })->middleware('role:super-admin');

    Route::get('/test/admin', function () {
        $user = auth()->user();
        return response()->json([
            'success' => true,
            'message' => 'Testing Admin Access',
            'data' => [
                'is_admin' => $user->isAdmin(),
                'has_user_management' => $user->hasPermission('view-users'),
                'user_roles' => $user->roles->pluck('name')
            ]
        ]);
    })->middleware('role:super-admin,admin');

    Route::get('/test/editor', function () {
        $user = auth()->user();
        return response()->json([
            'success' => true,
            'message' => 'Testing Editor Access',
            'data' => [
                'is_editor' => $user->isEditor(),
                'has_content_management' => $user->hasPermission('create-content'),
                'user_roles' => $user->roles->pluck('name')
            ]
        ]);
    })->middleware('role:editor');

    Route::get('/test/user', function () {
        $user = auth()->user();
        return response()->json([
            'success' => true,
            'message' => 'Testing Basic User Access',
            'data' => [
                'is_user' => $user->isUser(),
                'has_view_content' => $user->hasPermission('view-content'),
                'user_roles' => $user->roles->pluck('name')
            ]
        ]);
    });
});

// Public product and category routes
Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::get('/{slug}', [CategoryController::class, 'show']);
});

Route::prefix('products')->group(function () {
    Route::get('/test', function() {
        return response()->json(['success' => true, 'message' => 'Test endpoint works', 'products' => \App\Models\Product::limit(2)->get(['id', 'name'])]);
    });
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/featured', [ProductController::class, 'featured']);
    Route::get('/search', [ProductController::class, 'search']);
    Route::get('/filter-options', [ProductController::class, 'filterOptions']);
    Route::get('/{slug}', [ProductController::class, 'show']);
});

Route::prefix('brands')->group(function () {
    Route::get('/', [BrandController::class, 'index']);
    Route::get('/{slug}', [BrandController::class, 'show']);
});

// Payment routes
Route::prefix('payment')->group(function () {
    Route::post('/verify', [PaymentController::class, 'verifyPayment']);
    Route::post('/initialize', [PaymentController::class, 'initializePayment']);
    Route::post('/webhook', [PaymentController::class, 'handleWebhook']);
});

// Promotion routes (admin protected)
Route::middleware('auth:sanctum')->group(function () {
    Route::middleware('role:super-admin,admin,editor')->group(function () {
        Route::prefix('promotions')->group(function () {
            Route::get('/', [PromotionController::class, 'index']);
            Route::post('/', [PromotionController::class, 'store']);
            Route::get('/{promotion}', [PromotionController::class, 'show']);
            Route::put('/{promotion}', [PromotionController::class, 'update']);
            Route::delete('/{promotion}', [PromotionController::class, 'destroy']);
            Route::post('/{promotion}/activate', [PromotionController::class, 'activate']);
            Route::post('/{promotion}/expire', [PromotionController::class, 'expire']);
            Route::post('/apply-to-products', [PromotionController::class, 'applyToProducts']);
            Route::post('/remove-expired', [PromotionController::class, 'removeExpiredPromotions']);
            Route::get('/products/available', [PromotionController::class, 'getAvailableProducts']);
        });
        // Returns management
        Route::prefix('returns')->group(function () {
            Route::get('/', [ReturnController::class, 'index']);
            Route::post('/', [ReturnController::class, 'store']);
            Route::put('/{return}', [ReturnController::class, 'update']);
            Route::post('/{return}/approve', [ReturnController::class, 'approve']);
            Route::post('/{return}/reject', [ReturnController::class, 'reject']);
            Route::post('/{return}/complete', [ReturnController::class, 'complete']);
        });

        // Product bulk operations
        Route::post('/products/bulk-update', [ProductBulkController::class, 'update']);
        
        // Product creation and updates (admin/editor only)
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::patch('/products/{id}/status', [ProductController::class, 'updateStatus']);
        
        // Order management (admin only)
        Route::prefix('orders')->group(function () {
            Route::get('/', [OrderController::class, 'index']);
            Route::get('/statistics', [OrderController::class, 'statistics']);
            Route::get('/{id}', [OrderController::class, 'show']);
            Route::put('/{id}', [OrderController::class, 'update']);
            Route::patch('/{id}/status', [OrderController::class, 'updateStatus']);
            Route::patch('/{id}/payment', [OrderController::class, 'updatePaymentStatus']);
        });
        
        // User management (admin only)
        Route::prefix('users')->group(function () {
            Route::get('/', [UserController::class, 'index']);
            Route::get('/statistics', [UserController::class, 'statistics']);
            Route::get('/{id}', [UserController::class, 'show']);
            Route::put('/{id}', [UserController::class, 'update']);
            Route::patch('/{id}/status', [UserController::class, 'updateStatus']);
            Route::delete('/{id}', [UserController::class, 'destroy']);
        });
        
        // Blog posts management
        Route::prefix('posts')->group(function () {
            Route::get('/', [PostController::class, 'index']);
            Route::post('/', [PostController::class, 'store']);
            Route::get('/{slug}', [PostController::class, 'show']);
            Route::put('/{id}', [PostController::class, 'update']);
            Route::delete('/{id}', [PostController::class, 'destroy']);
        });
        
        // Media management
        Route::prefix('media')->group(function () {
            Route::get('/', [MediaController::class, 'index']);
            Route::post('/upload', [MediaController::class, 'upload']);
            Route::get('/stats', [MediaController::class, 'stats']);
            Route::get('/{id}', [MediaController::class, 'show']);
            Route::delete('/{id}', [MediaController::class, 'destroy']);
        });
        
        // Performance metrics
        Route::prefix('performance')->group(function () {
            Route::get('/products', [PerformanceController::class, 'getProductPerformance']);
            Route::get('/content', [PerformanceController::class, 'getContentPerformance']);
            Route::get('/dashboard', [PerformanceController::class, 'getDashboardMetrics']);
        });

        // Dashboard statistics
        Route::prefix('dashboard')->group(function () {
            Route::get('/statistics', [DashboardController::class, 'statistics']);
            Route::get('/cards', [DashboardController::class, 'cards']);
        });

        // Cloudinary test endpoint
        Route::get('/test/cloudinary', function () {
            try {
                $config = config('cloudinary');
                return response()->json([
                    'success' => true,
                    'message' => 'Cloudinary configuration loaded',
                    'config' => [
                        'cloud_name' => $config['cloud_url'] ? parse_url($config['cloud_url'], PHP_URL_HOST) : 'Not set',
                        'upload_preset' => $config['upload_preset'] ?? 'Not set',
                        'has_api_key' => !empty(parse_url($config['cloud_url'], PHP_URL_USER)),
                        'has_api_secret' => !empty(parse_url($config['cloud_url'], PHP_URL_PASS)),
                    ]
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cloudinary configuration error: ' . $e->getMessage()
                ], 500);
            }
        });

        // Test cURL SSL connection
        Route::get('/test/curl-ssl', function () {
            try {
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, "https://api.cloudinary.com/v1_1/djmqshe6o/test");
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
                curl_setopt($ch, CURLOPT_TIMEOUT, 10);
                curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
                
                $response = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                $curlError = curl_error($ch);
                curl_close($ch);

                return response()->json([
                    'success' => true,
                    'message' => 'cURL SSL test completed',
                    'data' => [
                        'http_code' => $httpCode,
                        'curl_error' => $curlError ?: 'None',
                        'response_length' => strlen($response),
                        'ssl_working' => empty($curlError)
                    ]
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'cURL SSL test failed: ' . $e->getMessage()
                ], 500);
            }
        });

        // Test upload preset configuration
        Route::get('/test/upload-preset', function () {
            try {
                $cloudName = env('CLOUDINARY_CLOUD_NAME');
                $uploadPreset = env('CLOUDINARY_UPLOAD_PRESET');
                
                if (!$uploadPreset) {
                    return response()->json([
                        'success' => false,
                        'message' => 'No upload preset configured'
                    ], 400);
                }

                // Test the preset with a simple request
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, "https://api.cloudinary.com/v1_1/{$cloudName}/upload_presets/{$uploadPreset}");
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
                curl_setopt($ch, CURLOPT_TIMEOUT, 10);
                
                $response = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                $curlError = curl_error($ch);
                curl_close($ch);

                return response()->json([
                    'success' => true,
                    'message' => 'Upload preset test completed',
                    'data' => [
                        'preset_name' => $uploadPreset,
                        'http_code' => $httpCode,
                        'curl_error' => $curlError ?: 'None',
                        'response' => json_decode($response, true),
                        'preset_accessible' => $httpCode === 200
                    ]
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Upload preset test failed: ' . $e->getMessage()
                ], 500);
            }
        });
    });
});
