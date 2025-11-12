<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * This migration creates a comprehensive shipment/logistics system with:
     * - Flexible shipping routes (e.g., Mombasa->Kampala->Kigali, Dar es Salaam->Kigali)
     * - Multiple shipping methods (Air Cargo, Sea Cargo, Land Transport)
     * - Dynamic pricing based on weight, volume, route, and method
     * - Customs pricing per route
     * - Magento-parity with flexible configuration
     */
    public function up(): void
    {
        // 1. Shipping Methods (Air Cargo, Sea Cargo, Land Transport, etc.)
        Schema::create('shipping_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->onDelete('cascade');
            $table->string('name'); // e.g., "Air Cargo", "Sea Freight", "Express Land"
            $table->string('code')->unique(); // e.g., "air_cargo", "sea_freight"
            $table->text('description')->nullable();
            $table->string('carrier')->nullable(); // e.g., "DHL", "Maersk", "Custom"
            $table->enum('type', ['air', 'sea', 'land', 'express'])->default('land');
            $table->decimal('base_price', 10, 2)->default(0); // Base price
            $table->integer('estimated_days_min')->nullable(); // Min delivery days
            $table->integer('estimated_days_max')->nullable(); // Max delivery days
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->json('metadata')->nullable(); // For additional configuration
            $table->timestamps();

            $table->index(['tenant_id', 'is_active']);
            $table->index('code');
        });

        // 2. Shipping Routes (e.g., Dubai->Mombasa->Kampala->Kigali)
        Schema::create('shipping_routes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->onDelete('cascade');
            $table->string('name'); // e.g., "Dubai to Kigali via Mombasa"
            $table->string('code')->unique(); // e.g., "dubai_mombasa_kampala_kigali"
            $table->string('origin_country'); // e.g., "AE" (UAE)
            $table->string('origin_city')->nullable(); // e.g., "Dubai"
            $table->string('destination_country'); // e.g., "RW" (Rwanda)
            $table->string('destination_city')->nullable(); // e.g., "Kigali"
            $table->json('transit_points')->nullable(); // ["Mombasa", "Kampala"] - ordered list
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'is_active']);
            $table->index(['origin_country', 'destination_country']);
        });

        // 3. Shipping Method Route Pricing (Price per method per route)
        Schema::create('shipping_method_route_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->onDelete('cascade');
            $table->foreignId('shipping_method_id')->constrained()->onDelete('cascade');
            $table->foreignId('shipping_route_id')->constrained()->onDelete('cascade');

            // Weight-based pricing
            $table->decimal('price_per_kg', 10, 2)->default(0);
            $table->decimal('min_weight_kg', 10, 2)->nullable();
            $table->decimal('max_weight_kg', 10, 2)->nullable();

            // Volume-based pricing (CBM = Cubic Meter)
            $table->decimal('price_per_cbm', 10, 2)->default(0);
            $table->decimal('min_volume_cbm', 10, 2)->nullable();
            $table->decimal('max_volume_cbm', 10, 2)->nullable();

            // Flat rate pricing (for specific weight/volume ranges)
            $table->decimal('flat_rate', 10, 2)->nullable();

            // Additional costs
            $table->decimal('handling_fee', 10, 2)->default(0);
            $table->decimal('fuel_surcharge_percentage', 5, 2)->default(0); // e.g., 15.5%
            $table->decimal('insurance_percentage', 5, 2)->default(0); // e.g., 2%

            // Customs costs (can vary by route)
            $table->decimal('customs_clearance_fee', 10, 2)->default(0);
            $table->decimal('customs_duty_percentage', 5, 2)->default(0); // e.g., 25%
            $table->decimal('customs_vat_percentage', 5, 2)->default(0); // e.g., 18%

            // Delivery timeframe for this specific method+route combo
            $table->integer('estimated_days_min')->nullable();
            $table->integer('estimated_days_max')->nullable();

            $table->boolean('is_active')->default(true);
            $table->json('metadata')->nullable(); // For additional pricing rules
            $table->timestamps();

            $table->unique(['shipping_method_id', 'shipping_route_id', 'min_weight_kg', 'max_weight_kg'], 'method_route_weight_unique');
            $table->index(['tenant_id', 'is_active']);
        });

        // 4. Customs Zones (for different customs regulations)
        Schema::create('customs_zones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->onDelete('cascade');
            $table->string('name'); // e.g., "EAC (East African Community)", "COMESA"
            $table->string('code')->unique(); // e.g., "eac", "comesa"
            $table->json('countries'); // ["RW", "KE", "UG", "TZ", "BI", "SS"]
            $table->text('description')->nullable();
            $table->decimal('default_duty_percentage', 5, 2)->default(0);
            $table->decimal('default_vat_percentage', 5, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'is_active']);
        });

        // 5. Product Category Customs Rates (different products have different customs rates)
        Schema::create('product_category_customs_rates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('customs_zone_id')->constrained()->onDelete('cascade');
            $table->string('hs_code')->nullable(); // Harmonized System code
            $table->decimal('duty_percentage', 5, 2)->default(0);
            $table->decimal('vat_percentage', 5, 2)->default(0);
            $table->decimal('excise_duty_percentage', 5, 2)->default(0);
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['category_id', 'customs_zone_id'], 'category_customs_zone_unique');
            $table->index(['tenant_id', 'is_active']);
        });

        // 6. Shipment Carriers (Logistics companies)
        Schema::create('shipment_carriers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->onDelete('cascade');
            $table->string('name'); // e.g., "TechBridge Logistics", "DHL", "FedEx"
            $table->string('code')->unique();
            $table->string('website')->nullable();
            $table->string('tracking_url')->nullable(); // URL template for tracking
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'is_active']);
        });

        // 7. Order Shipments (actual shipments for orders)
        Schema::create('order_shipments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->onDelete('cascade');
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('shipping_method_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('shipping_route_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('shipment_carrier_id')->nullable()->constrained()->onDelete('set null');

            $table->string('tracking_number')->unique()->nullable();
            $table->string('status')->default('pending'); // pending, processing, in_transit, customs, delivered, cancelled

            // Weight and volume
            $table->decimal('total_weight_kg', 10, 2)->nullable();
            $table->decimal('total_volume_cbm', 10, 2)->nullable();

            // Costs breakdown
            $table->decimal('shipping_cost', 10, 2)->default(0);
            $table->decimal('handling_fee', 10, 2)->default(0);
            $table->decimal('fuel_surcharge', 10, 2)->default(0);
            $table->decimal('insurance_cost', 10, 2)->default(0);
            $table->decimal('customs_duty', 10, 2)->default(0);
            $table->decimal('customs_vat', 10, 2)->default(0);
            $table->decimal('customs_clearance_fee', 10, 2)->default(0);
            $table->decimal('total_cost', 10, 2)->default(0);

            // Tracking
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('in_transit_at')->nullable();
            $table->timestamp('customs_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('estimated_delivery_at')->nullable();

            $table->text('notes')->nullable();
            $table->json('tracking_history')->nullable(); // Array of tracking events
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'order_id']);
            $table->index(['status', 'shipped_at']);
            $table->index('tracking_number');
        });

        // 8. Shipment Items (items in each shipment)
        Schema::create('order_shipment_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_shipment_id')->constrained()->onDelete('cascade');
            $table->foreignId('order_item_id')->constrained()->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->decimal('weight_kg', 10, 2)->nullable();
            $table->decimal('volume_cbm', 10, 2)->nullable();
            $table->timestamps();

            $table->index('order_shipment_id');
        });

        // 9. Shipping Zones (for zone-based shipping - Magento-style)
        Schema::create('shipping_zones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->onDelete('cascade');
            $table->string('name'); // e.g., "East Africa", "Europe", "Middle East"
            $table->string('code')->unique();
            $table->json('countries'); // Array of country codes
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'is_active']);
        });

        // 10. Shipping Rate Tables (for complex rate calculations)
        Schema::create('shipping_rate_tables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->onDelete('cascade');
            $table->foreignId('shipping_zone_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('shipping_method_id')->constrained()->onDelete('cascade');

            $table->string('condition_type'); // weight, price, qty, volume
            $table->decimal('condition_from', 10, 2);
            $table->decimal('condition_to', 10, 2)->nullable();
            $table->decimal('price', 10, 2);
            $table->string('price_type')->default('fixed'); // fixed, percentage

            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['tenant_id', 'shipping_method_id', 'is_active'], 'ship_rate_tbl_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping_rate_tables');
        Schema::dropIfExists('shipping_zones');
        Schema::dropIfExists('order_shipment_items');
        Schema::dropIfExists('order_shipments');
        Schema::dropIfExists('shipment_carriers');
        Schema::dropIfExists('product_category_customs_rates');
        Schema::dropIfExists('customs_zones');
        Schema::dropIfExists('shipping_method_route_prices');
        Schema::dropIfExists('shipping_routes');
        Schema::dropIfExists('shipping_methods');
    }
};
