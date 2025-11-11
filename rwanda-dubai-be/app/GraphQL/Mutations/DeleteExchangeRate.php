<?php

namespace App\GraphQL\Mutations;

use App\Models\ExchangeRate;

class DeleteExchangeRate
{
    public function __invoke($_, array $args)
    {
        $rate = ExchangeRate::findOrFail($args['id']);
        return (bool) $rate->delete();
    }
}


