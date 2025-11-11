<?php

namespace App\GraphQL\Queries;

use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;

class AdminProducts
{
    /**
     * Get paginated products for admin
     */
    public function __invoke($_, array $args)
    {
        $query = Product::query()
            ->with(['category', 'subcategory', 'brand', 'images']);

        // Search
        if (!empty($args['q'])) {
            $query->where(function (Builder $q) use ($args) {
                $searchTerm = '%' . $args['q'] . '%';
                $q->where('name', 'like', $searchTerm)
                  ->orWhere('sku', 'like', $searchTerm)
                  ->orWhere('description', 'like', $searchTerm);
            });
        }

        // Filter by category
        if (!empty($args['categoryId'])) {
            $query->where('category_id', $args['categoryId']);
        }

        // Filter by brand
        if (!empty($args['brandId'])) {
            $query->where('brand_id', $args['brandId']);
        }

        // Filter by status
        if (!empty($args['status'])) {
            if ($args['status'] === 'enabled') {
                $query->where('is_active', true);
            } elseif ($args['status'] === 'disabled') {
                $query->where('is_active', false);
            }
        }

        // Sorting
        $sortBy = $args['sortBy'] ?? 'createdAt';
        $sortDir = strtolower($args['sortDir'] ?? 'desc') === 'asc' ? 'asc' : 'desc';
        $whitelist = [
            'name' => 'name',
            'sku' => 'sku',
            'price' => 'price',
            'stockQuantity' => 'stock_quantity',
            'createdAt' => 'created_at',
        ];
        $orderColumn = $whitelist[$sortBy] ?? 'created_at';

        $perPage = $args['perPage'] ?? 20;
        $page = $args['page'] ?? 1;

        $paginator = $query->orderBy($orderColumn, $sortDir)->paginate($perPage, ['*'], 'page', $page);

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

