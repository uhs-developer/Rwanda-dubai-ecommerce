<?php

namespace App\GraphQL\Types;

use App\Models\Product;
use GraphQL\Type\Definition\Type;
use Nuwave\Lighthouse\Schema\TypeRegistry;
use Rebing\GraphQL\Support\Type as GraphQLType;

class AdminProductType extends GraphQLType
{
    protected $attributes = [
        'name' => 'AdminProduct',
        'description' => 'Admin product type',
        'model' => Product::class,
    ];

    public function fields(TypeRegistry $types = null): array
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::id()),
            ],
            'sku' => [
                'type' => Type::nonNull(Type::string()),
            ],
            'name' => [
                'type' => Type::nonNull(Type::string()),
            ],
            'slug' => [
                'type' => Type::nonNull(Type::string()),
            ],
            'price' => [
                'type' => Type::nonNull(Type::float()),
            ],
            'stockQuantity' => [
                'type' => Type::int(),
                'alias' => 'stock_quantity',
            ],
            'isActive' => [
                'type' => Type::boolean(),
                'alias' => 'is_active',
            ],
            'primaryImage' => [
                'type' => Type::string(),
                'alias' => 'primary_image',
            ],
            'createdAt' => [
                'type' => Type::string(),
                'alias' => 'created_at',
            ],
            'updatedAt' => [
                'type' => Type::string(),
                'alias' => 'updated_at',
            ],
        ];
    }
}

