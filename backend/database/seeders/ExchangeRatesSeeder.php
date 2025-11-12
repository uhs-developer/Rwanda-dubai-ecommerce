<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ExchangeRate;

class ExchangeRatesSeeder extends Seeder
{
    public function run(): void
    {
        $pairs = [
            ['USD', 'RWF', 1300.000000],
            ['AED', 'RWF', 355.000000],
            ['JPY', 'RWF', 9.000000],
        ];

        foreach ($pairs as [$from, $to, $rate]) {
            ExchangeRate::updateOrCreate(
                ['code_from' => $from, 'code_to' => $to],
                ['rate' => $rate]
            );
        }
    }
}


