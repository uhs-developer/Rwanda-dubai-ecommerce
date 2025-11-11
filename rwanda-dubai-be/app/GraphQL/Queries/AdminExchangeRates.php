<?php

namespace App\GraphQL\Queries;

use App\Models\ExchangeRate;

class AdminExchangeRates
{
    public function __invoke($_, array $args = [])
    {
        return ExchangeRate::orderBy('code_from')->orderBy('code_to')->get();
    }
}


