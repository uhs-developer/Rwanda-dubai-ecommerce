<?php

namespace App\GraphQL\Mutations;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PlaceOrder
{
    public function __invoke($_, array $args)
    {
        $tenant = app('tenant');
        $user = Auth::guard('sanctum')->user();

        if (!$user) {
            throw new \Exception('You must be logged in to place an order');
        }

        // Get active cart
        $cart = Cart::where('tenant_id', $tenant->id)
            ->where('user_id', $user->id)
            ->whereNull('converted_at')
            ->with('items.product')
            ->firstOrFail();

        if ($cart->items->isEmpty()) {
            throw new \Exception('Your cart is empty');
        }

        return DB::transaction(function () use ($cart, $user, $args, $tenant) {
            // Create order
            $order = Order::create([
                'tenant_id' => $tenant->id,
                'user_id' => $user->id,
                'order_number' => Order::generateOrderNumber(),
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => $args['payment_method'] ?? null,
                'shipping_method' => $cart->shipping_method ?? $args['shipping_method'] ?? null,
                'customer_email' => $user->email,
                'customer_first_name' => explode(' ', $user->name)[0] ?? $user->name,
                'customer_last_name' => explode(' ', $user->name)[1] ?? '',
                'billing_address' => $args['billing_address'],
                'shipping_address' => $args['shipping_address'],
                'subtotal' => $cart->subtotal,
                'discount_amount' => $cart->discount_amount,
                'tax_amount' => $cart->tax_amount,
                'shipping_amount' => $cart->shipping_amount,
                'grand_total' => $cart->grand_total,
                'currency' => $cart->currency,
                'coupon_code' => $cart->coupon_code,
                'customer_note' => $args['customer_note'] ?? null,
            ]);

            // Copy cart items to order items
            foreach ($cart->items as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'sku' => $cartItem->sku,
                    'name' => $cartItem->name,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->price,
                    'row_total' => $cartItem->row_total,
                    'tax_amount' => $cartItem->tax_amount,
                    'discount_amount' => $cartItem->discount_amount,
                    'custom_options' => $cartItem->custom_options,
                ]);
            }

            // Mark cart as converted
            $cart->converted_at = now();
            $cart->save();

            // Log order placement
            AuditLog::logEvent('order_placed', $order, null, [
                'order_number' => $order->order_number,
                'grand_total' => $order->grand_total,
                'items_count' => $order->items->count(),
            ], "Order {$order->order_number} placed by {$user->email}");

            return $order->load('items.product');
        });
    }
}
