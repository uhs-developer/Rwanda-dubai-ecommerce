<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExchangeRate extends Model
{
    protected $fillable = [
        'code_from',
        'code_to',
        'rate',
    ];

    protected $appends = ['codeFrom', 'codeTo'];

    // Accessor for GraphQL camelCase
    public function getCodeFromAttribute($value)
    {
        return $this->attributes['code_from'] ?? null;
    }

    // Accessor for GraphQL camelCase
    public function getCodeToAttribute($value)
    {
        return $this->attributes['code_to'] ?? null;
    }
}

