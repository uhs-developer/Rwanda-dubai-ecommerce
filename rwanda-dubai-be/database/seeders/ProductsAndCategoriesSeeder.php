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

        $hyundai = Subcategory::create([
            'category_id' => $autoParts->id,
            'name' => 'Hyundai',
            'slug' => 'hyundai',
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

        // Create Sample Products
        $iphone = Product::create([
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
        ]);

        $galaxy = Product::create([
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
        ]);

        // Create Product Images
        ProductImage::create([
            'product_id' => $iphone->id,
            'image_url' => 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800',
            'alt_text' => $iphone->name,
            'is_primary' => true,
            'sort_order' => 1
        ]);

        ProductImage::create([
            'product_id' => $galaxy->id,
            'image_url' => 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800',
            'alt_text' => $galaxy->name,
            'is_primary' => true,
            'sort_order' => 1
        ]);
    }
}
