<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Promotion extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'discount_type',
        'discount_value',
        'status',
        'starts_at',
        'ends_at',
        'applicable_categories',
        'applicable_products',
        'stackable',
        'is_public',
    ];

    protected $casts = [
        'discount_value' => 'decimal:2',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'applicable_categories' => 'array',
        'applicable_products' => 'array',
        'stackable' => 'boolean',
        'is_public' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($promotion) {
            if (empty($promotion->slug)) {
                $promotion->slug = Str::slug($promotion->name);
            }
        });
    }

    public function getIsActiveAttribute(): bool
    {
        if ($this->status !== 'active') {
            return false;
        }
        $now = now();
        if ($this->starts_at && $now->lt($this->starts_at)) {
            return false;
        }
        if ($this->ends_at && $now->gt($this->ends_at)) {
            return false;
        }
        return true;
    }
}





