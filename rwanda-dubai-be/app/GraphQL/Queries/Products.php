<?php

namespace App\GraphQL\Queries;

use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;

class Products
{
    /**
     * Get paginated products with filters and tenant scoping
     */
    public function __invoke($_, array $args)
    {
        $tenant = app('tenant');

        $query = Product::query()
            ->where('tenant_id', $tenant->id)
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
