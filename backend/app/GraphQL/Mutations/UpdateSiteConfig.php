<?php

namespace App\GraphQL\Mutations;

use App\Models\Tenant;
use GraphQL\Error\Error;

class UpdateSiteConfig
{
    public function __invoke($_, array $args)
    {
        $input = $args['input'] ?? [];
        $tenant = Tenant::query()->first();
        if (!$tenant) {
            throw new Error('Tenant not initialized.');
        }

        $config = $tenant->config ?? [];
        $config['contact'] = array_merge($config['contact'] ?? [], $input['contact'] ?? []);

        $tenant->config = $config;
        $tenant->save();

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
