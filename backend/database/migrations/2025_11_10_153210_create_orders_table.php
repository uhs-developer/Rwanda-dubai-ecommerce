<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('order_number')->unique();
            $table->enum('status', ['pending', 'processing', 'complete', 'cancelled', 'on_hold', 'refunded'])->default('pending');
            $table->enum('payment_status', ['pending', 'authorized', 'paid', 'partially_refunded', 'refunded', 'failed'])->default('pending');
            $table->string('payment_method')->nullable();
            $table->string('shipping_method')->nullable();

            // Customer info (denormalized for historical data)
            $table->string('customer_email');
            $table->string('customer_first_name');
            $table->string('customer_last_name');

            // Billing address (denormalized)
            $table->json('billing_address');

            // Shipping address (denormalized)
            $table->json('shipping_address');

            // Totals
            $table->decimal('subtotal', 10, 2);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('shipping_amount', 10, 2)->default(0);
            $table->decimal('grand_total', 10, 2);
            $table->string('currency', 3)->default('USD');

            // Discounts
            $table->string('coupon_code')->nullable();

            // Notes
            $table->text('customer_note')->nullable();
            $table->text('admin_note')->nullable();

            $table->timestamp('paid_at')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();

            $table->timestamps();

            $table->index(['tenant_id', 'status']);
            $table->index(['tenant_id', 'user_id']);
            $table->index(['tenant_id', 'order_number']);
            $table->index('customer_email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
