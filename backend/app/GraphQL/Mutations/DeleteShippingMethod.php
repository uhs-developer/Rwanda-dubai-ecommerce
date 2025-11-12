<?php

namespace App\GraphQL\Mutations;

use App\Models\ShippingMethod;

class DeleteShippingMethod
{
    public function __invoke($_, array $args)
    {
        $method = ShippingMethod::findOrFail($args['id']);

        $method->delete();

        return $method;
    }
}
