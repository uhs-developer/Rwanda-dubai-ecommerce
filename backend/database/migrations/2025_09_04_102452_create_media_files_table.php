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
        Schema::create('media_files', function (Blueprint $table) {
            $table->id();
            $table->string('public_id')->unique(); // Cloudinary public ID
            $table->string('file_name');
            $table->string('original_name');
            $table->string('mime_type');
            $table->bigInteger('file_size'); // in bytes
            $table->string('url'); // Cloudinary URL
            $table->string('secure_url'); // Cloudinary secure URL
            $table->string('format'); // jpg, png, mp4, etc.
            $table->integer('width')->nullable(); // for images/videos
            $table->integer('height')->nullable(); // for images/videos
            $table->string('resource_type'); // image, video, raw
            $table->json('metadata')->nullable(); // additional Cloudinary metadata
            $table->foreignId('uploaded_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            
            $table->index(['resource_type', 'format']);
            $table->index('uploaded_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_files');
    }
};