<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ShippingMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'name',
        'code',
        'description',
        'carrier',
        'type',
        'base_price',
        'estimated_days_min',
        'estimated_days_max',
        'is_active',
        'sort_order',
        'metadata',
    ];

    protected $casts = [
        'base_price' => 'decimal:2',
        'is_active' => 'boolean',
        'metadata' => 'array',
    ];

    protected $attributes = [
        'base_price' => 0,
        'is_active' => true,
        'sort_order' => 0,
    ];

    public function routePrices(): HasMany
    {
        return $this->hasMany(ShippingMethodRoutePrice::class);
    }

    public function routes(): BelongsToMany
    {
        return $this->belongsToMany(ShippingRoute::class, 'shipping_method_route_prices')
            ->withPivot(['price_per_kg', 'price_per_cbm', 'flat_rate'])
            ->withTimestamps();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    // Accessor to ensure basePrice is never null
    public function getBasePriceAttribute($value)
    {
        return $value !== null ? (float) $value : 0.0;
    }

    // Accessor to ensure isActive is never null
    public function getIsActiveAttribute($value)
    {
        return $value !== null ? (bool) $value : true;
    }

    // Accessor to ensure sortOrder is never null
    public function getSortOrderAttribute($value)
    {
        return $value !== null ? (int) $value : 0;
    }
}
