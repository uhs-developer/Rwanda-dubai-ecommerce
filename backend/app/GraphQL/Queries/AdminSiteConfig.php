<?php

namespace App\GraphQL\Queries;

use App\Models\Tenant;

class AdminSiteConfig
{
    public function __invoke($_, array $args)
    {
        $tenant = Tenant::query()->first();
        $config = $tenant?->config ?? [];

        $contact = $config['contact'] ?? [];

        return [
            'contact' => [
                'addressDubai' => $contact['addressDubai'] ?? null,
                'addressKigali' => $contact['addressKigali'] ?? null,
                'phoneDubai' => $contact['phoneDubai'] ?? null,
                'phoneKigali' => $contact['phoneKigali'] ?? null,
                'supportEmail' => $contact['supportEmail'] ?? null,
                'ordersEmail' => $contact['ordersEmail'] ?? null,
                'whatsappNumber' => $contact['whatsappNumber'] ?? null,
                'businessHours' => $contact['businessHours'] ?? null,
            ],
        ];
    }
}
