<?php

namespace App\GraphQL\Mutations;

use App\Models\Cart;
use App\Models\ShippingMethod;
use App\Models\Address;
use App\Services\ShippingCalculator;
use Illuminate\Support\Facades\Auth;

class SetShippingMethod
{
    public function __invoke($_, array $args)
    {
        $tenant = app('tenant');
        $user = Auth::guard('sanctum')->user();

        if (!$user) {
            throw new \Exception('You must be logged in to set shipping method');
        }

        $cart = Cart::where('tenant_id', $tenant->id)
            ->where('user_id', $user->id)
            ->whereNull('converted_at')
            ->firstOrFail();

        // Verify shipping method exists and is active
        $shippingMethod = ShippingMethod::where('tenant_id', $tenant->id)
            ->where('id', $args['shipping_method_id'])
            ->where('is_active', true)
            ->firstOrFail();

        // Get shipping address
        $shippingAddress = Address::where('tenant_id', $tenant->id)
            ->where('user_id', $user->id)
            ->where('type', 'shipping')
            ->where('is_default', true)
            ->first();

        if (!$shippingAddress) {
            throw new \Exception('Please set shipping address first');
        }

        // Calculate shipping cost
        $calculator = new ShippingCalculator();
        $availableMethods = $calculator->getAvailableMethods($cart, $shippingAddress);

        $selectedMethod = collect($availableMethods)->firstWhere('method_id', $args['shipping_method_id']);

        if (!$selectedMethod) {
            throw new \Exception('Selected shipping method is not available for your address');
        }

        $cart->shipping_method_id = $shippingMethod->id;
        $cart->shipping_method_name = $shippingMethod->name;
        $cart->shipping_amount = $selectedMethod['price'];
        $cart->save();

        return $cart->load('items.product');
    }
}
