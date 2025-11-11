<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    protected $fillable = [
        'cart_id',
        'product_id',
        'sku',
        'name',
        'quantity',
        'price',
        'row_total',
        'tax_amount',
        'discount_amount',
        'custom_options',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'row_total' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'custom_options' => 'array',
    ];

    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Calculate row total when quantity or price changes
     */
    protected static function booted(): void
    {
        static::saving(function (CartItem $item) {
            $item->row_total = $item->price * $item->quantity;
        });
    }
}
