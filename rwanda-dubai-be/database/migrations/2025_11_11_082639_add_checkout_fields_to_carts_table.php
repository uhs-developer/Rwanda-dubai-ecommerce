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
        Schema::table('carts', function (Blueprint $table) {
            $table->foreignId('shipping_address_id')->nullable()->after('user_id')->constrained('addresses')->nullOnDelete();
            $table->foreignId('billing_address_id')->nullable()->after('shipping_address_id')->constrained('addresses')->nullOnDelete();
            $table->foreignId('shipping_method_id')->nullable()->after('shipping_amount')->constrained('shipping_methods')->nullOnDelete();
            $table->string('shipping_method_name')->nullable()->after('shipping_method_id');
            $table->string('payment_method')->nullable()->after('shipping_method_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('carts', function (Blueprint $table) {
            $table->dropForeign(['shipping_address_id']);
            $table->dropForeign(['billing_address_id']);
            $table->dropForeign(['shipping_method_id']);
            $table->dropColumn(['shipping_address_id', 'billing_address_id', 'shipping_method_id', 'shipping_method_name', 'payment_method']);
        });
    }
};
