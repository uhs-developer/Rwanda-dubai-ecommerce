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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication routes
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Role-based protected routes examples
    Route::middleware('role:super-admin')->group(function () {
        Route::get('/super-admin/dashboard', function () {
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
        
        Route::get('/super-admin/system-backup', function () {
            return response()->json([
                'success' => true,
                'message' => 'System backup functionality - Super Admin only',
                'data' => ['backup_status' => 'available']
            ]);
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
    });
});
