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

        // Brand filter
        if (isset($args['brandSlug'])) {
            $query->whereHas('brand', function (Builder $q) use ($args) {
                $q->where('slug', $args['brandSlug']);
            });
        }

        $perPage = $args['perPage'] ?? 20;
        $page = $args['page'] ?? 1;

        return $query->paginate($perPage, ['*'], 'page', $page);
    }
}
