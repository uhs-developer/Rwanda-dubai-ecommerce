<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Address;
use App\Models\ShippingMethod;
use App\Models\ShippingRate;

class ShippingCalculator
{
    public function getAvailableMethods(Cart $cart, Address $address): array
    {
        $tenant = app('tenant');

        $methods = ShippingMethod::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $availableMethods = [];

        foreach ($methods as $method) {
            $rate = $this->calculateRate($method, $cart, $address);

            if ($rate !== null) {
                $availableMethods[] = [
                    'method_id' => $method->id,
                    'code' => $method->code,
                    'name' => $method->name,
                    'description' => $method->description,
                    'carrier' => $method->carrier,
                    'price' => $rate,
                ];
            }
        }

        return $availableMethods;
    }

    protected function calculateRate(ShippingMethod $method, Cart $cart, Address $address): ?float
    {
        $tenant = app('tenant');

        // Calculate cart totals
        $cartWeight = 0;
        $cartPrice = $cart->subtotal;

        foreach ($cart->items as $item) {
            $cartWeight += ($item->product->weight ?? 0) * $item->quantity;
        }

        // Find matching shipping rate
        $rate = ShippingRate::where('tenant_id', $tenant->id)
            ->where('shipping_method_id', $method->id)
            ->where('country_code', $address->country)
            ->where(function ($query) use ($address) {
                $query->whereNull('state_code')
                      ->orWhere('state_code', $address->state);
            })
            ->where(function ($query) use ($address) {
                $query->whereNull('zip_code')
                      ->orWhere('zip_code', $address->postal_code);
            })
            ->where(function ($query) use ($cartWeight) {
                $query->where(function ($q) use ($cartWeight) {
                    $q->whereNull('weight_from')
                      ->whereNull('weight_to');
                })
                ->orWhere(function ($q) use ($cartWeight) {
                    $q->where(function ($q2) use ($cartWeight) {
                        $q2->whereNull('weight_from')
                           ->orWhere('weight_from', '<=', $cartWeight);
                    })
                    ->where(function ($q2) use ($cartWeight) {
                        $q2->whereNull('weight_to')
                           ->orWhere('weight_to', '>=', $cartWeight);
                    });
                });
            })
            ->where(function ($query) use ($cartPrice) {
                $query->where(function ($q) use ($cartPrice) {
                    $q->whereNull('price_from')
                      ->whereNull('price_to');
                })
                ->orWhere(function ($q) use ($cartPrice) {
                    $q->where(function ($q2) use ($cartPrice) {
                        $q2->whereNull('price_from')
                           ->orWhere('price_from', '<=', $cartPrice);
                    })
                    ->where(function ($q2) use ($cartPrice) {
                        $q2->whereNull('price_to')
                           ->orWhere('price_to', '>=', $cartPrice);
                    });
                });
            })
            ->first();

        return $rate ? floatval($rate->rate) : null;
    }
}
