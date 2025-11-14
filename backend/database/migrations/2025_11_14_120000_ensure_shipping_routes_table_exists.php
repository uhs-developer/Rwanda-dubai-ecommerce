<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create shipping_routes table if missing to fix inconsistent DB state.
     */
    public function up(): void
    {
        if (!Schema::hasTable('shipping_routes')) {
            Schema::create('shipping_routes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('tenant_id')->nullable()->constrained('tenants')->onDelete('cascade');
                $table->string('name');
                $table->string('code')->unique();
                $table->string('origin_country');
                $table->string('origin_city')->nullable();
                $table->string('destination_country');
                $table->string('destination_city')->nullable();
                $table->json('transit_points')->nullable();
                $table->text('description')->nullable();
                $table->boolean('is_active')->default(true);
                $table->integer('sort_order')->default(0);
                $table->json('metadata')->nullable();
                $table->timestamps();
                $table->index(['tenant_id', 'is_active']);
                $table->index(['origin_country', 'destination_country']);
            });
        }
    }

    /**
     * Do not drop if other tables depend on it; leave as-is on down.
     */
    public function down(): void
    {
        // Intentionally empty to avoid breaking FKs in inconsistent environments.
    }
};


