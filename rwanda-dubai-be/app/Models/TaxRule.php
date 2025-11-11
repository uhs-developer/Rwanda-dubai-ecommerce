<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaxRule extends Model
{
    protected $fillable = [
        'tenant_id',
        'tax_rate_id',
        'product_tax_class_id',
        'customer_tax_class_id',
        'priority',
        'position',
        'calculate_subtotal',
    ];

    protected $casts = [
        'calculate_subtotal' => 'boolean',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function taxRate(): BelongsTo
    {
        return $this->belongsTo(TaxRate::class);
    }

    public function productTaxClass(): BelongsTo
    {
        return $this->belongsTo(TaxClass::class, 'product_tax_class_id');
    }

    public function customerTaxClass(): BelongsTo
    {
        return $this->belongsTo(TaxClass::class, 'customer_tax_class_id');
    }
}
