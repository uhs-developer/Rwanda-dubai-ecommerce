<?php

namespace App\GraphQL\Mutations;

use App\Models\Product;

class DeleteProduct
{
    public function __invoke($_, array $args)
    {
        $product = Product::findOrFail($args['id']);
        
        // Delete associated images
        $product->images()->delete();
        
        $product->delete();

        return true;
    }
}

