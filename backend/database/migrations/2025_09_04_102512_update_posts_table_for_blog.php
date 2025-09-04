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
        Schema::table('posts', function (Blueprint $table) {
            $table->string('slug')->unique()->after('title');
            $table->text('excerpt')->nullable()->after('body');
            $table->longText('content')->nullable()->after('excerpt');
            $table->string('cover_image')->nullable()->after('content'); // Cloudinary URL
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft')->after('cover_image');
            $table->timestamp('published_at')->nullable()->after('status');
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade')->after('published_at');
            $table->json('meta_data')->nullable()->after('author_id'); // SEO meta, tags, etc.
            $table->integer('views_count')->default(0)->after('meta_data');
            $table->integer('comments_count')->default(0)->after('views_count');
            
            // Rename body to content if it exists
            if (Schema::hasColumn('posts', 'body')) {
                $table->dropColumn('body');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn([
                'slug', 'excerpt', 'content', 'cover_image', 'status', 
                'published_at', 'author_id', 'meta_data', 'views_count', 'comments_count'
            ]);
            $table->text('body')->nullable();
        });
    }
};