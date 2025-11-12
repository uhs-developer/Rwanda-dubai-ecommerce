<?php

namespace App\GraphQL\Queries;

use App\Models\Tenant;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class AdminPageContent
{
    public function __invoke($_, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        $pageKey = $args['pageKey'];
        $tenant = Tenant::first();
        $pageContents = $tenant->config['page_contents'] ?? [];

        $pageNames = [
            'contact' => 'Contact Us',
            'about' => 'About Us',
            'faq' => 'FAQ',
            'privacy' => 'Privacy Policy',
            'terms' => 'Terms & Conditions',
        ];

        $sections = $pageContents[$pageKey] ?? $this->getDefaultSections($pageKey);

        return [
            'id' => $pageKey,
            'pageKey' => $pageKey,
            'pageName' => $pageNames[$pageKey] ?? ucfirst($pageKey),
            'sections' => $sections,
            'updatedAt' => $tenant->updated_at,
        ];
    }

    private function getDefaultSections($pageKey)
    {
        switch ($pageKey) {
            case 'contact':
                return [
                    ['key' => 'hero_title', 'label' => 'Hero Title', 'content' => 'Get in Touch'],
                    ['key' => 'hero_subtitle', 'label' => 'Hero Subtitle', 'content' => 'We\'re here to help you with any questions'],
                    ['key' => 'description', 'label' => 'Description', 'content' => 'Have a question or need assistance? Our team is ready to help.'],
                ];
            case 'about':
                return [
                    ['key' => 'hero_title', 'label' => 'Hero Title', 'content' => 'About Us'],
                    ['key' => 'hero_subtitle', 'label' => 'Hero Subtitle', 'content' => 'Your trusted partner in global e-commerce'],
                    ['key' => 'mission', 'label' => 'Our Mission', 'content' => 'We connect global markets with Rwanda through seamless e-commerce.'],
                    ['key' => 'vision', 'label' => 'Our Vision', 'content' => 'To become the leading cross-border e-commerce platform.'],
                ];
            case 'faq':
                return [
                    ['key' => 'hero_title', 'label' => 'Hero Title', 'content' => 'Frequently Asked Questions'],
                    ['key' => 'hero_subtitle', 'label' => 'Hero Subtitle', 'content' => 'Find answers to common questions'],
                ];
            case 'privacy':
                return [
                    ['key' => 'title', 'label' => 'Title', 'content' => 'Privacy Policy'],
                    ['key' => 'content', 'label' => 'Content', 'content' => 'Your privacy policy content here...'],
                ];
            case 'terms':
                return [
                    ['key' => 'title', 'label' => 'Title', 'content' => 'Terms & Conditions'],
                    ['key' => 'content', 'label' => 'Content', 'content' => 'Your terms and conditions content here...'],
                ];
            default:
                return [];
        }
    }
}

