<?php

namespace App\GraphQL\Queries;

use App\Models\User;

class AdminUsers
{
    public function __invoke($_, array $args)
    {
        $query = User::query()->with('roles');

        // Only get admin users (superadmin, admin)
        $query->whereHas('roles', function ($q) {
            $q->whereIn('name', ['superadmin', 'admin']);
        });

        if (!empty($args['q'])) {
            $searchTerm = '%' . $args['q'] . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', $searchTerm)
                  ->orWhere('email', 'like', $searchTerm);
            });
        }

        $perPage = $args['perPage'] ?? 20;
        $page = $args['page'] ?? 1;

        $paginator = $query->orderBy('created_at', 'desc')->paginate($perPage, ['*'], 'page', $page);

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

