<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Get products with filtering, sorting, and pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $detailed = $request->boolean('detailed', false);
            
            $withRelations = [
                'category:id,name,slug', 
                'subcategory:id,name,slug', 
                'brand:id,name,slug'
            ];
            
            if ($detailed) {
                $withRelations[] = 'images';
            } else {
                $withRelations[] = [
                    'images' => function ($query) {
                        $query->where('is_primary', true)->limit(1);
                    }
                ];
            }
            
            $query = Product::query()->with($withRelations);

            // Only apply active filter if not explicitly requesting inactive products
            if (!$request->has('include_inactive') || !$request->boolean('include_inactive')) {
                $query->active();
            }

            // Apply filters
            $this->applyFilters($query, $request);

            // Apply sorting
            $this->applySorting($query, $request);

            // Pagination
            $perPage = min($request->get('per_page', 12), 50); // Max 50 items per page
            $products = $query->paginate($perPage);

            // Transform products
            $transformedProducts = $products->through(function ($product) use ($detailed) {
                return $this->transformProduct($product, $detailed);
            });

            return response()->json([
                'success' => true,
                'message' => 'Products retrieved successfully',
                'data' => $transformedProducts->items(),
                'pagination' => [
                    'current_page' => $transformedProducts->currentPage(),
                    'last_page' => $transformedProducts->lastPage(),
                    'per_page' => $transformedProducts->perPage(),
                    'total' => $transformedProducts->total(),
                    'from' => $transformedProducts->firstItem(),
                    'to' => $transformedProducts->lastItem(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a single product by ID or slug
     */
    public function show(Request $request, $identifier): JsonResponse
    {
        try {
            $product = Product::query()
                ->where('id', $identifier)
                ->orWhere('slug', $identifier)
                ->with([
                    'category:id,name,slug', 
                    'subcategory:id,name,slug', 
                    'brand:id,name,slug', 
                    'images'
                ])
                ->first();

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found'
                ], 404);
            }

            // Get related products
            $relatedProducts = Product::active()
                ->where('category_id', $product->category_id)
                ->where('id', '!=', $product->id)
                ->with([
                    'category:id,name,slug', 
                    'subcategory:id,name,slug', 
                    'brand:id,name,slug', 
                    'images' => function ($query) {
                        $query->where('is_primary', true)->limit(1);
                    }
                ])
                ->limit(4)
                ->get()
                ->map(function ($product) {
                    return $this->transformProduct($product);
                });

            return response()->json([
                'success' => true,
                'message' => 'Product retrieved successfully',
                'data' => [
                    'product' => $this->transformProduct($product, true),
                    'related_products' => $relatedProducts
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search products
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $searchTerm = $request->get('q', $request->get('search', ''));
            
            if (empty($searchTerm)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Search term is required'
                ], 400);
            }

            $detailed = $request->boolean('detailed', false);
            
            $withRelations = [
                'category:id,name,slug', 
                'subcategory:id,name,slug', 
                'brand:id,name,slug'
            ];
            
            if ($detailed) {
                $withRelations[] = 'images';
            } else {
                $withRelations[] = [
                    'images' => function ($query) {
                        $query->where('is_primary', true)->limit(1);
                    }
                ];
            }
            
            $query = Product::query()->active()->search($searchTerm)->with($withRelations);

            // Apply additional filters
            $this->applyFilters($query, $request);

            // Apply sorting
            $this->applySorting($query, $request);

            // Pagination - limit per_page to prevent timeout
            $perPage = min($request->get('per_page', 12), 50); // Max 50 items per page
            $products = $query->paginate($perPage);

            // Transform products
            $transformedProducts = $products->through(function ($product) use ($detailed) {
                return $this->transformProduct($product, $detailed);
            });

            return response()->json([
                'success' => true,
                'message' => 'Search results retrieved successfully',
                'data' => $transformedProducts->items(),
                'pagination' => [
                    'current_page' => $transformedProducts->currentPage(),
                    'last_page' => $transformedProducts->lastPage(),
                    'per_page' => $transformedProducts->perPage(),
                    'total' => $transformedProducts->total(),
                    'from' => $transformedProducts->firstItem(),
                    'to' => $transformedProducts->lastItem(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to search products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get featured products
     */
    public function featured(): JsonResponse
    {
        try {
            $products = Product::active()
                ->featured()
                ->with([
                    'category:id,name,slug', 
                    'subcategory:id,name,slug', 
                    'brand:id,name,slug', 
                    'images' => function ($query) {
                        $query->where('is_primary', true)->limit(1);
                    }
                ])
                ->limit(12)
                ->get()
                ->map(function ($product) {
                    return $this->transformProduct($product);
                });

            return response()->json([
                'success' => true,
                'message' => 'Featured products retrieved successfully',
                'data' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve featured products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get filter options
     */
    public function filterOptions(): JsonResponse
    {
        try {
            $brands = Brand::active()
                ->select('id', 'name', 'slug')
                ->orderBy('name')
                ->get();

            $categories = Category::active()
                ->with(['subcategories' => function ($query) {
                    $query->select('id', 'name', 'slug', 'category_id')
                          ->where('is_active', true)
                          ->orderBy('name');
                }])
                ->select('id', 'name', 'slug')
                ->orderBy('name')
                ->get();

            // Get price range
            $priceRange = Product::active()
                ->selectRaw('MIN(price) as min_price, MAX(price) as max_price')
                ->first();

            return response()->json([
                'success' => true,
                'message' => 'Filter options retrieved successfully',
                'data' => [
                    'brands' => $brands,
                    'categories' => $categories,
                    'price_range' => [
                        'min' => $priceRange->min_price ?? 0,
                        'max' => $priceRange->max_price ?? 1000,
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve filter options',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new product
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'short_description' => 'nullable|string|max:500',
                'price' => 'required|numeric|min:0',
                'original_price' => 'nullable|numeric|min:0',
                'cost_price' => 'nullable|numeric|min:0',
                'category_id' => 'required|exists:categories,id',
                'subcategory_id' => 'nullable|exists:subcategories,id',
                'brand_id' => 'nullable|exists:brands,id',
                'sku' => 'nullable|string|max:100|unique:products,sku',
                'stock_quantity' => 'required|integer|min:0',
                'min_stock_level' => 'nullable|integer|min:0',
                'weight' => 'nullable|numeric|min:0',
                'dimensions' => 'nullable|string|max:100',
                'specifications' => 'nullable|array',
                'features' => 'nullable|array',
                'tags' => 'nullable|array',
                'meta_title' => 'nullable|string|max:255',
                'meta_description' => 'nullable|string|max:500',
                'is_active' => 'boolean',
                'is_featured' => 'boolean',
                'is_digital' => 'boolean',
                'images' => 'nullable|array',
                'images.*.url' => 'required_with:images|string|url',
                'images.*.alt_text' => 'nullable|string|max:255',
                'images.*.is_primary' => 'boolean',
            ]);

            $product = Product::create([
                'name' => $request->name,
                'slug' => Str::slug($request->name),
                'description' => $request->description,
                'short_description' => $request->short_description,
                'price' => $request->price,
                'original_price' => $request->original_price,
                'cost_price' => $request->cost_price,
                'category_id' => $request->category_id,
                'subcategory_id' => $request->subcategory_id,
                'brand_id' => $request->brand_id,
                'sku' => $request->sku,
                'stock_quantity' => $request->stock_quantity,
                'min_stock_level' => $request->min_stock_level ?? 5,
                'weight' => $request->weight,
                'dimensions' => $request->dimensions,
                'specifications' => $request->specifications,
                'features' => $request->features,
                'tags' => $request->tags,
                'meta_title' => $request->meta_title,
                'meta_description' => $request->meta_description,
                'is_active' => $request->is_active ?? false, // Default to false
                'is_featured' => $request->is_featured ?? false,
                'is_digital' => $request->is_digital ?? false,
            ]);

            // Handle images if provided
            if ($request->has('images') && is_array($request->images)) {
                foreach ($request->images as $index => $imageData) {
                    $product->images()->create([
                        'image_url' => $imageData['url'],
                        'alt_text' => $imageData['alt_text'] ?? $product->name,
                        'is_primary' => $imageData['is_primary'] ?? ($index === 0),
                        'sort_order' => $index + 1,
                    ]);
                }
            }

            $product->load(['category', 'subcategory', 'brand', 'images']);

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'data' => $this->transformProduct($product, true)
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update product status only
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $product = Product::findOrFail($id);

            $request->validate([
                'is_active' => 'required|boolean',
            ]);

            $product->update([
                'is_active' => $request->is_active,
            ]);

            // Load relationships for response
            $product->load(['category:id,name,slug', 'subcategory:id,name,slug', 'brand:id,name,slug', 'images']);

            return response()->json([
                'success' => true,
                'message' => 'Product status updated successfully',
                'data' => $this->transformProduct($product, true)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update product status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a product
     */
    public function update(Request $request, $id)
    {
        try {
            $product = Product::findOrFail($id);

            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'short_description' => 'nullable|string|max:500',
                'price' => 'required|numeric|min:0',
                'original_price' => 'nullable|numeric|min:0',
                'cost_price' => 'nullable|numeric|min:0',
                'category_id' => 'required|exists:categories,id',
                'subcategory_id' => 'nullable|exists:subcategories,id',
                'brand_id' => 'nullable|exists:brands,id',
                'sku' => 'nullable|string|max:100|unique:products,sku,' . $id,
                'stock_quantity' => 'required|integer|min:0',
                'min_stock_level' => 'nullable|integer|min:0',
                'weight' => 'nullable|numeric|min:0',
                'dimensions' => 'nullable|string|max:100',
                'meta_title' => 'nullable|string|max:255',
                'meta_description' => 'nullable|string|max:500',
                'is_active' => 'nullable|boolean',
                'is_featured' => 'nullable|boolean',
                'is_digital' => 'nullable|boolean',
            ]);

            $product->update([
                'name' => $request->name,
                'description' => $request->description,
                'short_description' => $request->short_description,
                'price' => $request->price,
                'original_price' => $request->original_price,
                'cost_price' => $request->cost_price,
                'category_id' => $request->category_id,
                'subcategory_id' => $request->subcategory_id,
                'brand_id' => $request->brand_id,
                'sku' => $request->sku,
                'stock_quantity' => $request->stock_quantity,
                'min_stock_level' => $request->min_stock_level,
                'weight' => $request->weight,
                'dimensions' => $request->dimensions,
                'meta_title' => $request->meta_title,
                'meta_description' => $request->meta_description,
                'is_active' => $request->is_active ?? $product->is_active,
                'is_featured' => $request->is_featured ?? $product->is_featured,
                'is_digital' => $request->is_digital ?? $product->is_digital,
            ]);

            // Load relationships for response
            $product->load(['category', 'subcategory', 'brand', 'images']);

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => $this->transformProduct($product, true)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Apply filters to query
     */
    private function applyFilters($query, Request $request): void
    {
        // Category filter
        if ($request->has('category_id')) {
            $query->byCategory($request->category_id);
        } elseif ($request->has('category')) {
            if (is_numeric($request->category)) {
                $query->byCategory($request->category);
            } else {
                $category = Category::where('slug', $request->category)->first();
                if ($category) {
                    $query->byCategory($category->id);
                }
            }
        }

        // Subcategory filter
        if ($request->has('subcategory_id')) {
            $query->bySubcategory($request->subcategory_id);
        } elseif ($request->has('subcategory')) {
            if (is_numeric($request->subcategory)) {
                $query->bySubcategory($request->subcategory);
            } else {
                $subcategory = Subcategory::where('slug', $request->subcategory)->first();
                if ($subcategory) {
                    $query->bySubcategory($subcategory->id);
                }
            }
        }

        // Brand filter
        if ($request->has('brands')) {
            $brands = is_array($request->brands) ? $request->brands : explode(',', $request->brands);
            // Check if brands are IDs or slugs
            if (is_numeric($brands[0])) {
                $query->whereIn('brand_id', $brands);
            } else {
                $brandIds = Brand::whereIn('slug', $brands)->pluck('id');
                if ($brandIds->isNotEmpty()) {
                    $query->whereIn('brand_id', $brandIds);
                }
            }
        }

        // Price range filter
        if ($request->has('min_price') && $request->min_price > 0) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price') && $request->max_price < 2000) {
            $query->where('price', '<=', $request->max_price);
        }

        // Rating filter
        if ($request->has('min_rating') && $request->min_rating > 0) {
            $query->minRating($request->min_rating);
        }

        // Stock filter
        if ($request->has('in_stock') && $request->in_stock) {
            $query->inStock();
        } elseif ($request->has('in_stock_only') && $request->in_stock_only) {
            $query->inStock();
        }

        // Featured filter
        if ($request->has('featured') && $request->featured) {
            $query->featured();
        }
    }

    /**
     * Apply sorting to query
     */
    private function applySorting($query, Request $request): void
    {
        $sortBy = $request->get('sort_by', 'relevance');

        switch ($sortBy) {
            case 'price-low':
                $query->orderBy('price', 'asc');
                break;
            case 'price-high':
                $query->orderBy('price', 'desc');
                break;
            case 'rating':
                $query->orderBy('average_rating', 'desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'name':
                $query->orderBy('name', 'asc');
                break;
            case 'popularity':
                $query->orderBy('total_sales', 'desc');
                break;
            default: // relevance
                $query->orderBy('is_featured', 'desc')
                      ->orderBy('total_sales', 'desc')
                      ->orderBy('average_rating', 'desc');
                break;
        }
    }

    /**
     * Transform product for API response
     */
    private function transformProduct($product, $detailed = false): array
    {
        $baseData = [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'price' => (float) $product->price,
            'promotional_price' => $product->promotional_price ? (float) $product->promotional_price : null,
            'effective_price' => (float) $product->effective_price,
            'original_price' => $product->original_price ? (float) $product->original_price : null,
            'discount_percentage' => $product->discount_percentage,
            'promotional_discount_percentage' => $product->promotional_discount_percentage,
            'is_on_sale' => $product->is_on_sale,
            'has_promotional_price' => $product->has_promotional_price,
            'primary_image' => $product->primary_image,
            'category' => $product->category ? [
                'id' => $product->category->id,
                'name' => $product->category->name,
                'slug' => $product->category->slug,
            ] : null,
            'subcategory' => $product->subcategory ? [
                'id' => $product->subcategory->id,
                'name' => $product->subcategory->name,
                'slug' => $product->subcategory->slug,
            ] : null,
            'brand' => $product->brand ? [
                'id' => $product->brand->id,
                'name' => $product->brand->name,
                'slug' => $product->brand->slug,
            ] : null,
            'average_rating' => (float) $product->average_rating,
            'total_reviews' => $product->total_reviews,
            'in_stock' => $product->in_stock,
            'stock_status' => $product->stock_status,
            'is_featured' => $product->is_featured,
            'is_active' => $product->is_active, // ← FIXED: Added this line
            'created_at' => $product->created_at,
            'updated_at' => $product->updated_at,
        ];

        if ($detailed) {
            $baseData = array_merge($baseData, [
                'description' => $product->description,
                'short_description' => $product->short_description,
                'specifications' => $product->specifications,
                'features' => $product->features,
                'tags' => $product->tags,
                'sku' => $product->sku,
                'weight' => $product->weight,
                'dimensions' => $product->dimensions,
                'stock_quantity' => $product->stock_quantity,
                'total_sales' => $product->total_sales,
                'images' => $product->images->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'image_url' => $image->image_url,
                        'alt_text' => $image->alt_text,
                        'is_primary' => $image->is_primary,
                        'sort_order' => $image->sort_order,
                    ];
                }),
                'meta' => [
                    'title' => $product->meta_title,
                    'description' => $product->meta_description,
                    'keywords' => $product->meta_keywords,
                ],
            ]);
        }

        return $baseData;
    }
}
