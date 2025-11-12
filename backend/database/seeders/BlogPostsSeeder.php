<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\User;

class BlogPostsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('email', 'admin@rwandadubai.com')->first();

        if (!$admin) {
            $this->command->error('Admin user not found. Please run UserSeeder first.');
            return;
        }

        $posts = [
            [
                'title' => 'The Future of Rwanda-Dubai Trade Relations',
                'body' => 'The trade relationship between Rwanda and Dubai continues to strengthen, with significant growth in e-commerce and cross-border commerce. This article explores the key developments and future opportunities in this dynamic partnership.

The partnership between Rwanda and the UAE has seen remarkable growth in recent years, particularly in the areas of technology, logistics, and cross-border e-commerce. Dubai\'s strategic location as a global trade hub combined with Rwanda\'s progressive economic policies has created unique opportunities for businesses on both sides.

Key areas of growth include:
- Technology and innovation partnerships
- Logistics and supply chain optimization
- E-commerce platform development
- Investment in infrastructure
- Skills development and knowledge transfer

The Rwanda-Dubai e-commerce platform represents a new frontier in African-UAE trade relations, offering businesses unprecedented access to new markets and customers.',
            ],
            [
                'title' => 'How Dubai Merchants Are Succeeding in Rwanda Market',
                'body' => 'Dubai-based merchants are finding tremendous success in the Rwandan market through strategic partnerships and understanding of local consumer preferences. Here\'s how they\'re achieving remarkable results.

Understanding the local market is crucial for success in Rwanda. Dubai merchants who have invested time in understanding Rwandan consumer behavior, preferences, and cultural nuances have seen the best results.

Key success factors:
1. **Local Partnerships**: Collaborating with local distributors and retailers
2. **Cultural Adaptation**: Adapting products and marketing to local preferences
3. **Quality Assurance**: Maintaining high product standards
4. **Customer Service**: Providing excellent after-sales support
5. **Logistics Optimization**: Efficient shipping and delivery solutions

Several Dubai merchants have reported 200-300% growth in their Rwandan operations within the first year of market entry, demonstrating the significant potential of this market.',
            ],
            [
                'title' => 'E-commerce Trends: What Rwandan Consumers Want',
                'body' => 'Understanding consumer behavior in Rwanda is essential for successful e-commerce operations. This comprehensive analysis covers the latest trends and preferences of Rwandan online shoppers.

Rwandan consumers are increasingly turning to online shopping, driven by improved internet connectivity, smartphone penetration, and changing lifestyles. Key trends include:

**Mobile Commerce Dominance**
- 85% of online purchases happen via mobile devices
- Preference for mobile payment solutions like MTN Mobile Money
- Demand for fast, reliable delivery services

**Popular Product Categories**
- Electronics and smartphones remain top sellers
- Fashion and apparel showing strong growth
- Home appliances and furniture gaining traction
- Food and beverages from international brands

**Consumer Preferences**
- Value for money and product quality
- Trust in established brands
- Fast and reliable delivery
- Good customer service
- Secure payment options

Dubai merchants who adapt to these preferences and invest in mobile-optimized platforms are seeing the best results in the Rwandan market.',
            ],
            [
                'title' => 'Logistics and Shipping: Connecting Dubai to Rwanda',
                'body' => 'Efficient logistics and shipping solutions are crucial for successful cross-border e-commerce between Dubai and Rwanda. This guide covers the key aspects of international shipping and logistics.

The distance between Dubai and Rwanda is approximately 4,500 km, but modern logistics solutions have made shipping faster and more reliable than ever. Key logistics considerations include:

**Shipping Methods**
- Air freight for urgent, high-value items (3-5 days)
- Sea freight for bulk, non-urgent shipments (2-4 weeks)
- Express courier services for small packages (5-7 days)

**Customs and Documentation**
- Understanding Rwandan customs regulations
- Required documentation for imports
- Duty calculations and payment processes
- Prohibited and restricted items

**Local Delivery Solutions**
- Partnership with local courier services
- Last-mile delivery optimization
- Customer tracking and communication
- Returns and exchange handling

**Technology Solutions**
- Real-time tracking systems
- Automated customs clearance
- Warehouse management systems
- Integration with e-commerce platforms

Successful merchants invest in reliable logistics partners and maintain transparent communication with customers about delivery timelines and processes.',
            ],
            [
                'title' => 'Building Trust: Customer Service Excellence in Rwanda',
                'body' => 'Exceptional customer service is the foundation of successful e-commerce operations in Rwanda. Learn how to build trust and maintain strong customer relationships.

Building trust with Rwandan customers requires consistent effort and genuine commitment to customer satisfaction. Key elements include:

**Communication Excellence**
- Clear and timely responses to inquiries
- Transparent communication about orders and delivery
- Multilingual customer support (English, Kinyarwanda, French)
- Proactive updates on order status

**Quality Assurance**
- Accurate product descriptions
- High-quality product photography
- Honest pricing and shipping costs
- Reliable delivery promises

**After-Sales Support**
- Easy returns and exchange processes
- Responsive customer service
- Product warranties and guarantees
- Loyalty programs and incentives

**Cultural Considerations**
- Understanding Rwandan business etiquette
- Respect for local customs and traditions
- Building personal relationships
- Community involvement and social responsibility

Dubai merchants who prioritize customer service excellence typically see higher customer retention rates, positive word-of-mouth marketing, and sustainable business growth in the Rwandan market.',
            ],
        ];

        foreach ($posts as $postData) {
            Post::create($postData);
        }

        $this->command->info('Created ' . count($posts) . ' blog posts for the Rwanda-Dubai commerce platform');
    }
}
