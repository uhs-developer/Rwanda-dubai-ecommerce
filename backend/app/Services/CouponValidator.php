<?php

namespace App\Services;

use App\Models\Coupon;
use App\Models\Cart;
use App\Models\User;

class CouponValidator
{
    public function validate(string $code, Cart $cart, User $user): array
    {
        $tenant = app('tenant');

        // Find coupon
        $coupon = Coupon::where('tenant_id', $tenant->id)
            ->where('code', $code)
            ->first();

        if (!$coupon) {
            return [
                'valid' => false,
                'message' => 'Coupon code not found.',
            ];
        }

        // Check if coupon is valid
        if (!$coupon->isValid()) {
            return [
                'valid' => false,
                'message' => 'This coupon is no longer valid.',
            ];
        }

        // Check minimum order amount
        if ($coupon->minimum_order_amount && $cart->subtotal < $coupon->minimum_order_amount) {
            return [
                'valid' => false,
                'message' => "Minimum order amount of {$coupon->minimum_order_amount} required.",
            ];
        }

        // Check usage per customer
        if ($coupon->usage_per_customer) {
            $userUsageCount = \DB::table('orders')
                ->where('tenant_id', $tenant->id)
                ->where('user_id', $user->id)
                ->where('coupon_code', $code)
                ->count();

            if ($userUsageCount >= $coupon->usage_per_customer) {
                return [
                    'valid' => false,
                    'message' => 'You have already used this coupon the maximum number of times.',
                ];
            }
        }

        // Evaluate conditions if present
        if ($coupon->conditions) {
            $conditionsResult = $this->evaluateConditions($coupon->conditions, $cart);
            if (!$conditionsResult['valid']) {
                return $conditionsResult;
            }
        }

        return [
            'valid' => true,
            'coupon' => $coupon,
            'discount' => $this->calculateDiscount($coupon, $cart),
        ];
    }

    protected function evaluateConditions(array $conditions, Cart $cart): array
    {
        // Placeholder for complex condition evaluation
        // In a real implementation, this would evaluate conditions like:
        // - Specific products in cart
        // - Specific categories
        // - Cart quantity thresholds
        // - Customer groups
        // etc.

        return ['valid' => true];
    }

    protected function calculateDiscount(Coupon $coupon, Cart $cart): float
    {
        $discount = 0;

        switch ($coupon->discount_type) {
            case 'percentage':
                $discount = $cart->subtotal * ($coupon->discount_amount / 100);
                break;

            case 'fixed_cart':
                $discount = $coupon->discount_amount;
                break;

            case 'fixed_product':
                // Apply fixed discount to each applicable product
                foreach ($cart->items as $item) {
                    $discount += $coupon->discount_amount * $item->quantity;
                }
                break;
        }

        // Apply maximum discount cap if set
        if ($coupon->maximum_discount_amount && $discount > $coupon->maximum_discount_amount) {
            $discount = $coupon->maximum_discount_amount;
        }

        // Discount cannot exceed cart subtotal
        if ($discount > $cart->subtotal) {
            $discount = $cart->subtotal;
        }

        return round($discount, 2);
    }
}
