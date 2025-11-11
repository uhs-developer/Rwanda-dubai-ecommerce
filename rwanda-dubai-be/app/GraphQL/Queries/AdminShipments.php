<?php

namespace App\GraphQL\Queries;

class AdminShipments
{
    public function __invoke($_, array $args)
    {
        // Placeholder - implement when Shipment model exists
        return [
            'data' => [],
            'paginatorInfo' => [
                'currentPage' => 1,
                'lastPage' => 1,
                'perPage' => 20,
                'total' => 0,
            ],
        ];
    }
}

