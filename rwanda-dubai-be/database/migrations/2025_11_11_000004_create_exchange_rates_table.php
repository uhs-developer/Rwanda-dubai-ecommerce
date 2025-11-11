<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('exchange_rates', function (Blueprint $table) {
            $table->id();
            $table->string('code_from', 8);
            $table->string('code_to', 8);
            $table->decimal('rate', 18, 6);
            $table->timestamps();
            $table->unique(['code_from', 'code_to']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exchange_rates');
    }
};


