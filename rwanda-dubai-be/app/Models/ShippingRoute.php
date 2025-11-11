<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ShippingRoute extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'name',
        'code',
        'origin_country',
        'origin_city',
        'destination_country',
        'destination_city',
        'transit_points',
        'description',
        'is_active',
        'sort_order',
        'metadata',
    ];

    protected $casts = [
        'transit_points' => 'array',
        'is_active' => 'boolean',
        'metadata' => 'array',
    ];

    public function methodPrices(): HasMany
    {
        return $this->hasMany(ShippingMethodRoutePrice::class);
    }

    public function methods(): BelongsToMany
    {
        return $this->belongsToMany(ShippingMethod::class, 'shipping_method_route_prices')
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
}
