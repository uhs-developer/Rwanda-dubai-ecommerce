<?php

namespace App\GraphQL\Mutations;

use App\Models\Tenant;
use GraphQL\Error\Error;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class UpdatePageContent
{
    public function __invoke($_, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        $pageKey = $args['pageKey'];
        $input = $args['input'];
        
        $tenant = Tenant::first();
        
        if (!$tenant) {
            throw new Error('Tenant not found');
        }

        $config = $tenant->config ?? [];
        $pageContents = $config['page_contents'] ?? [];

        // Convert sections input to array
        $sections = [];
        foreach ($input['sections'] as $section) {
            $sections[] = [
                'key' => $section['key'],
                'label' => $this->getLabelForKey($section['key']),
                'content' => $section['content'] ?? '',
            ];
        }

        $pageContents[$pageKey] = $sections;
        $config['page_contents'] = $pageContents;

        $tenant->config = $config;
        $tenant->save();
        $tenant->refresh();

        $pageNames = [
            'contact' => 'Contact Us',
            'about' => 'About Us',
            'faq' => 'FAQ',
            'privacy' => 'Privacy Policy',
            'terms' => 'Terms & Conditions',
        ];

        return [
            'id' => $pageKey,
            'pageKey' => $pageKey,
            'pageName' => $pageNames[$pageKey] ?? ucfirst($pageKey),
            'sections' => $sections,
            'updatedAt' => $tenant->updated_at,
        ];
    }

    private function getLabelForKey($key)
    {
        $labels = [
            'hero_title' => 'Hero Title',
            'hero_subtitle' => 'Hero Subtitle',
            'description' => 'Description',
            'mission' => 'Our Mission',
            'vision' => 'Our Vision',
            'title' => 'Title',
            'content' => 'Content',
        ];

        return $labels[$key] ?? ucwords(str_replace('_', ' ', $key));
    }
}

