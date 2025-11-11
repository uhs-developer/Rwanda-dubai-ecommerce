<?php

namespace App\GraphQL\Mutations;

use App\Models\CartItem;
use Illuminate\Support\Facades\Auth;

class RemoveCartItem
{
    public function __invoke($_, array $args)
    {
        $tenant = app('tenant');
        $user = Auth::user();

        $cartItem = CartItem::whereHas('cart', function ($query) use ($tenant, $user) {
            $query->where('tenant_id', $tenant->id)
                ->whereNull('converted_at');

            if ($user) {
                $query->where('user_id', $user->id);
            } else {
                $query->where('session_id', session()->getId());
            }
        })
            ->where('id', $args['cart_item_id'])
            ->firstOrFail();

        $cart = $cartItem->cart;
        $cartItem->delete();

        // Recalculate cart totals
        $cart->load('items');
        $cart->calculateTotals();

        return $cart->load('items.product');
    }
}
