<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('returns', function (Blueprint $table) {
            $table->id();
            $table->string('return_number')->unique();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('order_id')->nullable();
            $table->integer('quantity')->default(1);
            $table->decimal('refund_amount', 10, 2)->default(0);
            $table->enum('status', ['pending', 'approved', 'rejected', 'processing', 'completed'])->default('pending');
            $table->enum('reason', ['defective', 'wrong_item', 'not_as_described', 'changed_mind', 'damaged_shipping', 'other'])->default('other');
            $table->text('description')->nullable();
            $table->text('admin_notes')->nullable();
            $table->string('return_method')->default('refund');
            $table->timestamp('requested_at');
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('returns');
    }
};



