<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Brand;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;

class RwandaDubaiCommerceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Starting Rwanda-Dubai Commerce Seeder...');

        // Create additional categories specific to Rwanda-Dubai trade
        $this->createAdditionalCategories();

        // Create Rwanda-specific brands
        $this->createRwandaBrands();

        // Create additional products
        $this->createAdditionalProducts();

        // Create fashion and textiles category
        $this->createFashionTextiles();

        // Create food and beverages
        $this->createFoodBeverages();

        // Create construction materials
        $this->createConstructionMaterials();

        $this->command->info('Rwanda-Dubai Commerce Seeder completed!');
    }

    private function createAdditionalCategories()
    {
        // Fashion & Textiles
        $fashion = Category::create([
            'name' => 'Fashion & Textiles',
            'slug' => 'fashion-textiles',
            'description' => 'Premium fashion and textile products from Dubai to Rwanda',
            'image' => 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300',
            'is_active' => true,
            'sort_order' => 5
        ]);

        // Food & Beverages
        $foodBeverages = Category::create([
            'name' => 'Food & Beverages',
            'slug' => 'food-beverages',
            'description' => 'Quality food and beverages imported from Dubai',
            'image' => 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300',
            'is_active' => true,
            'sort_order' => 6
        ]);

        // Construction Materials
        $construction = Category::create([
            'name' => 'Construction Materials',
            'slug' => 'construction-materials',
            'description' => 'Building materials and construction supplies',
            'image' => 'https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=400&h=300',
            'is_active' => true,
            'sort_order' => 7
        ]);

        // Create subcategories for fashion
        $mensFashion = Subcategory::create([
            'category_id' => $fashion->id,
            'name' => 'Men\'s Fashion',
            'slug' => 'mens-fashion',
            'is_active' => true
        ]);

        $womensFashion = Subcategory::create([
            'category_id' => $fashion->id,
            'name' => 'Women\'s Fashion',
            'slug' => 'womens-fashion',
            'is_active' => true
        ]);

        $kidsFashion = Subcategory::create([
            'category_id' => $fashion->id,
            'name' => 'Kids Fashion',
            'slug' => 'kids-fashion',
            'is_active' => true
        ]);

        // Create subcategories for food
        $beverages = Subcategory::create([
            'category_id' => $foodBeverages->id,
            'name' => 'Beverages',
            'slug' => 'beverages',
            'is_active' => true
        ]);

        $snacks = Subcategory::create([
            'category_id' => $foodBeverages->id,
            'name' => 'Snacks & Confectionery',
            'slug' => 'snacks-confectionery',
            'is_active' => true
        ]);

        // Create subcategories for construction
        $buildingMaterials = Subcategory::create([
            'category_id' => $construction->id,
            'name' => 'Building Materials',
            'slug' => 'building-materials',
            'is_active' => true
        ]);

        $electrical = Subcategory::create([
            'category_id' => $construction->id,
            'name' => 'Electrical Supplies',
            'slug' => 'electrical-supplies',
            'is_active' => true
        ]);

        $plumbing = Subcategory::create([
            'category_id' => $construction->id,
            'name' => 'Plumbing Materials',
            'slug' => 'plumbing-materials',
            'is_active' => true
        ]);
    }

    private function createRwandaBrands()
    {
        $rwandaBrands = [
            [
                'name' => 'Kigali Textiles',
                'slug' => 'kigali-textiles',
                'description' => 'Premium Rwandan textiles and fabrics',
                'is_active' => true
            ],
            [
                'name' => 'Rwanda Coffee Co',
                'slug' => 'rwanda-coffee-co',
                'description' => 'World-famous Rwandan coffee products',
                'is_active' => true
            ],
            [
                'name' => 'Virunga Crafts',
                'slug' => 'virunga-crafts',
                'description' => 'Handcrafted products from Rwanda',
                'is_active' => true
            ],
            [
                'name' => 'Akagera Foods',
                'slug' => 'akagera-foods',
                'description' => 'Premium Rwandan food products',
                'is_active' => true
            ],
        ];

        foreach ($rwandaBrands as $brandData) {
            Brand::create($brandData);
        }
    }

    private function createFashionTextiles()
    {
        $fashion = Category::where('slug', 'fashion-textiles')->first();
        $mensFashion = Subcategory::where('slug', 'mens-fashion')->first();
        $womensFashion = Subcategory::where('slug', 'womens-fashion')->first();

        // Dubai Fashion Brands
        $fashionBrands = [
            [
                'name' => 'Dubai Fashion House',
                'slug' => 'dubai-fashion-house',
                'description' => 'Luxury fashion from Dubai designers',
                'is_active' => true
            ],
            [
                'name' => 'Emirates Couture',
                'slug' => 'emirates-couture',
                'description' => 'Traditional and modern Emirati fashion',
                'is_active' => true
            ],
            [
                'name' => 'Gulf Textiles',
                'slug' => 'gulf-textiles',
                'description' => 'High-quality textiles from the Gulf region',
                'is_active' => true
            ],
        ];

        foreach ($fashionBrands as $brandData) {
            $brand = Brand::create($brandData);

            // Create fashion products
            if ($mensFashion) {
                $this->createFashionProduct($fashion, $mensFashion, $brand, 'men');
            }
            if ($womensFashion) {
                $this->createFashionProduct($fashion, $womensFashion, $brand, 'women');
            }
        }
    }

    private function createFashionProduct($category, $subcategory, $brand, $gender)
    {
        $products = [
            'men' => [
                [
                    'name' => 'Premium Cotton Shirt',
                    'price' => 45.00,
                    'description' => 'High-quality cotton shirt perfect for business and casual wear',
                ],
                [
                    'name' => 'Designer Polo Shirt',
                    'price' => 65.00,
                    'description' => 'Stylish polo shirt with premium fabric and modern design',
                ],
                [
                    'name' => 'Luxury Thobe',
                    'price' => 120.00,
                    'description' => 'Traditional Emirati thobe made from premium fabric',
                ],
            ],
            'women' => [
                [
                    'name' => 'Elegant Abaya',
                    'price' => 85.00,
                    'description' => 'Beautiful embroidered abaya with modern design',
                ],
                [
                    'name' => 'Designer Hijab Set',
                    'price' => 35.00,
                    'description' => 'Premium hijab set with matching accessories',
                ],
                [
                    'name' => 'Luxury Dress',
                    'price' => 150.00,
                    'description' => 'Elegant dress perfect for special occasions',
                ],
            ],
        ];

        foreach ($products[$gender] as $productData) {
            $product = Product::create([
                'name' => $productData['name'] . ' - ' . $brand->name,
                'slug' => Str::slug($productData['name'] . ' ' . $brand->name),
                'description' => $productData['description'],
                'short_description' => $productData['description'],
                'category_id' => $category->id,
                'subcategory_id' => $subcategory->id,
                'brand_id' => $brand->id,
                'price' => $productData['price'],
                'stock_quantity' => rand(20, 100),
                'in_stock' => true,
                'sku' => 'FASH-' . strtoupper(Str::random(6)),
                'specifications' => [
                    'Material' => 'Premium Cotton',
                    'Care' => 'Machine Washable',
                    'Origin' => 'Dubai, UAE'
                ],
                'features' => ['Premium Quality', 'Comfortable', 'Stylish'],
                'tags' => [$gender, 'fashion', 'premium', 'dubai'],
                'average_rating' => rand(35, 50) / 10,
                'total_reviews' => rand(10, 200),
                'is_active' => true,
                'is_featured' => rand(0, 1),
                'published_at' => now(),
            ]);

            // Create product image
            ProductImage::create([
                'product_id' => $product->id,
                'image_url' => 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=800',
                'alt_text' => $product->name,
                'is_primary' => true,
                'sort_order' => 1
            ]);
        }
    }

    private function createFoodBeverages()
    {
        $foodBeverages = Category::where('slug', 'food-beverages')->first();
        $beverages = Subcategory::where('slug', 'beverages')->first();
        $snacks = Subcategory::where('slug', 'snacks-confectionery')->first();

        // Food brands
        $foodBrands = [
            [
                'name' => 'Dubai Gourmet Foods',
                'slug' => 'dubai-gourmet-foods',
                'description' => 'Premium gourmet foods from Dubai',
                'is_active' => true
            ],
            [
                'name' => 'Emirates Beverages',
                'slug' => 'emirates-beverages',
                'description' => 'Quality beverages from the Emirates',
                'is_active' => true
            ],
        ];

        foreach ($foodBrands as $brandData) {
            $brand = Brand::create($brandData);

            // Create beverage products
            if ($beverages) {
                $beveragesData = [
                    [
                        'name' => 'Premium Arabic Coffee',
                        'price' => 25.00,
                        'description' => 'Authentic Arabic coffee with traditional spices',
                        'specifications' => [
                            'Type' => 'Ground Coffee',
                            'Weight' => '500g',
                            'Origin' => 'UAE'
                        ],
                        'tags' => ['coffee', 'arabic', 'traditional'],
                    ],
                    [
                        'name' => 'Date Syrup',
                        'price' => 18.00,
                        'description' => 'Natural date syrup, perfect for cooking and beverages',
                        'specifications' => [
                            'Type' => 'Natural Syrup',
                            'Volume' => '750ml',
                            'Origin' => 'UAE'
                        ],
                        'tags' => ['syrup', 'dates', 'natural'],
                    ],
                    [
                        'name' => 'Rose Water',
                        'price' => 15.00,
                        'description' => 'Premium rose water for cooking and beauty',
                        'specifications' => [
                            'Type' => 'Rose Water',
                            'Volume' => '500ml',
                            'Origin' => 'UAE'
                        ],
                        'tags' => ['rose', 'water', 'beauty', 'cooking'],
                    ],
                ];

                foreach ($beveragesData as $productData) {
                    $product = Product::create([
                        'name' => $productData['name'] . ' - ' . $brand->name,
                        'slug' => Str::slug($productData['name'] . ' ' . $brand->name),
                        'description' => $productData['description'],
                        'short_description' => $productData['description'],
                        'category_id' => $foodBeverages->id,
                        'subcategory_id' => $beverages->id,
                        'brand_id' => $brand->id,
                        'price' => $productData['price'],
                        'stock_quantity' => rand(30, 150),
                        'in_stock' => true,
                        'sku' => 'BEV-' . strtoupper(Str::random(6)),
                        'specifications' => $productData['specifications'],
                        'features' => ['Premium Quality', 'Authentic', 'Natural'],
                        'tags' => $productData['tags'],
                        'average_rating' => rand(35, 50) / 10,
                        'total_reviews' => rand(15, 300),
                        'is_active' => true,
                        'is_featured' => rand(0, 1),
                        'published_at' => now(),
                    ]);

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url' => 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800',
                        'alt_text' => $product->name,
                        'is_primary' => true,
                        'sort_order' => 1
                    ]);
                }
            }

            // Create snack products
            if ($snacks) {
                $snacksData = [
                    [
                        'name' => 'Mixed Nuts Pack',
                        'price' => 32.00,
                        'description' => 'Premium mixed nuts from the Middle East',
                        'specifications' => [
                            'Type' => 'Mixed Nuts',
                            'Weight' => '1kg',
                            'Origin' => 'UAE'
                        ],
                        'tags' => ['nuts', 'snacks', 'healthy'],
                    ],
                    [
                        'name' => 'Premium Dates',
                        'price' => 28.00,
                        'description' => 'Fresh premium dates from Dubai farms',
                        'specifications' => [
                            'Type' => 'Medjool Dates',
                            'Weight' => '1kg',
                            'Origin' => 'UAE'
                        ],
                        'tags' => ['dates', 'fresh', 'premium'],
                    ],
                ];

                foreach ($snacksData as $productData) {
                    $product = Product::create([
                        'name' => $productData['name'] . ' - ' . $brand->name,
                        'slug' => Str::slug($productData['name'] . ' ' . $brand->name),
                        'description' => $productData['description'],
                        'short_description' => $productData['description'],
                        'category_id' => $foodBeverages->id,
                        'subcategory_id' => $snacks->id,
                        'brand_id' => $brand->id,
                        'price' => $productData['price'],
                        'stock_quantity' => rand(25, 100),
                        'in_stock' => true,
                        'sku' => 'SNACK-' . strtoupper(Str::random(6)),
                        'specifications' => $productData['specifications'],
                        'features' => ['Premium Quality', 'Fresh', 'Healthy'],
                        'tags' => $productData['tags'],
                        'average_rating' => rand(35, 50) / 10,
                        'total_reviews' => rand(20, 250),
                        'is_active' => true,
                        'is_featured' => rand(0, 1),
                        'published_at' => now(),
                    ]);

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url' => 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800',
                        'alt_text' => $product->name,
                        'is_primary' => true,
                        'sort_order' => 1
                    ]);
                }
            }
        }
    }

    private function createConstructionMaterials()
    {
        $construction = Category::where('slug', 'construction-materials')->first();
        $buildingMaterials = Subcategory::where('slug', 'building-materials')->first();
        $electrical = Subcategory::where('slug', 'electrical-supplies')->first();

        // Construction brands
        $constructionBrands = [
            [
                'name' => 'Dubai Build Materials',
                'slug' => 'dubai-build-materials',
                'description' => 'Quality construction materials from Dubai',
                'is_active' => true
            ],
            [
                'name' => 'Gulf Construction Supplies',
                'slug' => 'gulf-construction-supplies',
                'description' => 'Comprehensive construction supplies',
                'is_active' => true
            ],
        ];

        foreach ($constructionBrands as $brandData) {
            $brand = Brand::create($brandData);

            // Create building materials
            if ($buildingMaterials) {
                $materialsData = [
                    [
                        'name' => 'Cement Bags (50kg)',
                        'price' => 15.00,
                        'description' => 'High-quality Portland cement for construction',
                        'specifications' => [
                            'Type' => 'Portland Cement',
                            'Weight' => '50kg per bag',
                            'Grade' => 'OPC 53'
                        ],
                        'tags' => ['cement', 'construction', 'building'],
                    ],
                    [
                        'name' => 'Steel Rebars (12mm)',
                        'price' => 8.50,
                        'description' => 'Premium steel reinforcement bars',
                        'specifications' => [
                            'Type' => 'Steel Rebar',
                            'Diameter' => '12mm',
                            'Length' => '12 meters'
                        ],
                        'tags' => ['steel', 'rebar', 'reinforcement'],
                    ],
                    [
                        'name' => 'Construction Sand',
                        'price' => 45.00,
                        'description' => 'Clean construction sand for various applications',
                        'specifications' => [
                            'Type' => 'Construction Sand',
                            'Volume' => '1 cubic meter',
                            'Grade' => 'Fine'
                        ],
                        'tags' => ['sand', 'construction', 'building'],
                    ],
                ];

                foreach ($materialsData as $productData) {
                    $product = Product::create([
                        'name' => $productData['name'] . ' - ' . $brand->name,
                        'slug' => Str::slug($productData['name'] . ' ' . $brand->name),
                        'description' => $productData['description'],
                        'short_description' => $productData['description'],
                        'category_id' => $construction->id,
                        'subcategory_id' => $buildingMaterials->id,
                        'brand_id' => $brand->id,
                        'price' => $productData['price'],
                        'stock_quantity' => rand(50, 500),
                        'in_stock' => true,
                        'sku' => 'BUILD-' . strtoupper(Str::random(6)),
                        'specifications' => $productData['specifications'],
                        'features' => ['High Quality', 'Durable', 'Industry Standard'],
                        'tags' => $productData['tags'],
                        'average_rating' => rand(35, 50) / 10,
                        'total_reviews' => rand(10, 150),
                        'is_active' => true,
                        'is_featured' => rand(0, 1),
                        'published_at' => now(),
                    ]);

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url' => 'https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=800&h=800',
                        'alt_text' => $product->name,
                        'is_primary' => true,
                        'sort_order' => 1
                    ]);
                }
            }

            // Create electrical supplies
            if ($electrical) {
                $electricalData = [
                    [
                        'name' => 'Electrical Cable (2.5mm)',
                        'price' => 12.00,
                        'description' => 'High-quality electrical cable for residential wiring',
                        'specifications' => [
                            'Type' => 'Copper Cable',
                            'Gauge' => '2.5mm²',
                            'Length' => '100 meters'
                        ],
                        'tags' => ['cable', 'electrical', 'copper'],
                    ],
                    [
                        'name' => 'Circuit Breaker (20A)',
                        'price' => 25.00,
                        'description' => 'Safety circuit breaker for electrical protection',
                        'specifications' => [
                            'Type' => 'Miniature Circuit Breaker',
                            'Rating' => '20A',
                            'Poles' => 'Single Pole'
                        ],
                        'tags' => ['circuit-breaker', 'electrical', 'safety'],
                    ],
                ];

                foreach ($electricalData as $productData) {
                    $product = Product::create([
                        'name' => $productData['name'] . ' - ' . $brand->name,
                        'slug' => Str::slug($productData['name'] . ' ' . $brand->name),
                        'description' => $productData['description'],
                        'short_description' => $productData['description'],
                        'category_id' => $construction->id,
                        'subcategory_id' => $electrical->id,
                        'brand_id' => $brand->id,
                        'price' => $productData['price'],
                        'stock_quantity' => rand(20, 200),
                        'in_stock' => true,
                        'sku' => 'ELEC-' . strtoupper(Str::random(6)),
                        'specifications' => $productData['specifications'],
                        'features' => ['High Quality', 'Safety Certified', 'Durable'],
                        'tags' => $productData['tags'],
                        'average_rating' => rand(35, 50) / 10,
                        'total_reviews' => rand(8, 100),
                        'is_active' => true,
                        'is_featured' => rand(0, 1),
                        'published_at' => now(),
                    ]);

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url' => 'https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=800&h=800',
                        'alt_text' => $product->name,
                        'is_primary' => true,
                        'sort_order' => 1
                    ]);
                }
            }
        }
    }

    private function createAdditionalProducts()
    {
        // Get existing categories and brands
        $electronics = Category::where('slug', 'electronics')->first();
        $smartphones = Subcategory::where('slug', 'smartphones')->first();
        $samsung = Brand::where('slug', 'samsung')->first();

        if ($electronics && $smartphones && $samsung) {
            // Add more Samsung products
            $samsungProducts = [
                [
                    'name' => 'Samsung Galaxy Z Fold 5',
                    'price' => 1799.00,
                    'description' => 'Revolutionary foldable smartphone with S Pen support',
                    'specifications' => [
                        'Display' => '7.6-inch Foldable AMOLED',
                        'Storage' => '512GB',
                        'RAM' => '12GB',
                        'Camera' => '50MP Triple Camera'
                    ],
                    'tags' => ['foldable', 'premium', 's-pen'],
                ],
                [
                    'name' => 'Samsung Galaxy Watch 6',
                    'price' => 399.00,
                    'description' => 'Advanced smartwatch with health monitoring features',
                    'specifications' => [
                        'Display' => '1.5-inch AMOLED',
                        'Battery' => 'Up to 40 hours',
                        'Sensors' => 'ECG, Blood Oxygen, Sleep Tracking'
                    ],
                    'tags' => ['smartwatch', 'health', 'fitness'],
                ],
            ];

            foreach ($samsungProducts as $productData) {
                $product = Product::create([
                    'name' => $productData['name'],
                    'slug' => Str::slug($productData['name']),
                    'description' => $productData['description'],
                    'short_description' => $productData['description'],
                    'category_id' => $electronics->id,
                    'subcategory_id' => $smartphones->id,
                    'brand_id' => $samsung->id,
                    'price' => $productData['price'],
                    'stock_quantity' => rand(10, 50),
                    'in_stock' => true,
                    'sku' => 'SAM-' . strtoupper(Str::random(6)),
                    'specifications' => $productData['specifications'],
                    'features' => ['Premium Build', 'Latest Technology', 'Reliable'],
                    'tags' => $productData['tags'],
                    'average_rating' => rand(40, 50) / 10,
                    'total_reviews' => rand(50, 500),
                    'is_active' => true,
                    'is_featured' => true,
                    'published_at' => now(),
                ]);

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800',
                    'alt_text' => $product->name,
                    'is_primary' => true,
                    'sort_order' => 1
                ]);
            }
        }
    }
}
