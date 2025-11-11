<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CatalogRule extends Model
{
    protected $fillable = [
        'tenant_id',
        'name',
        'description',
        'is_active',
        'valid_from',
        'valid_to',
        'priority',
        'stop_rules_processing',
        'discount_type',
        'discount_amount',
        'conditions',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'stop_rules_processing' => 'boolean',
        'discount_amount' => 'decimal:2',
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

        return true;
    }
}
