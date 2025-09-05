<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some products and users
        $products = Product::limit(10)->get();
        $users = User::limit(5)->get();

        if ($products->isEmpty() || $users->isEmpty()) {
            $this->command->warn('No products or users found. Please run product and user seeders first.');
            return;
        }

        $statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        $paymentMethods = ['credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'];

        for ($i = 1; $i <= 20; $i++) {
            $user = $users->random();
            $isPaid = rand(0, 1);
            $status = $statuses[array_rand($statuses)];
            
            $order = Order::create([
                'order_number' => 'ORD-' . str_pad($i, 6, '0', STR_PAD_LEFT),
                'user_id' => $user->id,
                'customer_name' => $user->name,
                'customer_email' => $user->email,
                'customer_phone' => '+250' . rand(100000000, 999999999),
                'shipping_address' => "Street {$i}, Kigali, Rwanda",
                'billing_address' => "Street {$i}, Kigali, Rwanda",
                'subtotal' => 0, // Will be calculated
                'tax_amount' => 0,
                'shipping_amount' => rand(0, 50),
                'discount_amount' => rand(0, 100),
                'total_amount' => 0, // Will be calculated
                'currency' => 'USD',
                'status' => $status,
                'is_paid' => $isPaid,
                'payment_method' => $isPaid ? $paymentMethods[array_rand($paymentMethods)] : null,
                'payment_reference' => $isPaid ? 'PAY-' . rand(100000, 999999) : null,
                'paid_at' => $isPaid ? now()->subDays(rand(0, 30)) : null,
                'shipped_at' => in_array($status, ['shipped', 'delivered']) ? now()->subDays(rand(0, 20)) : null,
                'delivered_at' => $status === 'delivered' ? now()->subDays(rand(0, 10)) : null,
                'notes' => "Order notes for order #{$i}",
            ]);

            // Create order items
            $itemCount = rand(1, 4);
            $subtotal = 0;
            
            for ($j = 0; $j < $itemCount; $j++) {
                $product = $products->random();
                $quantity = rand(1, 3);
                $unitPrice = $product->effective_price;
                $totalPrice = $unitPrice * $quantity;
                $subtotal += $totalPrice;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'unit_price' => $unitPrice,
                    'quantity' => $quantity,
                    'total_price' => $totalPrice,
                    'product_metadata' => [
                        'name' => $product->name,
                        'slug' => $product->slug,
                        'image' => $product->primary_image,
                    ],
                ]);
            }

            // Update order totals
            $taxAmount = $subtotal * 0.18; // 18% tax
            $totalAmount = $subtotal + $taxAmount + $order->shipping_amount - $order->discount_amount;

            $order->update([
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total_amount' => max(0, $totalAmount), // Ensure non-negative
            ]);
        }

        $this->command->info('Created 20 sample orders with items.');
    }
}
