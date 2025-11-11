<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Shipment extends Model
{
    protected $fillable = [
        'order_id',
        'shipment_number',
        'carrier',
        'tracking_number',
        'status',
        'shipped_items',
        'admin_note',
        'shipped_at',
        'delivered_at',
    ];

    protected $casts = [
        'shipped_items' => 'array',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Generate unique shipment number
     */
    public static function generateShipmentNumber(): string
    {
        $timestamp = now()->format('Ymd');
        $random = strtoupper(substr(md5(uniqid()), 0, 6));

        return "SHIP-{$timestamp}-{$random}";
    }
}
