<?php

namespace App\GraphQL\Mutations;

use App\Models\ExchangeRate;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use GraphQL\Error\Error;

class DeleteExchangeRate
{
    public function __invoke($_, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        $rate = ExchangeRate::find($args['id']);
        
        if (!$rate) {
            throw new Error("Exchange rate not found. It may have already been deleted.");
        }
        
        $codeFrom = $rate->code_from;
        $codeTo = $rate->code_to;
        
        try {
            $deleted = $rate->delete();
            
            if (!$deleted) {
                throw new Error("Failed to delete exchange rate for {$codeFrom} → {$codeTo}. Please try again.");
            }
            
            return true;
        } catch (\Illuminate\Database\QueryException $e) {
            throw new Error("Failed to delete exchange rate for {$codeFrom} → {$codeTo}. It may be in use.");
        }
    }
}

