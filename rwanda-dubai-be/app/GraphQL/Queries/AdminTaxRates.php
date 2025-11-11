<?php

namespace App\GraphQL\Queries;

use App\Models\TaxRate;

class AdminTaxRates
{
    public function __invoke($_, array $args)
    {
        $perPage = $args['perPage'] ?? 20;
        $page = $args['page'] ?? 1;

        $paginator = TaxRate::orderBy('id')->paginate($perPage, ['*'], 'page', $page);

        return [
            'data' => $paginator->items(),
            'paginatorInfo' => [
                'currentPage' => $paginator->currentPage(),
                'lastPage' => $paginator->lastPage(),
                'perPage' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ];
    }
}

