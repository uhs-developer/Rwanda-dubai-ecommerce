<?php

namespace App\GraphQL\Mutations;

use App\Models\Cart;
use Illuminate\Support\Facades\Auth;

class SetPaymentMethod
{
    public function __invoke($_, array $args)
    {
        $tenant = app('tenant');
        $user = Auth::guard('sanctum')->user();

        if (!$user) {
            throw new \Exception('You must be logged in to set payment method');
        }

        $cart = Cart::where('tenant_id', $tenant->id)
            ->where('user_id', $user->id)
            ->whereNull('converted_at')
            ->firstOrFail();

        $allowedMethods = ['credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'];

        if (!in_array($args['payment_method'], $allowedMethods)) {
            throw new \Exception('Invalid payment method');
        }

        $cart->payment_method = $args['payment_method'];
        $cart->save();

        return $cart->load('items.product');
    }
}
