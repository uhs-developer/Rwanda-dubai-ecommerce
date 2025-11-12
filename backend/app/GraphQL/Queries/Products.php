<?php

namespace App\GraphQL\Queries;

use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;

class Products
{
    /**
     * Get paginated products with filters
     */
    public function __invoke($_, array $args)
    {
        // TODO: Add proper multi-tenancy when ready
        $query = Product::query()
            ->with(['category', 'brand', 'images'])
            ->active();

        // Search filter
        if (isset($args['q']) && !empty($args['q'])) {
            $query->search($args['q']);
        }

        // Category filter
        if (isset($args['categorySlug'])) {
            $query->whereHas('category', function (Builder $q) use ($args) {
                $q->where('slug', $args['categorySlug']);
            });
        }

        // Brand filter by slug
        if (isset($args['brandSlug'])) {
            $query->whereHas('brand', function (Builder $q) use ($args) {
                $q->where('slug', $args['brandSlug']);
            });
        }

        // Brand filter by IDs
        if (isset($args['brandIds']) && !empty($args['brandIds'])) {
            $query->whereIn('brand_id', $args['brandIds']);
        }

        // Price range filter
        if (isset($args['minPrice'])) {
            $query->where('price', '>=', $args['minPrice']);
        }
        if (isset($args['maxPrice'])) {
            $query->where('price', '<=', $args['maxPrice']);
        }

        // In stock filter
        if (isset($args['inStock']) && $args['inStock']) {
            $query->where('qty', '>', 0);
        }

        // Featured filter
        if (isset($args['isFeatured']) && $args['isFeatured']) {
            $query->where('is_featured', true);
        }

        // Sorting
        $sortBy = $args['sortBy'] ?? 'newest';
        switch ($sortBy) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'name':
                $query->orderBy('name', 'asc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $perPage = $args['perPage'] ?? 20;
        $page = $args['page'] ?? 1;

        $paginator = $query->paginate($perPage, ['*'], 'page', $page);

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
