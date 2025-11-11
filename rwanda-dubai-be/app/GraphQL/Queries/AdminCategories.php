<?php

namespace App\GraphQL\Queries;

use App\Models\Category;

class AdminCategories
{
    public function __invoke($_, array $args)
    {
        $query = Category::query();

        if (!empty($args['q'])) {
            $searchTerm = '%' . $args['q'] . '%';
            $query->where('name', 'like', $searchTerm);
        }

        $perPage = $args['perPage'] ?? 20;
        $page = $args['page'] ?? 1;

        $paginator = $query->orderBy('name')->paginate($perPage, ['*'], 'page', $page);

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

