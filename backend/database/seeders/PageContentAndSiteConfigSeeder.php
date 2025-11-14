<?php

namespace Database\Seeders;

use App\Models\Tenant;
use Illuminate\Database\Seeder;

class PageContentAndSiteConfigSeeder extends Seeder
{
    /**
     * Seed static pages (PageContent) and SiteConfig.contact into Tenant config.
     */
    public function run(): void
    {
        $tenant = Tenant::query()->first();
        if (!$tenant) {
            $this->command->warn('Tenant not found; run TenantSeeder first.');
            return;
        }

        $config = $tenant->config ?? [];

        // ===== Site Contact (placeholders to be updated) =====
        $config['contact'] = array_merge($config['contact'] ?? [], [
            'addressDubai' => $config['contact']['addressDubai'] ?? '[ADD_ADDRESS_DUBAI]',
            'addressKigali' => $config['contact']['addressKigali'] ?? '[ADD_ADDRESS_KIGALI]',
            'phoneDubai' => $config['contact']['phoneDubai'] ?? '[+971-XXX-XXXXXX]',
            'phoneKigali' => $config['contact']['phoneKigali'] ?? '[+250-XXX-XXXXXX]',
            'supportEmail' => $config['contact']['supportEmail'] ?? 'support@example.com',
            'ordersEmail' => $config['contact']['ordersEmail'] ?? 'orders@example.com',
            'whatsappNumber' => $config['contact']['whatsappNumber'] ?? '[+250-7XX-XXXXXX]',
            'businessHours' => $config['contact']['businessHours'] ?? [
                'mon_fri' => '09:00–18:00',
                'sat' => '10:00–16:00',
                'sun' => 'Closed',
                'timezone' => 'Africa/Kigali',
            ],
        ]);

        // ===== Page Contents =====
        $pageContents = $config['page_contents'] ?? [];

        // Terms & Conditions (single WYSIWYG body for full styling control)
        $pageContents['terms'] = [
            [
                'key' => 'body',
                'label' => '',
                'content' => '<h1>Terms &amp; Conditions</h1>
<p><em>Last updated: [ADD_DATE]</em></p>

<h2>1. Introduction</h2>
<p>These Terms &amp; Conditions (“Terms”) govern your access to and use of Kora’s request‑based international procurement, consolidation, cross‑border shipping, customs clearance, and local delivery services (collectively, the “Services”). By submitting a request, approving a quotation, or placing an order, you agree to be bound by these Terms.</p>

<h2>2. Definitions</h2>
<ul>
  <li><strong>Customer</strong>: The person or entity requesting the Services.</li>
  <li><strong>Kora</strong>: The procurement agent providing the Services described herein.</li>
  <li><strong>TLC (Total Landed Cost)</strong>: An all‑in price including product, agent commission, freight, insurance, duties/levies, VAT, and clearance/documentation fees.</li>
  <li><strong>Designated Delivery Point</strong>: The point at which risk transfers to the Customer, as communicated by Kora.</li>
</ul>

<h2>3. Nature of Service</h2>
<p>Kora acts solely as a <strong>procurement agent</strong>, not as a seller or manufacturer. Items are sourced from third‑party suppliers per the Customer’s instructions and specifications. Kora manages consolidation at origin hubs, international transport, customs processes under EACCMA, and local delivery in Rwanda.</p>

<h2>4. Quotes, TLC &amp; Acceptance</h2>
<ol>
  <li><strong>Quotation</strong>: Kora issues a TLC quote itemizing cost elements. TLC is a good‑faith estimate based on available supplier and logistics data.</li>
  <li><strong>Approval</strong>: Orders proceed only after Customer approval of the TLC quote and submission of any required KYC documentation.</li>
  <li><strong>Adjustments</strong>: Prior to Customer approval, quotes may change for supplier re‑quotes, FX movements, or route changes. Material changes are communicated for re‑approval.</li>
</ol>

<h2>5. Orders, Payment &amp; Invoicing</h2>
<ul>
  <li><strong>Payment Terms</strong>: Prepayment is generally required unless Kora approves alternative terms.</li>
  <li><strong>Non‑Cancellable Items</strong>: Special‑order, custom, or software‑activated components may be non‑cancellable and non‑returnable.</li>
  <li><strong>Invoicing</strong>: Invoices and receipts are provided electronically. Customer is responsible for ensuring payment within agreed timelines.</li>
</ul>

<h2>6. Shipping, Delivery &amp; ETAs</h2>
<p>Typical routes include Air (Dubai → Kigali) and Sea (China/Korea → DAR → Kigali). Indicative timelines:</p>
<ul>
  <li><strong>Air:</strong> 4–10 business days</li>
  <li><strong>Sea:</strong> 25–45 days</li>
  <li>ETAs depend on supplier readiness, consolidation cycles, port/road operations, and customs inspections. Kora provides milestone tracking where available.</li>
</ul>

<h2>7. Risk Transfer, Title &amp; Insurance</h2>
<ul>
  <li><strong>Risk Transfer</strong> occurs at the Designated Delivery Point unless cargo insurance is purchased.</li>
  <li><strong>Title</strong> passes as specified in the order confirmation or applicable law.</li>
  <li><strong>Insurance</strong> is optional and recommended for high‑value or fragile items; terms depend on the insurer’s policy.</li>
</ul>

<h2>8. Inspection, Acceptance &amp; Non‑Conformity</h2>
<ul>
  <li>Customer must inspect goods upon delivery.</li>
  <li>Report damage, missing items, or non‑conformity within <strong>48 hours</strong> with evidence (photos/videos).</li>
  <li>Kora coordinates with the supplier/carrier to investigate and resolve per the Returns &amp; Warranty policy.</li>
</ul>

<h2>9. Returns, Refunds &amp; Warranty</h2>
<ul>
  <li><strong>Eligible Returns</strong>: Defective goods, wrong items, or items not matching approved specifications.</li>
  <li><strong>Conditions</strong>: Unused, original packaging intact, claims within stated window; re‑export and permit rules may apply.</li>
  <li><strong>Warranty</strong>: OEM/manufacturer policy governs; Kora facilitates but is not the warrantor. Resolution may include repair, replacement, or supplier credit; timelines can be 15–45 days due to international handling.</li>
</ul>

<h2>10. Customer Obligations</h2>
<ul>
  <li>Provide accurate specifications and lawful requests.</li>
  <li>Submit required KYC/AML information and import permits if applicable.</li>
  <li>Be available for delivery and promptly respond to clarification requests.</li>
</ul>

<h2>11. Compliance, Sanctions &amp; Restricted Goods</h2>
<ul>
  <li>All orders must comply with EACCMA and RRA regulations.</li>
  <li>Restricted goods may require permits; Customer is responsible for obtaining any special approvals unless otherwise agreed in writing.</li>
  <li>Kora may refuse requests that violate applicable laws or sanctions.</li>
</ul>

<h2>12. Data Protection &amp; Privacy</h2>
<p>Kora processes personal and logistics data solely to deliver the Services and comply with legal obligations (e.g., customs, AML). See the Privacy Policy for data rights, retention, and cross‑border transfer safeguards.</p>

<h2>13. Intellectual Property</h2>
<p>Trademarks, content, and materials provided by Kora remain the property of their respective owners. Customer must not misuse Kora’s IP or third‑party IP accessed via the Services.</p>

<h2>14. Limitation of Liability</h2>
<ul>
  <li>To the maximum extent permitted by law, Kora’s liability is limited to the value of the affected order unless insurance provides otherwise.</li>
  <li>Kora is not liable for indirect or consequential losses, including loss of profits, business interruption, or data loss.</li>
</ul>

<h2>15. Indemnity</h2>
<p>Customer shall indemnify and hold Kora harmless from claims arising out of Customer’s violation of laws, misuse of the Services, or inaccurate specifications supplied by Customer.</p>

<h2>16. Force Majeure</h2>
<p>Kora is not liable for delays or non‑performance caused by events beyond its reasonable control, including natural disasters, war, civil unrest, strikes, port closures, pandemics, or government actions.</p>

<h2>17. Changes to the Terms</h2>
<p>Kora may update these Terms to reflect operational or legal changes. The “Last updated” date will be revised accordingly.</p>

<h2>18. Dispute Resolution</h2>
<p>Parties will seek amicable resolution for 30 days. Failing that, disputes shall be resolved by binding arbitration under <strong>KIAC</strong>, Kigali, Rwanda, in English, before one arbitrator unless otherwise agreed. The arbitral award shall be final and enforceable.</p>

<h2>19. Governing Law</h2>
<p>These Terms are governed by the laws of the <strong>Republic of Rwanda</strong>.</p>

<h2>20. Contact</h2>
<p>For questions, please contact Support at <a href=\"mailto:support@example.com\">support@example.com</a>.</p>'
            ],
        ];

        // Privacy Policy (single WYSIWYG)
        $pageContents['privacy'] = [
            [
                'key' => 'body',
                'label' => '',
                'content' => '<h1>Privacy Policy</h1>
<p><em>Last updated: [ADD_DATE]</em></p>
<p>This policy explains how Kora collects, uses, and shares personal data to provide procurement and logistics services.</p>
<h2>Controller &amp; Contact</h2>
<p><strong>Controller:</strong> [ADD_COMPANY_NAME], RDB [ADD_RDB], TIN [ADD_TIN]<br/>
<strong>DPO:</strong> [ADD_DPO_NAME] – <a href="mailto:[ADD_DPO_EMAIL]">[ADD_DPO_EMAIL]</a></p>
<h2>Data We Collect</h2>
<ul>
  <li>Identity &amp; contact (name, email, phone)</li>
  <li>Procurement &amp; logistics (specs, tracking, addresses)</li>
  <li>Payment confirmations (no card storage)</li>
  <li>Account and usage data for support and security</li>
  </ul>
<h2>Legal Basis</h2>
<p>Contract fulfilment, legal obligation (customs/AML), and legitimate interests (fraud prevention, service improvement).</p>
<h2>Sharing</h2>
<p>With suppliers (China/UAE/Korea), freight partners, customs (RRA), and local logistics solely to fulfill services.</p>
<h2>Security</h2>
<p>Encryption, access control, secure APIs, regular reviews, and limited access on a need‑to‑know basis.</p>
<h2>Retention</h2>
<p>Kept only as long as necessary for services and legal obligations; then securely deleted/anonymized.</p>
<h2>Cross‑Border Transfers</h2>
<p>Transfers protected by contractual and technical safeguards.</p>
<h2>Your Rights</h2>
<p>Access, correction, deletion, restriction, portability, and consent withdrawal. Contact the DPO to exercise rights.</p>'
            ],
        ];

        // Cookie Policy (single WYSIWYG)
        $pageContents['cookies'] = [
            [
                'key' => 'body',
                'label' => '',
                'content' => '<h1>Cookie Policy</h1>
<p><em>Last updated: [ADD_DATE]</em></p>
<p>We use cookies to operate our site, analyze traffic, and remember preferences.</p>
<h2>Categories</h2>
<ul>
  <li><strong>Essential:</strong> Required for core functionality and security</li>
  <li><strong>Analytics:</strong> Understand usage and improve performance</li>
  <li><strong>Preferences:</strong> Remember your settings and choices</li>
</ul>
<h2>Vendors &amp; Lifetimes</h2>
<p>Third‑party vendors (e.g., analytics) may set cookies with varying lifetimes (session/persistent). See the cookie preferences center for details.</p>
<h2>Manage Preferences</h2>
<p>Use our cookie preferences link to opt‑in/out of non‑essential categories at any time.</p>'
            ],
        ];

        // Shipping & Delivery (single WYSIWYG)
        $pageContents['shipping'] = [
            [
                'key' => 'body',
                'label' => '',
                'content' => '<h1>Shipping &amp; Delivery</h1>
<p>We consolidate at origin hubs and manage cross‑border logistics through to local delivery in Rwanda.</p>
<h2>Methods &amp; Routes</h2>
<ul>
  <li><strong>Air:</strong> Dubai → Kigali</li>
  <li><strong>Sea:</strong> China/Korea → Dar es Salaam → Kigali</li>
</ul>
<h2>Timelines</h2>
<ul>
  <li>Air: 4–10 business days</li>
  <li>Sea: 25–45 days</li>
</ul>
<p>ETAs depend on supplier readiness, consolidation schedules, port operations, and customs inspections.</p>
<h2>Risk &amp; Tracking</h2>
<p>Risk transfers at the Designated Delivery Point (unless insured). Tracking milestones are provided from dispatch to local delivery.</p>'
            ],
        ];

        // Returns & Refunds (single WYSIWYG)
        $pageContents['returns'] = [
            [
                'key' => 'body',
                'label' => '',
                'content' => '<h1>Returns &amp; Refunds</h1>
<h2>Eligibility</h2>
<p>Returns accepted for defective items, wrong items, or items not matching approved specifications.</p>
<h2>Conditions</h2>
<ul>
  <li>Unused with original packaging</li>
  <li>Claim within 48 hours of delivery unless supplier policy states otherwise</li>
  <li>Subject to re‑export and customs rules</li>
</ul>
<h2>Process</h2>
<p>Submit evidence (photos/videos) with your order number. We coordinate inspection and supplier review.</p>
<h2>Refunds</h2>
<p>Refunds are processed after supplier approval; international handling may take 15–30 days.</p>
<h2>Non‑Returnable</h2>
<p>Custom electronics, software‑activated items, sensors/ECUs, and items lacking export‑return authorization.</p>'
            ],
        ];

        // Warranty (single WYSIWYG)
        $pageContents['warranty'] = [
            [
                'key' => 'body',
                'label' => '',
                'content' => '<h1>Warranty</h1>
<p>Kora facilitates OEM/manufacturer warranties; Kora is not the warrantor.</p>
<h2>Durations</h2>
<p>Vary by supplier and category; certain components may legally carry no warranty.</p>
<h2>Eligibility</h2>
<p>Manufacturing defects reported within the supplier window and confirmed upon re‑inspection.</p>
<h2>Process</h2>
<p>Provide evidence; supplier determines repair, replacement, or credit. Timelines may range 15–45 days.</p>
<h2>Limitations</h2>
<p>Supplier decision is final; re‑export duties and shipping may apply unless covered by supplier.</p>'
            ],
        ];

        // Dispute Resolution (single WYSIWYG)
        $pageContents['dispute'] = [
            [
                'key' => 'body',
                'label' => '',
                'content' => '<h1>Dispute Resolution</h1>
<h2>Amicable Resolution</h2>
<p>Parties will first attempt to resolve disputes amicably within 30 days.</p>
<h2>Arbitration</h2>
<p>Unresolved disputes shall be resolved by binding arbitration under KIAC in Kigali, Rwanda, in English, before one arbitrator unless agreed otherwise. The award shall be final and enforceable.</p>
<h2>Contact</h2>
<p>Email: <a href="mailto:support@example.com">support@example.com</a></p>'
            ],
        ];

        // About (ensure single WYSIWYG body exists; keep existing rows)
        $defaultAboutBody = ['key' => 'body', 'label' => 'About Kora', 'content' => '<h1>About Kora</h1><p><strong>Kora</strong> is a Digital Procurement Corridor for Rwanda. We connect customers and businesses to verified suppliers in <em>China</em>, <em>Dubai (UAE)</em>, and <em>South Korea</em> using a request‑based procurement model built on <strong>transparent Total Landed Cost (TLC)</strong>, rigorous <strong>Quality Control (QC)</strong> at source, and <strong>end‑to‑end logistics</strong>.</p><h2>What We Do</h2><p>We source on demand, consolidate shipments, and manage customs clearance under EACCMA through to last‑mile delivery in Kigali—eliminating inventory‑risk premiums and unlocking access to specialized electronics and OEM auto parts.</p><h2>Why Kora</h2><ul><li><strong>Transparent TLC</strong>: itemized product, freight, insurance, duties/levies, VAT, and fees</li><li><strong>Quality Assured</strong>: pre‑shipment inspections, packaging standards, verified suppliers</li><li><strong>Predictable Logistics</strong>: hub tracking, documented routes, realistic ETAs</li></ul><h2>Our Mission</h2><p>Connect Rwanda to global manufacturing hubs with radical pricing transparency and reliable logistics—so innovators can build with confidence.</p><h2>Our Vision</h2><p>To be Rwanda’s most trusted cross‑border procurement platform for high‑quality electronics and OEM components—accelerating digital transformation and resilient supply chains.</p>'];
        if (!isset($pageContents['about'])) {
            $pageContents['about'] = [
                $defaultAboutBody,
                ['key' => 'mission', 'label' => 'Our Mission', 'content' => 'Connect Rwanda to global hubs with transparent TLC, QC, and reliable logistics.'],
                ['key' => 'hubs', 'label' => 'Sourcing Hubs', 'content' => 'China, Dubai, South Korea'],
                ['key' => 'compliance', 'label' => 'Compliance', 'content' => 'Follows Rwanda consumer and data protection laws, and EACCMA.'],
            ];
        } else {
            $hasBody = collect($pageContents['about'])->contains(fn ($s) => ($s['key'] ?? null) === 'body');
            if (!$hasBody) {
                array_unshift($pageContents['about'], $defaultAboutBody);
            }
        }

        // Contact (single WYSIWYG)
        $pageContents['contact'] = [
            [
                'key' => 'body',
                'label' => '',
                'content' => '<h1>Contact Us</h1>
<h2>Addresses</h2>
<p>Dubai: [ADD_ADDRESS_DUBAI]<br/>Kigali: [ADD_ADDRESS_KIGALI]</p>
<h2>Phone</h2>
<p>Dubai: [+971-XXX-XXXXXX]<br/>Kigali: [+250-XXX-XXXXXX]</p>
<h2>Email</h2>
<p>Support: <a href="mailto:support@example.com">support@example.com</a><br/>Orders: <a href="mailto:orders@example.com">orders@example.com</a></p>
<h2>Business Hours</h2>
<p>Mon–Fri 09:00–18:00; Sat 10:00–16:00; Sun Closed</p>'
            ],
        ];

        // FAQ
        $pageContents['faq'] = $pageContents['faq'] ?? [
            ['key' => 'q_ordering', 'label' => 'Ordering', 'content' => 'How do I place a request? Approve the TLC quote to proceed.'],
            ['key' => 'q_payment', 'label' => 'Payments', 'content' => 'What payment methods are supported? Methods depend on region; all orders require confirmation.'],
            ['key' => 'q_shipping', 'label' => 'Shipping', 'content' => 'What are the delivery timelines? Air 4–10 business days; Sea 25–45 days.'],
            ['key' => 'q_customs', 'label' => 'Customs', 'content' => 'Who handles customs? Kora manages customs under EACCMA.'],
            ['key' => 'q_returns', 'label' => 'Returns', 'content' => 'When are returns accepted? For defects/mismatches within 48 hours report window.'],
            ['key' => 'q_warranty', 'label' => 'Warranty', 'content' => 'Who provides warranty? OEM/manufacturer; Kora facilitates claims.'],
            ['key' => 'q_privacy', 'label' => 'Privacy', 'content' => 'How is my data used? Only to fulfill your orders and comply with law.'],
            ['key' => 'q_disputes', 'label' => 'Disputes', 'content' => 'How are disputes handled? Amicable window then KIAC arbitration.'],
        ];

        $config['page_contents'] = $pageContents;
        $tenant->config = $config;
        $tenant->save();
        $this->command->info('PageContent and SiteConfig seeded into Tenant config.');
    }
}


