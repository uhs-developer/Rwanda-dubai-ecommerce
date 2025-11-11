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
        Schema::create('cart_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->dateTime('valid_from')->nullable();
            $table->dateTime('valid_to')->nullable();
            $table->integer('uses_per_coupon')->nullable();
            $table->integer('uses_per_customer')->nullable();
            $table->integer('times_used')->default(0);
            $table->integer('priority')->default(0);
            $table->boolean('stop_rules_processing')->default(false);
            $table->enum('discount_type', ['percentage', 'fixed_cart', 'fixed_product', 'buy_x_get_y'])->default('percentage');
            $table->decimal('discount_amount', 10, 2);
            $table->integer('discount_qty')->nullable();
            $table->decimal('discount_step', 10, 2)->nullable();
            $table->decimal('maximum_discount_amount', 10, 2)->nullable();
            $table->boolean('apply_to_shipping')->default(false);
            $table->boolean('free_shipping')->default(false);
            $table->json('conditions')->nullable();
            $table->json('actions')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'is_active', 'valid_from', 'valid_to']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_rules');
    }
};
