<?php

namespace App\GraphQL\Mutations;

use App\Models\ExchangeRate;

class UpdateExchangeRate
{
    public function __invoke($_, array $args)
    {
        $rate = ExchangeRate::findOrFail($args['id']);
        $input = $args['input'];
        $rate->update([
            'code_from' => strtoupper($input['codeFrom']),
            'code_to' => strtoupper($input['codeTo']),
            'rate' => $input['rate'],
        ]);
        return $rate;
    }
}


