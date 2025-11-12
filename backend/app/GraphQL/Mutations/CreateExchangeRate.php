<?php

namespace App\GraphQL\Mutations;

use App\Models\ExchangeRate;
use Illuminate\Validation\ValidationException;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Error\Error;

class CreateExchangeRate
{
    public function __invoke($_, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        $input = $args['input'];
        
        // Validate input
        if (empty($input['codeFrom']) || empty($input['codeTo'])) {
            throw new Error('Both currency codes (codeFrom and codeTo) are required.');
        }
        
        if (!isset($input['rate']) || $input['rate'] <= 0) {
            throw new Error('Exchange rate must be greater than 0.');
        }
        
        $codeFrom = strtoupper(trim($input['codeFrom']));
        $codeTo = strtoupper(trim($input['codeTo']));
        
        // Check for duplicate
        $existing = ExchangeRate::where('code_from', $codeFrom)
            ->where('code_to', $codeTo)
            ->first();
        
        if ($existing) {
            throw new Error("Exchange rate for {$codeFrom} → {$codeTo} already exists. Please update the existing rate instead of creating a new one.");
        }
        
        try {
            $rate = ExchangeRate::create([
                'code_from' => $codeFrom,
                'code_to' => $codeTo,
                'rate' => $input['rate'],
            ]);
            
            return $rate;
        } catch (\Illuminate\Database\QueryException $e) {
            throw new Error('Failed to create exchange rate. Please check your input and try again.');
        }
    }
}

