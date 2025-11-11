<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShippingMethodRoutePrice extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'shipping_method_id',
        'shipping_route_id',
        'price_per_kg',
        'price_per_cbm',
        'min_weight_kg',
        'max_weight_kg',
        'min_volume_cbm',
        'max_volume_cbm',
        'flat_rate',
        'handling_fee',
        'fuel_surcharge_percentage',
        'insurance_percentage',
        'customs_clearance_fee',
        'customs_duty_percentage',
        'customs_vat_percentage',
        'estimated_days_min',
        'estimated_days_max',
        'is_active',
        'metadata',
    ];

    protected $casts = [
        'price_per_kg' => 'decimal:2',
        'price_per_cbm' => 'decimal:2',
        'min_weight_kg' => 'decimal:2',
        'max_weight_kg' => 'decimal:2',
        'min_volume_cbm' => 'decimal:2',
        'max_volume_cbm' => 'decimal:2',
        'flat_rate' => 'decimal:2',
        'handling_fee' => 'decimal:2',
        'fuel_surcharge_percentage' => 'decimal:2',
        'insurance_percentage' => 'decimal:2',
        'customs_clearance_fee' => 'decimal:2',
        'customs_duty_percentage' => 'decimal:2',
        'customs_vat_percentage' => 'decimal:2',
        'is_active' => 'boolean',
        'metadata' => 'array',
    ];

    public function shippingMethod(): BelongsTo
    {
        return $this->belongsTo(ShippingMethod::class);
    }

    public function shippingRoute(): BelongsTo
    {
        return $this->belongsTo(ShippingRoute::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
