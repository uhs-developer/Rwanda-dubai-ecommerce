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
        Schema::create('tax_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tax_rate_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_tax_class_id')->nullable()->constrained('tax_classes')->nullOnDelete();
            $table->foreignId('customer_tax_class_id')->nullable()->constrained('tax_classes')->nullOnDelete();
            $table->integer('priority')->default(0);
            $table->integer('position')->default(0);
            $table->boolean('calculate_subtotal')->default(false);
            $table->timestamps();

            $table->index(['tenant_id', 'product_tax_class_id', 'customer_tax_class_id'], 'tax_rules_composite_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tax_rules');
    }
};
