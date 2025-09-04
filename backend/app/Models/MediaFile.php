<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MediaFile extends Model
{
    protected $fillable = [
        'public_id',
        'file_name',
        'original_name',
        'mime_type',
        'file_size',
        'url',
        'secure_url',
        'format',
        'width',
        'height',
        'resource_type',
        'metadata',
        'uploaded_by',
        'product_id',
        'usage_type'
    ];

    protected $casts = [
        'metadata' => 'array',
        'file_size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
    ];

    /**
     * Get the user who uploaded this file
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Get the product this media file is associated with
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get formatted file size
     */
    public function getFormattedSizeAttribute(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Check if file is an image
     */
    public function getIsImageAttribute(): bool
    {
        return $this->resource_type === 'image';
    }

    /**
     * Check if file is a video
     */
    public function getIsVideoAttribute(): bool
    {
        return $this->resource_type === 'video';
    }

    /**
     * Get thumbnail URL for images
     */
    public function getThumbnailUrlAttribute(): string
    {
        if ($this->is_image) {
            // Return a smaller version of the image
            return str_replace('/upload/', '/upload/w_300,h_300,c_fill/', $this->secure_url);
        }
        
        return $this->secure_url;
    }
}
