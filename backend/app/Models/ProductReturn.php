<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ProductReturn extends Model
{
    use HasFactory;

    protected $table = 'returns';

    protected $fillable = [
        'return_number',
        'user_id',
        'product_id',
        'order_id',
        'quantity',
        'refund_amount',
        'status',
        'reason',
        'description',
        'admin_notes',
        'return_method',
        'requested_at',
        'processed_at',
    ];

    protected $casts = [
        'refund_amount' => 'decimal:2',
        'requested_at' => 'datetime',
        'processed_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($ret) {
            if (empty($ret->return_number)) {
                $ret->return_number = 'RET-' . strtoupper(Str::random(10));
            }
            if (empty($ret->requested_at)) {
                $ret->requested_at = now();
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}



