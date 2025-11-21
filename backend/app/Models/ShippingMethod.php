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
        'is_active',
        'sort_order',
        'config',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'config' => 'array',
    ];

    protected $attributes = [
        'is_active' => true,
        'sort_order' => 0,
        'config' => '[]',
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

    // Accessor to get base_price from config
    public function getBasePriceAttribute()
    {
        return $this->config['base_price'] ?? 0.0;
    }

    // Accessor to get type from config
    public function getTypeAttribute()
    {
        return $this->config['type'] ?? 'land';
    }

    // Accessor to get estimated_days_min from config
    public function getEstimatedDaysMinAttribute()
    {
        return $this->config['estimated_days_min'] ?? null;
    }

    // Accessor to get estimated_days_max from config
    public function getEstimatedDaysMaxAttribute()
    {
        return $this->config['estimated_days_max'] ?? null;
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
