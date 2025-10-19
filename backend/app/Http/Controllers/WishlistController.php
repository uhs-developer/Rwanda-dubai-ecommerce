<?php

namespace App\Http\Controllers;

use App\Models\WishlistItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class WishlistController extends Controller
{
    /**
     * Get wishlist items for authenticated user or guest session
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $userId = Auth::id();
            $sessionId = null;
            if (!$userId) {
                if ($request->hasSession()) {
                    $sessionId = $request->session()->getId();
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Session not available for guest wishlist. Ensure cookies/session middleware is enabled.'
                    ], 400);
                }
            }

            $query = WishlistItem::with(['product.images', 'product.brand', 'product.category']);

            if ($userId) {
                $query->where('user_id', $userId);
            } else {
                $query->where('session_id', $sessionId);
            }

            $wishlistItems = $query->orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'items' => $wishlistItems,
                    'item_count' => $wishlistItems->count(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve wishlist items',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add item to wishlist
     */
    public function add(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'product_id' => 'required|exists:products,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $product = Product::findOrFail($request->product_id);

            // Check if product is active
            if (!$product->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product is not available'
                ], 400);
            }

            $userId = Auth::id();
            $sessionId = null;
            if (!$userId) {
                if ($request->hasSession()) {
                    $sessionId = $request->session()->getId();
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Session not available for guest wishlist. Ensure cookies/session middleware is enabled.'
                    ], 400);
                }
            }

            // Check if item already exists in wishlist
            $existingItem = WishlistItem::where('product_id', $request->product_id);

            if ($userId) {
                $existingItem->where('user_id', $userId);
            } else {
                $existingItem->where('session_id', $sessionId);
            }

            $existingItem = $existingItem->first();

            if ($existingItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product is already in your wishlist'
                ], 400);
            }

            // Create new wishlist item
            $wishlistItem = WishlistItem::create([
                'user_id' => $userId,
                'product_id' => $request->product_id,
                'session_id' => $userId ? null : $sessionId,
            ]);

            $wishlistItem->load(['product.images', 'product.brand', 'product.category']);

            return response()->json([
                'success' => true,
                'message' => 'Item added to wishlist successfully',
                'data' => $wishlistItem
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add item to wishlist',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove item from wishlist
     */
    public function remove(Request $request, $id): JsonResponse
    {
        try {
            $userId = Auth::id();
            $sessionId = null;
            if (!$userId) {
                if ($request->hasSession()) {
                    $sessionId = $request->session()->getId();
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Session not available for guest wishlist. Ensure cookies/session middleware is enabled.'
                    ], 400);
                }
            }

            $wishlistItem = WishlistItem::where('id', $id);

            if ($userId) {
                $wishlistItem->where('user_id', $userId);
            } else {
                $wishlistItem->where('session_id', $sessionId);
            }

            $wishlistItem = $wishlistItem->first();

            if (!$wishlistItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Wishlist item not found'
                ], 404);
            }

            $wishlistItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Item removed from wishlist successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove item from wishlist',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove item from wishlist by product ID
     */
    public function removeByProduct(Request $request, $productId): JsonResponse
    {
        try {
            $userId = Auth::id();
            $sessionId = null;
            if (!$userId) {
                if ($request->hasSession()) {
                    $sessionId = $request->session()->getId();
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Session not available for guest wishlist. Ensure cookies/session middleware is enabled.'
                    ], 400);
                }
            }

            $wishlistItem = WishlistItem::where('product_id', $productId);

            if ($userId) {
                $wishlistItem->where('user_id', $userId);
            } else {
                $wishlistItem->where('session_id', $sessionId);
            }

            $wishlistItem = $wishlistItem->first();

            if (!$wishlistItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found in wishlist'
                ], 404);
            }

            $wishlistItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Item removed from wishlist successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove item from wishlist',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clear entire wishlist
     */
    public function clear(Request $request): JsonResponse
    {
        try {
            $userId = Auth::id();
            $sessionId = null;
            if (!$userId) {
                if ($request->hasSession()) {
                    $sessionId = $request->session()->getId();
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Session not available for guest wishlist. Ensure cookies/session middleware is enabled.'
                    ], 400);
                }
            }

            $query = WishlistItem::query();

            if ($userId) {
                $query->where('user_id', $userId);
            } else {
                $query->where('session_id', $sessionId);
            }

            $deletedCount = $query->delete();

            return response()->json([
                'success' => true,
                'message' => 'Wishlist cleared successfully',
                'data' => ['deleted_items' => $deletedCount]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear wishlist',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if product is in wishlist
     */
    public function check(Request $request, $productId): JsonResponse
    {
        try {
            $userId = Auth::id();
            $sessionId = null;
            if (!$userId) {
                if ($request->hasSession()) {
                    $sessionId = $request->session()->getId();
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Session not available for guest wishlist. Ensure cookies/session middleware is enabled.'
                    ], 400);
                }
            }

            $wishlistItem = WishlistItem::where('product_id', $productId);

            if ($userId) {
                $wishlistItem->where('user_id', $userId);
            } else {
                $wishlistItem->where('session_id', $sessionId);
            }

            $isInWishlist = $wishlistItem->exists();

            return response()->json([
                'success' => true,
                'data' => [
                    'is_in_wishlist' => $isInWishlist,
                    'product_id' => $productId
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to check wishlist status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get wishlist count
     */
    public function count(Request $request): JsonResponse
    {
        try {
            $userId = Auth::id();
            $sessionId = $request->session()->getId();

            $query = WishlistItem::query();

            if ($userId) {
                $query->where('user_id', $userId);
            } else {
                $query->where('session_id', $sessionId);
            }

            $count = $query->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'count' => $count
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get wishlist count',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
