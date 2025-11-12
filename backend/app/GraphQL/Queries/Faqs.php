<?php

namespace App\GraphQL\Queries;

use App\Models\Tenant;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class Faqs
{
    public function __invoke($_, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        $tenant = Tenant::first();
        $config = $tenant?->config ?? [];
        $faqs = $config['faqs'] ?? $this->defaultFaqs();

        // Normalize items to expected shape and ids as strings
        $normalized = [];
        foreach ($faqs as $i => $item) {
            $normalized[] = [
                'id' => (string)($item['id'] ?? ($i + 1)),
                'category' => $item['category'] ?? 'general',
                'categoryLabel' => $item['categoryLabel'] ?? ucfirst($item['category'] ?? 'General'),
                'question' => $item['question'] ?? '',
                'answer' => $item['answer'] ?? '',
            ];
        }

        return $normalized;
    }

    private function defaultFaqs(): array
    {
        return [
            [
                'id' => 'exrate',
                'category' => 'payment',
                'categoryLabel' => 'Payment',
                'question' => 'Why is the USD exchange rate different on your platform?',
                'answer' => 'Exchange rates fluctuate and we include a small margin to keep service reliable. For large orders, contact us for a custom quote.',
            ],
            [
                'id' => 'ship-time',
                'category' => 'shipping',
                'categoryLabel' => 'Shipping',
                'question' => 'How long does shipping take?',
                'answer' => 'Standard shipping from our global hubs typically takes 5-7 business days. Express options available.',
            ],
        ];
    }
}
