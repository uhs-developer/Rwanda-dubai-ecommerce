<?php

namespace App\GraphQL\Queries;

use App\Models\Brand;

class AdminBrands
{
    /**
     * Get paginated brands for admin
     */
    public function __invoke($_, array $args)
    {
        $query = Brand::query();

        // Search filter
        if (isset($args['q']) && !empty($args['q'])) {
            $query->where(function ($q) use ($args) {
                $q->where('name', 'like', '%' . $args['q'] . '%')
                  ->orWhere('slug', 'like', '%' . $args['q'] . '%');
            });
        }

        $query->orderBy('name', 'asc');

        $perPage = $args['perPage'] ?? 20;
        $page = $args['page'] ?? 1;

        $paginator = $query->paginate($perPage, ['*'], 'page', $page);

        // Return structured array for GraphQL AdminBrandConnection
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

