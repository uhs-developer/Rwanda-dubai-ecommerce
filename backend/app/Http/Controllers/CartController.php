<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    /**
     * Resolve guest session id from header, query, or Laravel session.
     */
    private function resolveGuestSessionId(Request $request): ?string
    {
        $headerSessionId = $request->header('X-Session-Id');
        if (!empty($headerSessionId)) {
            return $headerSessionId;
        }

        $querySessionId = $request->query('session_id');
        if (!empty($querySessionId)) {
            return $querySessionId;
        }

        if ($request->hasSession()) {
            return $request->session()->getId();
        }

        return null;
    }

    /**
     * Get cart items for authenticated user or guest session
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $userId = Auth::id();
            $sessionId = null;
            if (!$userId) {
                $sessionId = $this->resolveGuestSessionId($request);
                if (!$sessionId) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Session not available for guest cart. Provide X-Session-Id header or enable cookies.'
                    ], 400);
                }
            }

            $query = CartItem::with(['product.images', 'product.brand', 'product.category']);

            if ($userId) {
                $query->where('user_id', $userId);
            } else {
                $query->where('session_id', $sessionId);
            }

            $cartItems = $query->orderBy('created_at', 'desc')->get();

            $totalItems = $cartItems->sum('quantity');
            $totalPrice = $cartItems->sum('total_price');

            return response()->json([
                'success' => true,
                'data' => [
                    'items' => $cartItems,
                    'summary' => [
                        'total_items' => $totalItems,
                        'total_price' => $totalPrice,
                        'item_count' => $cartItems->count(),
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve cart items',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add item to cart
     */
    public function add(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'product_id' => 'required|exists:products,id',
                'quantity' => 'required|integer|min:1|max:100',
                'product_options' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $product = Product::findOrFail($request->product_id);

            // Check if product is active and in stock
            if (!$product->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product is not available'
                ], 400);
            }

            if (!$product->in_stock || $product->stock_quantity < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient stock available'
                ], 400);
            }

            $userId = Auth::id();
            $sessionId = null;
            if (!$userId) {
                $sessionId = $this->resolveGuestSessionId($request);
                if (!$sessionId) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Session not available for guest cart. Provide X-Session-Id header or enable cookies.'
                    ], 400);
                }
            }

            DB::beginTransaction();

            // Check if item already exists in cart
            $existingItem = CartItem::where('product_id', $request->product_id);

            if ($userId) {
                $existingItem->where('user_id', $userId);
            } else {
                $existingItem->where('session_id', $sessionId);
            }

            $existingItem = $existingItem->first();

            if ($existingItem) {
                // Update quantity
                $newQuantity = $existingItem->quantity + $request->quantity;
                
                if ($product->stock_quantity < $newQuantity) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => 'Insufficient stock available'
                    ], 400);
                }

                $existingItem->update([
                    'quantity' => $newQuantity,
                    'price' => $product->price, // Update price in case it changed
                ]);

                $cartItem = $existingItem;
            } else {
                // Create new cart item
                $cartItem = CartItem::create([
                    'user_id' => $userId,
                    'product_id' => $request->product_id,
                    'quantity' => $request->quantity,
                    'price' => $product->price,
                    'product_options' => $request->product_options,
                    'session_id' => $userId ? null : $sessionId,
                ]);
            }

            DB::commit();

            $cartItem->load(['product.images', 'product.brand', 'product.category']);

            return response()->json([
                'success' => true,
                'message' => 'Item added to cart successfully',
                'data' => $cartItem
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to add item to cart',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'quantity' => 'required|integer|min:1|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userId = Auth::id();
            $sessionId = null;
            if (!$userId) {
                $sessionId = $this->resolveGuestSessionId($request);
                if (!$sessionId) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Session not available for guest cart. Provide X-Session-Id header or enable cookies.'
                    ], 400);
                }
            }

            $cartItem = CartItem::where('id', $id);

            if ($userId) {
                $cartItem->where('user_id', $userId);
            } else {
                $cartItem->where('session_id', $sessionId);
            }

            $cartItem = $cartItem->first();

            if (!$cartItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart item not found'
                ], 404);
            }

            // Check stock availability
            if ($cartItem->product->stock_quantity < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient stock available'
                ], 400);
            }

            $cartItem->update([
                'quantity' => $request->quantity,
                'price' => $cartItem->product->price, // Update price in case it changed
            ]);

            $cartItem->load(['product.images', 'product.brand', 'product.category']);

            return response()->json([
                'success' => true,
                'message' => 'Cart item updated successfully',
                'data' => $cartItem
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update cart item',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove item from cart
     */
    public function remove(Request $request, $id): JsonResponse
    {
        try {
            $userId = Auth::id();
            $sessionId = null;
            if (!$userId) {
                $sessionId = $this->resolveGuestSessionId($request);
                if (!$sessionId) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Session not available for guest cart. Provide X-Session-Id header or enable cookies.'
                    ], 400);
                }
            }

            // Try treat {id} as cart item id first
            $cartItemQuery = CartItem::where('id', $id);
            if ($userId) {
                $cartItemQuery->where('user_id', $userId);
            } else {
                $cartItemQuery->where('session_id', $sessionId);
            }
            $cartItem = $cartItemQuery->first();

            // If not found, fallback to treat {id} as product_id for current owner (guest/user)
            if (!$cartItem) {
                $cartItemQuery = CartItem::where('product_id', $id);
                if ($userId) {
                    $cartItemQuery->where('user_id', $userId);
                } else {
                    $cartItemQuery->where('session_id', $sessionId);
                }
                $cartItem = $cartItemQuery->first();
            }

            if (!$cartItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart item not found'
                ], 404);
            }

            $cartItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Item removed from cart successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove item from cart',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clear entire cart
     */
    public function clear(Request $request): JsonResponse
    {
        try {
            $userId = Auth::id();
            $sessionId = null;
            if (!$userId) {
                $sessionId = $this->resolveGuestSessionId($request);
                if (!$sessionId) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Session not available for guest cart. Provide X-Session-Id header or enable cookies.'
                    ], 400);
                }
            }

            $query = CartItem::query();

            if ($userId) {
                $query->where('user_id', $userId);
            } else {
                $query->where('session_id', $sessionId);
            }

            $deletedCount = $query->delete();

            return response()->json([
                'success' => true,
                'message' => 'Cart cleared successfully',
                'data' => ['deleted_items' => $deletedCount]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear cart',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get cart summary (count and total)
     */
    public function summary(Request $request): JsonResponse
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
                        'message' => 'Session not available for guest cart. Ensure cookies/session middleware is enabled.'
                    ], 400);
                }
            }

            $query = CartItem::query();

            if ($userId) {
                $query->where('user_id', $userId);
            } else {
                $query->where('session_id', $sessionId);
            }

            $cartItems = $query->get();

            $totalItems = $cartItems->sum('quantity');
            $totalPrice = $cartItems->sum('total_price');

            return response()->json([
                'success' => true,
                'data' => [
                    'total_items' => $totalItems,
                    'total_price' => $totalPrice,
                    'item_count' => $cartItems->count(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get cart summary',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
