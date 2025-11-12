<?php

namespace App\GraphQL\Mutations;

use App\Models\ExchangeRate;
use Illuminate\Validation\ValidationException;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class CreateExchangeRate
{
    public function __invoke($_, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        try {
            $input = $args['input'];
            
            // Validate input
            if (empty($input['codeFrom']) || empty($input['codeTo'])) {
                throw new \Exception('Both codeFrom and codeTo are required.');
            }
            
            if (!isset($input['rate']) || $input['rate'] <= 0) {
                throw new \Exception('Rate must be greater than 0.');
            }
            
            $codeFrom = strtoupper(trim($input['codeFrom']));
            $codeTo = strtoupper(trim($input['codeTo']));
            
            // Check for duplicate
            $existing = ExchangeRate::where('code_from', $codeFrom)
                ->where('code_to', $codeTo)
                ->first();
            
            if ($existing) {
                throw new \Exception("Exchange rate for {$codeFrom} → {$codeTo} already exists. Use update instead.");
            }
            
            $rate = ExchangeRate::create([
                'code_from' => $codeFrom,
                'code_to' => $codeTo,
                'rate' => $input['rate'],
            ]);
            
            return $rate;
        } catch (\Illuminate\Database\QueryException $e) {
            throw new \Exception('Database error: ' . $e->getMessage());
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }
}


