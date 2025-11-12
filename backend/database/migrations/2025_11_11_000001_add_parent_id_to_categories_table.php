<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            if (!Schema::hasColumn('categories', 'parent_id')) {
                $table->unsignedBigInteger('parent_id')->nullable()->after('image');
                $table->index('parent_id', 'categories_parent_id_index');
                $table->foreign('parent_id')
                    ->references('id')
                    ->on('categories')
                    ->onDelete('set null');
            }
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            if (Schema::hasColumn('categories', 'parent_id')) {
                $table->dropForeign(['parent_id']);
                $table->dropIndex('categories_parent_id_index');
                $table->dropColumn('parent_id');
            }
        });
    }
};


