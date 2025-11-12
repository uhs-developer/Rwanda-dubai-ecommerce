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
        Schema::create('tax_rates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('country_code', 2);
            $table->string('state_code', 3)->nullable();
            $table->string('zip_code')->nullable();
            $table->boolean('zip_is_range')->default(false);
            $table->string('zip_from')->nullable();
            $table->string('zip_to')->nullable();
            $table->decimal('rate', 10, 4);
            $table->integer('priority')->default(0);
            $table->timestamps();

            $table->index(['tenant_id', 'country_code', 'state_code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tax_rates');
    }
};
