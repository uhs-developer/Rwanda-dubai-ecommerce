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
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->decimal('price', 10, 2); // Store price at time of adding to cart
            $table->json('product_options')->nullable(); // For variations, customizations, etc.
            $table->string('session_id')->nullable(); // For guest users
            $table->timestamps();

            // Ensure unique combination of user/product or session/product
            $table->unique(['user_id', 'product_id'], 'unique_user_product');
            $table->unique(['session_id', 'product_id'], 'unique_session_product');
            
            // Indexes for performance
            $table->index(['user_id', 'created_at']);
            $table->index(['session_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
