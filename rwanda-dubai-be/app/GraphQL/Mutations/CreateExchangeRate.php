<?php

namespace App\GraphQL\Mutations;

use App\Models\ExchangeRate;

class CreateExchangeRate
{
    public function __invoke($_, array $args)
    {
        $input = $args['input'];
        $rate = ExchangeRate::create([
            'code_from' => strtoupper($input['codeFrom']),
            'code_to' => strtoupper($input['codeTo']),
            'rate' => $input['rate'],
        ]);
        return $rate;
    }
}


