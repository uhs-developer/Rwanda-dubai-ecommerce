<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\TaxRule;
use App\Models\Address;

class TaxCalculator
{
    public function calculateForCart(Cart $cart, ?Address $address = null): array
    {
        $tenant = app('tenant');

        if (!$address) {
            return [
                'subtotal' => $cart->subtotal,
                'tax_amount' => 0,
                'tax_details' => [],
                'total' => $cart->subtotal,
            ];
        }

        $taxDetails = [];
        $totalTax = 0;

        foreach ($cart->items as $item) {
            $product = $item->product;
            $productTaxClassId = $product->tax_class_id ?? null;

            if (!$productTaxClassId) {
                continue;
            }

            // Find applicable tax rules
            $taxRules = TaxRule::where('tenant_id', $tenant->id)
                ->where('product_tax_class_id', $productTaxClassId)
                ->with('taxRate')
                ->orderBy('priority', 'asc')
                ->orderBy('position', 'asc')
                ->get();

            foreach ($taxRules as $taxRule) {
                $taxRate = $taxRule->taxRate;

                // Check if tax rate applies to this address
                if (!$this->taxRateApplies($taxRate, $address)) {
                    continue;
                }

                $baseAmount = $taxRule->calculate_subtotal ? $cart->subtotal : $item->subtotal;
                $tax = $baseAmount * ($taxRate->rate / 100);

                $totalTax += $tax;

                $taxDetails[] = [
                    'title' => $taxRate->name,
                    'rate' => $taxRate->rate,
                    'amount' => $tax,
                ];

                if ($taxRule->stop_rules_processing) {
                    break;
                }
            }
        }

        return [
            'subtotal' => $cart->subtotal,
            'tax_amount' => round($totalTax, 2),
            'tax_details' => $taxDetails,
            'total' => round($cart->subtotal + $totalTax, 2),
        ];
    }

    protected function taxRateApplies($taxRate, Address $address): bool
    {
        // Check country
        if ($taxRate->country_code !== $address->country) {
            return false;
        }

        // Check state if specified
        if ($taxRate->state_code && $taxRate->state_code !== $address->state) {
            return false;
        }

        // Check zip code if specified
        if ($taxRate->zip_code) {
            if ($taxRate->zip_is_range) {
                $zip = intval($address->postal_code);
                $zipFrom = intval($taxRate->zip_from);
                $zipTo = intval($taxRate->zip_to);

                if ($zip < $zipFrom || $zip > $zipTo) {
                    return false;
                }
            } else {
                if ($taxRate->zip_code !== $address->postal_code) {
                    return false;
                }
            }
        }

        return true;
    }
}
