<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartRule extends Model
{
    protected $fillable = [
        'tenant_id',
        'name',
        'description',
        'is_active',
        'valid_from',
        'valid_to',
        'uses_per_coupon',
        'uses_per_customer',
        'times_used',
        'priority',
        'stop_rules_processing',
        'discount_type',
        'discount_amount',
        'discount_qty',
        'discount_step',
        'maximum_discount_amount',
        'apply_to_shipping',
        'free_shipping',
        'conditions',
        'actions',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'stop_rules_processing' => 'boolean',
        'apply_to_shipping' => 'boolean',
        'free_shipping' => 'boolean',
        'discount_amount' => 'decimal:2',
        'discount_step' => 'decimal:2',
        'maximum_discount_amount' => 'decimal:2',
        'conditions' => 'array',
        'actions' => 'array',
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

        if ($this->uses_per_coupon && $this->times_used >= $this->uses_per_coupon) {
            return false;
        }

        return true;
    }
}
