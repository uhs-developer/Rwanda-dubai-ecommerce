<?php

namespace App\GraphQL\Mutations;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class AddToCart
{
    public function __invoke($_, array $args)
    {
        $tenant = app('tenant');
        $user = Auth::user();

        // Get or create cart
        $cart = Cart::where('tenant_id', $tenant->id)
            ->where(function ($query) use ($user) {
                if ($user) {
                    $query->where('user_id', $user->id);
                } else {
                    $query->where('session_id', session()->getId());
                }
            })
            ->whereNull('converted_at')
            ->first();

        if (!$cart) {
            $cart = Cart::create([
                'tenant_id' => $tenant->id,
                'user_id' => $user?->id,
                'session_id' => $user ? null : session()->getId(),
                'currency' => 'USD',
            ]);
        }

        // Get product
        $product = Product::where('tenant_id', $tenant->id)
            ->where('id', $args['product_id'])
            ->where('is_active', true)
            ->where('in_stock', true)
            ->firstOrFail();

        // Check if item already exists in cart
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            // Update quantity
            $cartItem->quantity += $args['quantity'];
            $cartItem->save();
        } else {
            // Add new item
            $cartItem = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'sku' => $product->sku,
                'name' => $product->name,
                'quantity' => $args['quantity'],
                'price' => $product->price,
                'row_total' => $product->price * $args['quantity'],
                'custom_options' => $args['custom_options'] ?? null,
            ]);
        }

        // Recalculate cart totals
        $cart->load('items');
        $cart->calculateTotals();

        return $cart->load('items.product');
    }
}
