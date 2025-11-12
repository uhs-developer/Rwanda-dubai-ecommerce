<?php

namespace App\GraphQL\Scalars;

use GraphQL\Error\Error;
use GraphQL\Language\AST\Node;
use GraphQL\Language\AST\StringValueNode;
use GraphQL\Type\Definition\ScalarType;

class JSON extends ScalarType
{
    /**
     * Serializes an internal value to include in a response.
     */
    public function serialize($value): string
    {
        return json_encode($value);
    }

    /**
     * Parses an externally provided value (query variable) to use as an input.
     */
    public function parseValue($value)
    {
        if (is_string($value)) {
            return json_decode($value, true);
        }

        return $value;
    }

    /**
     * Parses an externally provided literal value (hardcoded in GraphQL query) to use as an input.
     */
    public function parseLiteral(Node $valueNode, ?array $variables = null)
    {
        if ($valueNode instanceof StringValueNode) {
            return json_decode($valueNode->value, true);
        }

        throw new Error('Query error: Can only parse strings got: ' . $valueNode->kind, [$valueNode]);
    }
}
