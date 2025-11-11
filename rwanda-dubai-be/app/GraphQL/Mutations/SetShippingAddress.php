<?php

namespace App\GraphQL\Mutations;

use App\Models\Cart;
use App\Models\Address;
use Illuminate\Support\Facades\Auth;

class SetShippingAddress
{
    public function __invoke($_, array $args)
    {
        $tenant = app('tenant');
        $user = Auth::guard('sanctum')->user();

        if (!$user) {
            throw new \Exception('You must be logged in to set shipping address');
        }

        // Get or create cart
        $cart = Cart::where('tenant_id', $tenant->id)
            ->where('user_id', $user->id)
            ->whereNull('converted_at')
            ->firstOrFail();

        // Create or update shipping address
        $address = Address::updateOrCreate(
            [
                'tenant_id' => $tenant->id,
                'user_id' => $user->id,
                'type' => 'shipping',
                'is_default' => true,
            ],
            [
                'first_name' => $args['input']['first_name'],
                'last_name' => $args['input']['last_name'],
                'company' => $args['input']['company'] ?? null,
                'street_address' => $args['input']['street_address'],
                'street_address_2' => $args['input']['street_address_2'] ?? null,
                'city' => $args['input']['city'],
                'state_province' => $args['input']['state_province'],
                'postal_code' => $args['input']['postal_code'],
                'country' => $args['input']['country'],
                'phone' => $args['input']['phone'],
            ]
        );

        return $cart->load('items.product');
    }
}
