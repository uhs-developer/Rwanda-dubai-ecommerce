<?php

namespace App\GraphQL\Mutations;

use App\Models\Cart;
use App\Services\CouponValidator;
use Illuminate\Support\Facades\Auth;

class ApplyCoupon
{
    public function __invoke($_, array $args)
    {
        $tenant = app('tenant');
        $user = Auth::guard('sanctum')->user();

        if (!$user) {
            throw new \Exception('You must be logged in to apply coupon');
        }

        $cart = Cart::where('tenant_id', $tenant->id)
            ->where('user_id', $user->id)
            ->whereNull('converted_at')
            ->firstOrFail();

        $validator = new CouponValidator();
        $result = $validator->validate($args['code'], $cart, $user);

        if (!$result['valid']) {
            throw new \Exception($result['message']);
        }

        $coupon = $result['coupon'];

        $cart->coupon_code = $coupon->code;
        $cart->discount_amount = $result['discount'];
        $cart->save();

        // Increment coupon usage
        $coupon->increment('times_used');

        return $cart->load('items.product');
    }
}
