<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductImage extends Model
{
    protected $fillable = [
        'product_id',
        'image_url',
        'image_path',
        'is_primary',
        'sort_order',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // Accessors for GraphQL
    public function getUrlAttribute()
    {
        return $this->image_url ?: $this->image_path ?: '/placeholder-product.jpg';
    }

    public function getLabelAttribute()
    {
        return $this->attributes['label'] ?? null;
    }

    public function getRoleAttribute()
    {
        return $this->is_primary ? 'primary' : 'gallery';
    }
}
