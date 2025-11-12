<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TaxRate extends Model
{
    protected $fillable = [
        'tenant_id',
        'code',
        'name',
        'country_code',
        'state_code',
        'zip_code',
        'zip_is_range',
        'zip_from',
        'zip_to',
        'rate',
        'priority',
    ];

    protected $casts = [
        'rate' => 'decimal:4',
        'zip_is_range' => 'boolean',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function taxRules(): HasMany
    {
        return $this->hasMany(TaxRule::class);
    }
}
