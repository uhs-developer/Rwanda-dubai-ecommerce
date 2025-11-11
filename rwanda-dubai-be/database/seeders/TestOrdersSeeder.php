<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Invoice;
use App\Models\Address;
use App\Models\User;
use App\Models\Product;
use App\Models\Tenant;
use Illuminate\Support\Facades\DB;

class TestOrdersSeeder extends Seeder
{
    public function run(): void
    {
        // Get the first tenant
        $tenant = Tenant::first();
        if (!$tenant) {
            $this->command->warn('No tenant found. Please run TenantSeeder first.');
            return;
        }

        // Get a test user (or create one)
        $user = User::first();
        if (!$user) {
            $user = User::create([
                'name' => 'Test Customer',
                'email' => 'customer@test.com',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]);
        }

        // Get some products
        $products = Product::take(5)->get();
        
        if ($products->isEmpty()) {
            $this->command->warn('No products found. Please seed products first.');
            return;
        }

        $statuses = ['pending', 'processing', 'complete', 'cancelled'];
        $paymentStatuses = ['pending', 'paid', 'failed'];

        // Create 10 test orders
        for ($i = 1; $i <= 10; $i++) {
            $status = $statuses[array_rand($statuses)];
            $paymentStatus = $paymentStatuses[array_rand($paymentStatuses)];
            
            $subtotal = 0;
            
            $order = Order::create([
                'tenant_id' => $tenant->id,
                'user_id' => $user->id,
                'order_number' => 'ORD-' . now()->format('ymd') . '-' . str_pad(rand(1, 99999), 5, '0', STR_PAD_LEFT),
                'status' => $status,
                'payment_status' => $paymentStatus,
                'payment_method' => ['credit_card', 'paypal', 'bank_transfer'][array_rand(['credit_card', 'paypal', 'bank_transfer'])],
                'shipping_method' => 'Air Freight',
                'customer_email' => $user->email,
                'customer_first_name' => $user->name ?? 'John',
                'customer_last_name' => 'Doe',
                'billing_address' => [
                    'street' => '123 Main St',
                    'city' => 'Kigali',
                    'state' => 'Kigali City',
                    'zip' => '10001',
                    'country' => 'RW',
                ],
                'shipping_address' => [
                    'street' => '123 Main St',
                    'city' => 'Kigali',
                    'state' => 'Kigali City',
                    'zip' => '10001',
                    'country' => 'RW',
                ],
                'subtotal' => 0, // Will update after items
                'shipping_amount' => rand(50, 200),
                'tax_amount' => 0, // Will calculate
                'discount_amount' => 0,
                'grand_total' => 0, // Will calculate
                'currency' => 'RWF',
                'customer_note' => "Test order #$i",
                'created_at' => now()->subDays(rand(1, 30)),
            ]);

            // Add 1-3 items per order
            $itemCount = rand(1, 3);
            foreach ($products->random($itemCount) as $product) {
                $quantity = rand(1, 3);
                $price = $product->price ?? rand(10000, 100000);
                $itemTotal = $price * $quantity;
                $subtotal += $itemTotal;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku ?? 'SKU-' . $product->id,
                    'quantity' => $quantity,
                    'price' => $price,
                    'row_total' => $itemTotal,
                ]);
            }

            // Calculate totals
            $tax = $subtotal * 0.18; // 18% VAT
            $grandTotal = $subtotal + $order->shipping_amount + $tax;

            $order->update([
                'subtotal' => $subtotal,
                'tax_amount' => $tax,
                'grand_total' => $grandTotal,
            ]);

            // Create invoice for paid orders
            if ($paymentStatus === 'paid' || $status === 'complete') {
                Invoice::create([
                    'order_id' => $order->id,
                    'invoice_number' => 'INV-' . now()->format('ymd') . '-' . str_pad(rand(1, 99999), 5, '0', STR_PAD_LEFT),
                    'status' => 'paid',
                    'subtotal' => $subtotal,
                    'shipping_amount' => $order->shipping_amount,
                    'tax_amount' => $tax,
                    'discount_amount' => 0,
                    'grand_total' => $grandTotal,
                    'paid_at' => now(),
                    'created_at' => $order->created_at,
                ]);
            }
        }

        $this->command->info('Created 10 test orders with invoices!');
    }
}

