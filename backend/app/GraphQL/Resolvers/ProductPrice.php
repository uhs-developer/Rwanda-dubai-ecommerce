<?php

namespace App\GraphQL\Resolvers;

use App\Models\ExchangeRate;
use App\Models\Product;

class ProductPrice
{
    protected function convert(?float $rwf, string $to): ?float
    {
        if ($rwf === null) {
            return null;
        }
        $rate = ExchangeRate::where('code_from', 'RWF')->where('code_to', strtoupper($to))->value('rate');
        if ($rate && $rate > 0) {
            return round($rwf / $rate, 2);
        }
        // Try inverse if stored as USD->RWF etc.
        $inverse = ExchangeRate::where('code_from', strtoupper($to))->where('code_to', 'RWF')->value('rate');
        if ($inverse && $inverse > 0) {
            return round($rwf / $inverse, 2);
        }
        return null;
    }

    public function usd(Product $product, array $args)
    {
        return $this->convert((float) $product->price, 'USD');
    }

    public function aed(Product $product, array $args)
    {
        return $this->convert((float) $product->price, 'AED');
    }

    public function jpy(Product $product, array $args)
    {
        return $this->convert((float) $product->price, 'JPY');
    }
}


