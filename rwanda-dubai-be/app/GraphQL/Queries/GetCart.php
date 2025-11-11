<?php

namespace App\GraphQL\Queries;

use App\Models\Cart;
use Illuminate\Support\Facades\Auth;

class GetCart
{
    public function __invoke($_, array $args)
    {
        $tenant = app('tenant');
        $user = Auth::user();

        $cart = Cart::where('tenant_id', $tenant->id)
            ->where(function ($query) use ($user) {
                if ($user) {
                    $query->where('user_id', $user->id);
                } else {
                    $query->where('session_id', session()->getId());
                }
            })
            ->whereNull('converted_at')
            ->with('items.product')
            ->first();

        if (!$cart) {
            // Return empty cart structure
            $cart = new Cart([
                'tenant_id' => $tenant->id,
                'user_id' => $user?->id,
                'session_id' => $user ? null : session()->getId(),
                'currency' => 'USD',
                'subtotal' => 0,
                'tax_amount' => 0,
                'shipping_amount' => 0,
                'discount_amount' => 0,
                'grand_total' => 0,
            ]);
            $cart->setRelation('items', collect());
        }

        return $cart;
    }
}
