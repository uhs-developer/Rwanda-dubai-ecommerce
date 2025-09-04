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
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('promotional_price', 10, 2)->nullable()->after('price');
            $table->json('active_promotions')->nullable()->after('promotional_price');
            $table->timestamp('promotion_updated_at')->nullable()->after('active_promotions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['promotional_price', 'active_promotions', 'promotion_updated_at']);
        });
    }
};
