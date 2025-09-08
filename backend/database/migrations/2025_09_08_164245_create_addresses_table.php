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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['home', 'work', 'other'])->default('home');
            $table->boolean('is_default')->default(false);
            $table->string('name');
            $table->string('company')->nullable();
            $table->string('street');
            $table->string('apartment')->nullable();
            $table->string('city');
            $table->string('district');
            $table->string('country');
            $table->string('phone');
            $table->string('postal_code')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index(['user_id', 'is_default']);
            $table->index(['user_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
