<?php

namespace App\GraphQL\Mutations;

use App\Models\ExchangeRate;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class DeleteExchangeRate
{
    public function __invoke($_, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        try {
            $rate = ExchangeRate::find($args['id']);
            
            if (!$rate) {
                throw new \Exception("Exchange rate with ID {$args['id']} not found.");
            }
            
            $codeFrom = $rate->code_from;
            $codeTo = $rate->code_to;
            
            $deleted = $rate->delete();
            
            if (!$deleted) {
                throw new \Exception("Failed to delete exchange rate {$codeFrom} → {$codeTo}.");
            }
            
            return true;
        } catch (\Illuminate\Database\QueryException $e) {
            throw new \Exception('Database error: ' . $e->getMessage());
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }
}


