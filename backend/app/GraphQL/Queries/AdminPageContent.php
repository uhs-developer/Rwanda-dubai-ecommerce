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
                    ['key' => 'body', 'label' => 'Company History / Body Content', 'content' => 'Kora is a Digital Procurement Corridor (DPC) designed for Rwanda. We directly connect customers and businesses to producers and wholesalers in China, Dubai (UAE), and South Korea. Instead of stocking risky inventory, we operate request-based procurement with transparent Total Landed Cost (TLC), quality control (QC), and end‑to‑end logistics. This eliminates the inventory‑risk premium and unlocks access to specialized electronics and auto parts that are often scarce or overpriced locally.'],
                    ['key' => 'mission', 'label' => 'Our Mission', 'content' => 'We connect Rwanda to global manufacturing hubs through transparent procurement, rigorous QC, and reliable logistics, enabling fair prices and access to specialized components.'],
                    ['key' => 'vision', 'label' => 'Our Vision', 'content' => 'To be Rwanda’s trusted cross‑border procurement corridor for innovation‑driving electronics and high‑quality auto parts.'],
                ];
            case 'home':
                return [
                    ['key' => 'hero_title', 'label' => 'Hero Title', 'content' => 'Kora: Smart Way to Import'],
                    ['key' => 'hero_subtitle', 'label' => 'Hero Subtitle', 'content' => 'Direct procurement + transparent TLC + quality control. We handle sourcing, shipping, and customs end‑to‑end.'],
                    ['key' => 'benefit_1_title', 'label' => 'Benefit 1 Title', 'content' => 'Lower Total Cost'],
                    ['key' => 'benefit_1_desc', 'label' => 'Benefit 1 Description', 'content' => 'No inventory risk premiums. Transparent Total Landed Cost for every request.'],
                    ['key' => 'benefit_2_title', 'label' => 'Benefit 2 Title', 'content' => 'Quality Assured'],
                    ['key' => 'benefit_2_desc', 'label' => 'Benefit 2 Description', 'content' => 'Vetted suppliers and QC at source hubs in China, Dubai and South Korea.'],
                    ['key' => 'benefit_3_title', 'label' => 'Benefit 3 Title', 'content' => 'Predictable Logistics'],
                    ['key' => 'benefit_3_desc', 'label' => 'Benefit 3 Description', 'content' => 'Consolidation, tracking and reliable ETAs from hub to Kigali.'],
                    ['key' => 'how_title', 'label' => 'How It Works Title', 'content' => 'How Kora Works'],
                    ['key' => 'how_step1', 'label' => 'How Step 1', 'content' => '1) Request: Tell us what you need (specs, brand, quantity).'],
                    ['key' => 'how_step2', 'label' => 'How Step 2', 'content' => '2) Quote (TLC): We calculate the transparent Total Landed Cost.'],
                    ['key' => 'how_step3', 'label' => 'How Step 3', 'content' => '3) QC & Ship: We source, quality‑check, consolidate, customs‑clear, and deliver.'],
                    ['key' => 'sourcing_title', 'label' => 'Sourcing Hubs Title', 'content' => 'Our Sourcing Hubs'],
                    ['key' => 'sourcing_body', 'label' => 'Sourcing Hubs Body', 'content' => 'China for mass manufactured electronics and components, Dubai for multi‑origin consolidation and fast air freight, South Korea for OEM auto parts and high‑quality electronics.'],
                    ['key' => 'tlc_title', 'label' => 'TLC Title', 'content' => 'Transparent Total Landed Cost (TLC)'],
                    ['key' => 'tlc_body', 'label' => 'TLC Body', 'content' => 'Kora itemizes product cost, agent commission, freight/insurance, duties/levies, and VAT to present an all‑in price in RWF. No hidden fees.'],
                ];
            case 'faq':
                return [
                    ['key' => 'hero_title', 'label' => 'Hero Title', 'content' => 'Frequently Asked Questions'],
                    ['key' => 'hero_subtitle', 'label' => 'Hero Subtitle', 'content' => 'Find answers to common questions'],
                ];
            case 'privacy':
                return [
                    ['key' => 'title', 'label' => 'Title', 'content' => 'Privacy Policy'],
                    ['key' => 'content', 'label' => 'Content', 'content' => 'We collect only what we need to fulfill your requests (contact details, order information). We never sell your data. Payment data is processed securely by our payment partners. We retain data only as long as necessary to provide services and comply with law. You can request access, correction, or deletion of your personal data at any time.'],
                ];
            case 'terms':
                return [
                    ['key' => 'title', 'label' => 'Title', 'content' => 'Terms & Conditions'],
                    ['key' => 'content', 'label' => 'Content', 'content' => 'By submitting a procurement request to Kora, you agree to receive a transparent Total Landed Cost (TLC) quote, and to pay according to the agreed terms. Estimated delivery times depend on sourcing hub, consolidation cycles and customs processes. QC is performed at the source hub to reduce defects; warranty and returns follow the Returns & Warranty policy. Kora may update these Terms as needed.'],
                ];
            case 'returns':
                return [
                    ['key' => 'title', 'label' => 'Title', 'content' => 'Returns & Warranty'],
                    ['key' => 'content', 'label' => 'Content', 'content' => 'Eligible returns are accepted within 30 days after delivery for items that are defective, damaged in transit, or not matching agreed specifications. Warranty terms follow the OEM/manufacturer policy. Please contact support with photos/videos and your order number; our team will assess and provide a resolution (replacement, repair, or refund as appropriate).'],
                ];
            default:
                return [];
        }
    }
}

