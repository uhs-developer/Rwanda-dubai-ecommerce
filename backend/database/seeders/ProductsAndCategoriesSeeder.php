<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Brand;
use App\Models\Product;
use App\Models\ProductImage;

class ProductsAndCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing data
        ProductImage::truncate();
        Product::truncate();
        Subcategory::truncate();
        Brand::truncate();
        Category::truncate();

        // Create Categories
        $electronics = Category::create([
            'name' => 'Electronics',
            'slug' => 'electronics',
            'description' => 'Latest electronic devices and gadgets',
            'image' => 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300',
            'is_active' => true,
            'sort_order' => 1
        ]);

        $autoParts = Category::create([
            'name' => 'Auto Parts',
            'slug' => 'auto-parts',
            'description' => 'Quality automotive parts and accessories',
            'image' => 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300',
            'is_active' => true,
            'sort_order' => 2
        ]);

        $homeAppliances = Category::create([
            'name' => 'Home Appliances',
            'slug' => 'home-appliances',
            'description' => 'Modern home appliances for every need',
            'image' => 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300',
            'is_active' => true,
            'sort_order' => 3
        ]);

        $tools = Category::create([
            'name' => 'Tools & Equipment',
            'slug' => 'tools-equipment',
            'description' => 'Professional tools and equipment',
            'image' => 'https://images.unsplash.com/photo-1530209625688-2b0cc4c4a05b?w=400&h=300',
            'is_active' => true,
            'sort_order' => 4
        ]);

        // Create Subcategories
        $smartphones = Subcategory::create([
            'category_id' => $electronics->id,
            'name' => 'Smartphones',
            'slug' => 'smartphones',
            'is_active' => true
        ]);

        $laptops = Subcategory::create([
            'category_id' => $electronics->id,
            'name' => 'Laptops',
            'slug' => 'laptops',
            'is_active' => true
        ]);

        $tablets = Subcategory::create([
            'category_id' => $electronics->id,
            'name' => 'Tablets',
            'slug' => 'tablets',
            'is_active' => true
        ]);

        $audio = Subcategory::create([
            'category_id' => $electronics->id,
            'name' => 'Audio',
            'slug' => 'audio',
            'is_active' => true
        ]);

        $hyundai = Subcategory::create([
            'category_id' => $autoParts->id,
            'name' => 'Hyundai',
            'slug' => 'hyundai',
            'is_active' => true
        ]);

        $toyota = Subcategory::create([
            'category_id' => $autoParts->id,
            'name' => 'Toyota',
            'slug' => 'toyota',
            'is_active' => true
        ]);

        $honda = Subcategory::create([
            'category_id' => $autoParts->id,
            'name' => 'Honda',
            'slug' => 'honda',
            'is_active' => true
        ]);

        $kitchen = Subcategory::create([
            'category_id' => $homeAppliances->id,
            'name' => 'Kitchen',
            'slug' => 'kitchen',
            'is_active' => true
        ]);

        $laundry = Subcategory::create([
            'category_id' => $homeAppliances->id,
            'name' => 'Laundry',
            'slug' => 'laundry',
            'is_active' => true
        ]);

        $handTools = Subcategory::create([
            'category_id' => $tools->id,
            'name' => 'Hand Tools',
            'slug' => 'hand-tools',
            'is_active' => true
        ]);

        $powerTools = Subcategory::create([
            'category_id' => $tools->id,
            'name' => 'Power Tools',
            'slug' => 'power-tools',
            'is_active' => true
        ]);

        // Create Brands
        $apple = Brand::create([
            'name' => 'Apple',
            'slug' => 'apple',
            'description' => 'Premium technology products',
            'is_active' => true
        ]);

        $samsung = Brand::create([
            'name' => 'Samsung',
            'slug' => 'samsung',
            'description' => 'Innovative electronics and technology',
            'is_active' => true
        ]);

        $sony = Brand::create([
            'name' => 'Sony',
            'slug' => 'sony',
            'description' => 'Entertainment and electronics',
            'is_active' => true
        ]);

        $lg = Brand::create([
            'name' => 'LG',
            'slug' => 'lg',
            'description' => 'Life is good with LG',
            'is_active' => true
        ]);

        $bosch = Brand::create([
            'name' => 'Bosch',
            'slug' => 'bosch',
            'description' => 'German engineering excellence',
            'is_active' => true
        ]);

        $makita = Brand::create([
            'name' => 'Makita',
            'slug' => 'makita',
            'description' => 'Professional power tools',
            'is_active' => true
        ]);

        $dewalt = Brand::create([
            'name' => 'DeWalt',
            'slug' => 'dewalt',
            'description' => 'Professional grade tools',
            'is_active' => true
        ]);

        // Create Sample Products
        $products = [
            // Apple Products
            [
                'name' => 'iPhone 15 Pro Max 256GB',
                'slug' => 'iphone-15-pro-max-256gb',
                'description' => 'The most advanced iPhone ever with titanium design, A17 Pro chip, and revolutionary camera system.',
                'short_description' => 'The most advanced iPhone ever with titanium design.',
                'category_id' => $electronics->id,
                'subcategory_id' => $smartphones->id,
                'brand_id' => $apple->id,
                'price' => 1299.00,
                'original_price' => 1399.00,
                'stock_quantity' => 50,
                'in_stock' => true,
                'sku' => 'APL-IPH15PM-256',
                'specifications' => [
                    'Display' => '6.7-inch Super Retina XDR',
                    'Storage' => '256GB',
                    'Camera' => '48MP Main, 12MP Ultra Wide, 12MP Telephoto',
                    'Chip' => 'A17 Pro'
                ],
                'features' => ['Face ID', 'MagSafe', 'Wireless Charging'],
                'tags' => ['flagship', 'premium', '5g'],
                'average_rating' => 4.8,
                'total_reviews' => 2156,
                'is_active' => true,
                'is_featured' => true,
                'published_at' => now(),
            ],
            [
                'name' => 'iPhone 14 128GB',
                'slug' => 'iphone-14-128gb',
                'description' => 'Powerful A15 Bionic chip, advanced camera system, and all-day battery life.',
                'short_description' => 'Powerful A15 Bionic chip with advanced camera.',
                'category_id' => $electronics->id,
                'subcategory_id' => $smartphones->id,
                'brand_id' => $apple->id,
                'price' => 799.00,
                'original_price' => 899.00,
                'stock_quantity' => 75,
                'in_stock' => true,
                'sku' => 'APL-IPH14-128',
                'specifications' => [
                    'Display' => '6.1-inch Super Retina XDR',
                    'Storage' => '128GB',
                    'Camera' => '12MP Dual Camera',
                    'Chip' => 'A15 Bionic'
                ],
                'features' => ['Face ID', 'MagSafe', '5G'],
                'tags' => ['5g', 'camera', 'battery'],
                'average_rating' => 4.6,
                'total_reviews' => 1890,
                'is_active' => true,
                'is_featured' => false,
                'published_at' => now(),
            ],
            [
                'name' => 'MacBook Pro 14" M3 Pro',
                'slug' => 'macbook-pro-14-m3-pro',
                'description' => 'Revolutionary M3 Pro chip, stunning Liquid Retina XDR display, and up to 22 hours battery life.',
                'short_description' => 'Revolutionary M3 Pro chip with stunning display.',
                'category_id' => $electronics->id,
                'subcategory_id' => $laptops->id,
                'brand_id' => $apple->id,
                'price' => 1999.00,
                'original_price' => 2199.00,
                'stock_quantity' => 25,
                'in_stock' => true,
                'sku' => 'APL-MBP14-M3P',
                'specifications' => [
                    'Display' => '14-inch Liquid Retina XDR',
                    'Processor' => 'M3 Pro',
                    'Memory' => '18GB Unified Memory',
                    'Storage' => '512GB SSD'
                ],
                'features' => ['Touch Bar', 'Force Touch trackpad', 'Backlit Magic Keyboard'],
                'tags' => ['laptop', 'professional', 'creative'],
                'average_rating' => 4.9,
                'total_reviews' => 892,
                'is_active' => true,
                'is_featured' => true,
                'published_at' => now(),
            ],
            [
                'name' => 'iPad Air 5th Gen 256GB',
                'slug' => 'ipad-air-5th-gen-256gb',
                'description' => 'Powerful M1 chip, stunning 10.9-inch Liquid Retina display, and all-day battery life.',
                'short_description' => 'Powerful M1 chip with stunning display.',
                'category_id' => $electronics->id,
                'subcategory_id' => $tablets->id,
                'brand_id' => $apple->id,
                'price' => 749.00,
                'original_price' => 799.00,
                'stock_quantity' => 40,
                'in_stock' => true,
                'sku' => 'APL-IPADAIR5-256',
                'specifications' => [
                    'Display' => '10.9-inch Liquid Retina',
                    'Processor' => 'M1 chip',
                    'Storage' => '256GB',
                    'Camera' => '12MP Ultra Wide front camera'
                ],
                'features' => ['Touch ID', 'Apple Pencil support', 'Smart Keyboard'],
                'tags' => ['tablet', 'creative', 'portable'],
                'average_rating' => 4.7,
                'total_reviews' => 567,
                'is_active' => true,
                'is_featured' => false,
                'published_at' => now(),
            ],

            // Samsung Products
            [
                'name' => 'Samsung Galaxy S24 Ultra',
                'slug' => 'samsung-galaxy-s24-ultra',
                'description' => 'The ultimate Android experience with S Pen, advanced AI features, and pro-grade cameras.',
                'short_description' => 'Ultimate Android experience with S Pen.',
                'category_id' => $electronics->id,
                'subcategory_id' => $smartphones->id,
                'brand_id' => $samsung->id,
                'price' => 1199.00,
                'original_price' => 1299.00,
                'stock_quantity' => 25,
                'in_stock' => true,
                'sku' => 'SAM-GS24U-256',
                'specifications' => [
                    'Display' => '6.8-inch Dynamic AMOLED 2X',
                    'Storage' => '256GB',
                    'Camera' => '200MP Main',
                    'Processor' => 'Snapdragon 8 Gen 3'
                ],
                'features' => ['S Pen included', '100x Zoom', 'IP68'],
                'tags' => ['android', 's-pen', 'camera'],
                'average_rating' => 4.7,
                'total_reviews' => 1567,
                'is_active' => true,
                'is_featured' => true,
                'published_at' => now(),
            ],
            [
                'name' => 'Samsung Galaxy Tab S9 Ultra',
                'slug' => 'samsung-galaxy-tab-s9-ultra',
                'description' => 'Massive 14.6-inch display, S Pen included, and powerful Snapdragon 8 Gen 2 processor.',
                'short_description' => 'Massive 14.6-inch display with S Pen.',
                'category_id' => $electronics->id,
                'subcategory_id' => $tablets->id,
                'brand_id' => $samsung->id,
                'price' => 999.00,
                'original_price' => 1099.00,
                'stock_quantity' => 30,
                'in_stock' => true,
                'sku' => 'SAM-TABS9U-256',
                'specifications' => [
                    'Display' => '14.6-inch Dynamic AMOLED 2X',
                    'Processor' => 'Snapdragon 8 Gen 2',
                    'Storage' => '256GB',
                    'RAM' => '12GB'
                ],
                'features' => ['S Pen included', '5G', 'AKG Quad Speakers'],
                'tags' => ['tablet', 'large-screen', 'productivity'],
                'average_rating' => 4.6,
                'total_reviews' => 423,
                'is_active' => true,
                'is_featured' => false,
                'published_at' => now(),
            ],
            [
                'name' => 'Samsung QLED 4K Smart TV 65"',
                'slug' => 'samsung-qled-4k-smart-tv-65',
                'description' => 'Quantum Dot technology, 4K resolution, and smart features for the ultimate viewing experience.',
                'short_description' => 'Quantum Dot technology with 4K resolution.',
                'category_id' => $electronics->id,
                'subcategory_id' => $audio->id,
                'brand_id' => $samsung->id,
                'price' => 1499.00,
                'original_price' => 1799.00,
                'stock_quantity' => 15,
                'in_stock' => true,
                'sku' => 'SAM-QLED65-4K',
                'specifications' => [
                    'Display' => '65-inch QLED 4K',
                    'Resolution' => '3840 x 2160',
                    'HDR' => 'HDR10+',
                    'Smart Features' => 'Tizen OS'
                ],
                'features' => ['Quantum Dot', '4K Upscaling', 'Smart Hub'],
                'tags' => ['tv', '4k', 'smart', 'qled'],
                'average_rating' => 4.5,
                'total_reviews' => 234,
                'is_active' => true,
                'is_featured' => false,
                'published_at' => now(),
            ],

            // Sony Products
            [
                'name' => 'Sony WH-1000XM5 Headphones',
                'slug' => 'sony-wh-1000xm5-headphones',
                'description' => 'Industry-leading noise canceling with Dual Noise Sensor technology and exceptional sound quality.',
                'short_description' => 'Industry-leading noise canceling headphones.',
                'category_id' => $electronics->id,
                'subcategory_id' => $audio->id,
                'brand_id' => $sony->id,
                'price' => 399.00,
                'original_price' => 449.00,
                'stock_quantity' => 60,
                'in_stock' => true,
                'sku' => 'SONY-WH1000XM5',
                'specifications' => [
                    'Driver' => '30mm Dynamic',
                    'Frequency' => '4Hz-40kHz',
                    'Battery' => 'Up to 30 hours',
                    'Weight' => '250g'
                ],
                'features' => ['Noise Canceling', 'Touch Controls', 'Quick Charge'],
                'tags' => ['headphones', 'noise-canceling', 'wireless'],
                'average_rating' => 4.8,
                'total_reviews' => 1890,
                'is_active' => true,
                'is_featured' => true,
                'published_at' => now(),
            ],

            // LG Products
            [
                'name' => 'LG OLED 4K Smart TV 55"',
                'slug' => 'lg-oled-4k-smart-tv-55',
                'description' => 'Perfect blacks, infinite contrast, and webOS smart platform for the ultimate home entertainment.',
                'short_description' => 'Perfect blacks with infinite contrast.',
                'category_id' => $electronics->id,
                'subcategory_id' => $audio->id,
                'brand_id' => $lg->id,
                'price' => 1299.00,
                'original_price' => 1599.00,
                'stock_quantity' => 20,
                'in_stock' => true,
                'sku' => 'LG-OLED55-4K',
                'specifications' => [
                    'Display' => '55-inch OLED 4K',
                    'Resolution' => '3840 x 2160',
                    'HDR' => 'Dolby Vision',
                    'Smart Platform' => 'webOS'
                ],
                'features' => ['OLED Display', 'AI Picture Pro', 'Magic Remote'],
                'tags' => ['tv', 'oled', '4k', 'smart'],
                'average_rating' => 4.7,
                'total_reviews' => 567,
                'is_active' => true,
                'is_featured' => false,
                'published_at' => now(),
            ],
            [
                'name' => 'LG Front Load Washer 9kg',
                'slug' => 'lg-front-load-washer-9kg',
                'description' => 'Steam technology, AI Direct Drive, and 6 Motion technology for gentle yet effective cleaning.',
                'short_description' => 'Steam technology with AI Direct Drive.',
                'category_id' => $homeAppliances->id,
                'subcategory_id' => $laundry->id,
                'brand_id' => $lg->id,
                'price' => 899.00,
                'original_price' => 1099.00,
                'stock_quantity' => 35,
                'in_stock' => true,
                'sku' => 'LG-WASHER-9KG',
                'specifications' => [
                    'Capacity' => '9kg',
                    'Energy Rating' => 'A+++',
                    'Spin Speed' => '1400 RPM',
                    'Programs' => '14'
                ],
                'features' => ['Steam Function', 'AI Direct Drive', '6 Motion'],
                'tags' => ['washer', 'front-load', 'steam'],
                'average_rating' => 4.6,
                'total_reviews' => 234,
                'is_active' => true,
                'is_featured' => false,
                'published_at' => now(),
            ],

            // Bosch Products
            [
                'name' => 'Bosch Dishwasher Serie 8',
                'slug' => 'bosch-dishwasher-serie-8',
                'description' => 'Silent operation, perfect results, and innovative features for modern kitchens.',
                'short_description' => 'Silent operation with perfect results.',
                'category_id' => $homeAppliances->id,
                'subcategory_id' => $kitchen->id,
                'brand_id' => $bosch->id,
                'price' => 799.00,
                'original_price' => 899.00,
                'stock_quantity' => 25,
                'in_stock' => true,
                'sku' => 'BOSCH-DISH-S8',
                'specifications' => [
                    'Capacity' => '14 place settings',
                    'Noise Level' => '44 dB',
                    'Energy Rating' => 'A+++',
                    'Programs' => '7'
                ],
                'features' => ['Silent Operation', 'PerfectDry', 'Home Connect'],
                'tags' => ['dishwasher', 'silent', 'energy-efficient'],
                'average_rating' => 4.8,
                'total_reviews' => 456,
                'is_active' => true,
                'is_featured' => true,
                'published_at' => now(),
            ],

            // Makita Products
            [
                'name' => 'Makita 18V LXT Drill Driver',
                'slug' => 'makita-18v-lxt-drill-driver',
                'description' => 'Professional grade drill driver with brushless motor and ergonomic design.',
                'short_description' => 'Professional grade drill driver.',
                'category_id' => $tools->id,
                'subcategory_id' => $powerTools->id,
                'brand_id' => $makita->id,
                'price' => 199.00,
                'original_price' => 249.00,
                'stock_quantity' => 80,
                'in_stock' => true,
                'sku' => 'MAKITA-DRILL-18V',
                'specifications' => [
                    'Voltage' => '18V',
                    'Chuck Size' => '13mm',
                    'Speed' => '0-600/0-1900 RPM',
                    'Weight' => '1.4kg'
                ],
                'features' => ['Brushless Motor', 'LED Light', 'Ergonomic Grip'],
                'tags' => ['drill', 'power-tool', 'professional'],
                'average_rating' => 4.7,
                'total_reviews' => 890,
                'is_active' => true,
                'is_featured' => false,
                'published_at' => now(),
            ],

            // DeWalt Products
            [
                'name' => 'DeWalt 20V MAX Circular Saw',
                'slug' => 'dewalt-20v-max-circular-saw',
                'description' => 'Powerful circular saw with brushless motor and electric brake for safety.',
                'short_description' => 'Powerful circular saw with brushless motor.',
                'category_id' => $tools->id,
                'subcategory_id' => $powerTools->id,
                'brand_id' => $dewalt->id,
                'price' => 299.00,
                'original_price' => 349.00,
                'stock_quantity' => 45,
                'in_stock' => true,
                'sku' => 'DEWALT-CSAW-20V',
                'specifications' => [
                    'Voltage' => '20V MAX',
                    'Blade Size' => '6-1/2 inch',
                    'Cut Depth' => '2-1/8 inch',
                    'Weight' => '2.9kg'
                ],
                'features' => ['Brushless Motor', 'Electric Brake', 'LED Light'],
                'tags' => ['circular-saw', 'power-tool', 'professional'],
                'average_rating' => 4.6,
                'total_reviews' => 567,
                'is_active' => true,
                'is_featured' => false,
                'published_at' => now(),
            ],

            // Auto Parts Products
            [
                'name' => 'Hyundai Elantra Brake Pads',
                'slug' => 'hyundai-elantra-brake-pads',
                'description' => 'High-quality brake pads for Hyundai Elantra models, ensuring safe and reliable braking.',
                'short_description' => 'High-quality brake pads for Hyundai Elantra.',
                'category_id' => $autoParts->id,
                'subcategory_id' => $hyundai->id,
                'brand_id' => $bosch->id,
                'price' => 89.99,
                'original_price' => 119.99,
                'stock_quantity' => 120,
                'in_stock' => true,
                'sku' => 'HYUNDAI-BRAKE-ELANTRA',
                'specifications' => [
                    'Material' => 'Ceramic',
                    'Fitment' => 'Hyundai Elantra 2016-2023',
                    'Type' => 'Front Brake Pads',
                    'Warranty' => '2 years'
                ],
                'features' => ['Low Dust', 'Quiet Operation', 'Long Life'],
                'tags' => ['brake-pads', 'hyundai', 'elantra'],
                'average_rating' => 4.5,
                'total_reviews' => 234,
                'is_active' => true,
                'is_featured' => false,
                'published_at' => now(),
            ],
            [
                'name' => 'Toyota Camry Air Filter',
                'slug' => 'toyota-camry-air-filter',
                'description' => 'Premium air filter for Toyota Camry, ensuring clean air intake for optimal engine performance.',
                'short_description' => 'Premium air filter for Toyota Camry.',
                'category_id' => $autoParts->id,
                'subcategory_id' => $toyota->id,
                'brand_id' => $bosch->id,
                'price' => 24.99,
                'original_price' => 34.99,
                'stock_quantity' => 200,
                'in_stock' => true,
                'sku' => 'TOYOTA-AIR-CAMRY',
                'specifications' => [
                    'Material' => 'Synthetic',
                    'Fitment' => 'Toyota Camry 2018-2023',
                    'Type' => 'Engine Air Filter',
                    'Warranty' => '1 year'
                ],
                'features' => ['High Filtration', 'Long Life', 'Easy Installation'],
                'tags' => ['air-filter', 'toyota', 'camry'],
                'average_rating' => 4.4,
                'total_reviews' => 189,
                'is_active' => true,
                'is_featured' => false,
                'published_at' => now(),
            ],
        ];

        // Create products
        foreach ($products as $productData) {
            $product = Product::create($productData);

            // Create product image
            ProductImage::create([
                'product_id' => $product->id,
                'image_url' => 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800',
                'alt_text' => $product->name,
                'is_primary' => true,
                'sort_order' => 1
            ]);
        }

        $this->command->info('Created ' . count($products) . ' products with various brands, categories, and subcategories!');
    }
}
