<?php

namespace App\GraphQL\Mutations;

use App\Models\ExchangeRate;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Error\Error;

class UpdateExchangeRate
{
    public function __invoke($_, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        $rate = ExchangeRate::find($args['id']);
        
        if (!$rate) {
            throw new Error("Exchange rate not found. It may have been deleted.");
        }
        
        $input = $args['input'];
        
        // Validate rate if provided
        if (isset($input['rate']) && $input['rate'] <= 0) {
            throw new Error('Exchange rate must be greater than 0.');
        }
        
        $updateData = [];
        
        if (isset($input['codeFrom'])) {
            $updateData['code_from'] = strtoupper(trim($input['codeFrom']));
        }
        
        if (isset($input['codeTo'])) {
            $updateData['code_to'] = strtoupper(trim($input['codeTo']));
        }
        
        if (isset($input['rate'])) {
            $updateData['rate'] = $input['rate'];
        }
        
        // Check for duplicate if codeFrom or codeTo is being changed
        if (isset($updateData['code_from']) || isset($updateData['code_to'])) {
            $codeFrom = $updateData['code_from'] ?? $rate->code_from;
            $codeTo = $updateData['code_to'] ?? $rate->code_to;
            
            $existing = ExchangeRate::where('code_from', $codeFrom)
                ->where('code_to', $codeTo)
                ->where('id', '!=', $rate->id)
                ->first();
            
            if ($existing) {
                throw new Error("An exchange rate for {$codeFrom} → {$codeTo} already exists.");
            }
        }
        
        try {
            $rate->update($updateData);
            $rate->refresh();
            
            return $rate;
        } catch (\Illuminate\Database\QueryException $e) {
            throw new Error('Failed to update exchange rate. Please check your input and try again.');
        }
    }
}

