<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShippingRate extends Model
{
    protected $fillable = [
        'tenant_id',
        'shipping_method_id',
        'country_code',
        'state_code',
        'zip_code',
        'weight_from',
        'weight_to',
        'price_from',
        'price_to',
        'rate',
    ];

    protected $casts = [
        'weight_from' => 'decimal:2',
        'weight_to' => 'decimal:2',
        'price_from' => 'decimal:2',
        'price_to' => 'decimal:2',
        'rate' => 'decimal:2',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function shippingMethod(): BelongsTo
    {
        return $this->belongsTo(ShippingMethod::class);
    }
}
