<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CreditMemo extends Model
{
    protected $fillable = [
        'order_id',
        'credit_memo_number',
        'status',
        'subtotal',
        'tax_amount',
        'shipping_amount',
        'discount_amount',
        'adjustment_positive',
        'adjustment_negative',
        'grand_total',
        'refunded_items',
        'admin_note',
        'refunded_at',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'shipping_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'adjustment_positive' => 'decimal:2',
        'adjustment_negative' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'refunded_items' => 'array',
        'refunded_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Generate unique credit memo number
     */
    public static function generateCreditMemoNumber(): string
    {
        $timestamp = now()->format('Ymd');
        $random = strtoupper(substr(md5(uniqid()), 0, 6));

        return "CM-{$timestamp}-{$random}";
    }
}
