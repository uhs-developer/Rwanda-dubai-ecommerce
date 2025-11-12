<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('subcategory_product')) {
            Schema::create('subcategory_product', function (Blueprint $table) {
                $table->unsignedBigInteger('subcategory_id');
                $table->unsignedBigInteger('product_id');
                $table->primary(['subcategory_id', 'product_id']);
                $table->foreign('subcategory_id')->references('id')->on('subcategories')->onDelete('cascade');
                $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
                $table->index(['product_id', 'subcategory_id'], 'subcategory_product_product_subcategory_idx');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('subcategory_product');
    }
};


