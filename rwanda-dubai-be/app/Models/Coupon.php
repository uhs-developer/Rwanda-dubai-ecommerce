<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Coupon extends Model
{
    protected $fillable = [
        'tenant_id',
        'code',
        'description',
        'discount_type',
        'discount_amount',
        'usage_limit',
        'usage_per_customer',
        'times_used',
        'valid_from',
        'valid_to',
        'minimum_order_amount',
        'maximum_discount_amount',
        'free_shipping',
        'is_active',
        'conditions',
    ];

    protected $casts = [
        'discount_amount' => 'decimal:2',
        'minimum_order_amount' => 'decimal:2',
        'maximum_discount_amount' => 'decimal:2',
        'free_shipping' => 'boolean',
        'is_active' => 'boolean',
        'conditions' => 'array',
        'valid_from' => 'datetime',
        'valid_to' => 'datetime',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function isValid(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $now = now();

        if ($this->valid_from && $now->lt($this->valid_from)) {
            return false;
        }

        if ($this->valid_to && $now->gt($this->valid_to)) {
            return false;
        }

        if ($this->usage_limit && $this->times_used >= $this->usage_limit) {
            return false;
        }

        return true;
    }
}
