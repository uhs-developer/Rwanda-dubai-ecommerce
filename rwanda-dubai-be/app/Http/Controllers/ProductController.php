<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    /**
     * Get products with filtering, sorting, and pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Product::query()->active()->with([
                'category:id,name,slug', 
                'subcategory:id,name,slug', 
                'brand:id,name,slug', 
                'images' => function ($query) {
                    $query->where('is_primary', true)->limit(1);
                }
            ]);

            // Apply filters
            $this->applyFilters($query, $request);

            // Apply sorting
            $this->applySorting($query, $request);

            // Pagination
            $perPage = min($request->get('per_page', 12), 50); // Max 50 items per page
            $products = $query->paginate($perPage);

            // Transform products
            $transformedProducts = $products->through(function ($product) {
                return $this->transformProduct($product);
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
     * Get single product by slug
     */
    public function show($slug): JsonResponse
    {
        try {
            $product = Product::where('slug', $slug)
                ->active()
                ->with([
                    'category:id,name,slug', 
                    'subcategory:id,name,slug', 
                    'brand:id,name,slug', 
                    'images' => function ($query) {
                        $query->orderBy('is_primary', 'desc')->orderBy('sort_order', 'asc');
                    }
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
                ->where('id', '!=', $product->id)
                ->where(function ($query) use ($product) {
                    $query->where('category_id', $product->category_id)
                          ->orWhere('subcategory_id', $product->subcategory_id)
                          ->orWhere('brand_id', $product->brand_id);
                })
                ->with([
                    'category:id,name,slug', 
                    'subcategory:id,name,slug', 
                    'brand:id,name,slug', 
                    'images' => function ($query) {
                        $query->where('is_primary', true)->limit(1);
                    }
                ])
                ->limit(6)
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

            $query = Product::query()->active()->search($searchTerm)->with([
                'category:id,name,slug', 
                'subcategory:id,name,slug', 
                'brand:id,name,slug', 
                'images' => function ($query) {
                    $query->where('is_primary', true)->limit(1);
                }
            ]);

            // Apply additional filters
            $this->applyFilters($query, $request);

            // Apply sorting
            $this->applySorting($query, $request);

            // Pagination - limit per_page to prevent timeout
            $perPage = min($request->get('per_page', 12), 50); // Max 50 items per page
            $products = $query->paginate($perPage);

            // Transform products
            $transformedProducts = $products->through(function ($product) {
                return $this->transformProduct($product);
            });

            return response()->json([
                'success' => true,
                'message' => 'Search results retrieved successfully',
                'data' => $transformedProducts->items(),
                'search_term' => $searchTerm,
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
                'message' => 'Search failed',
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
                ->whereHas('products', function ($query) {
                    $query->active();
                })
                ->orderBy('name')
                ->get(['id', 'name', 'slug']);

            $categories = Category::active()
                ->whereHas('products', function ($query) {
                    $query->active();
                })
                ->orderBy('name')
                ->get(['id', 'name', 'slug']);

            $subcategories = Subcategory::active()
                ->whereHas('products', function ($query) {
                    $query->active();
                })
                ->with('category:id,name')
                ->orderBy('name')
                ->get(['id', 'name', 'slug', 'category_id']);

            $priceRange = Product::active()->selectRaw('MIN(price) as min_price, MAX(price) as max_price')->first();

            return response()->json([
                'success' => true,
                'message' => 'Filter options retrieved successfully',
                'data' => [
                    'brands' => $brands,
                    'categories' => $categories,
                    'subcategories' => $subcategories,
                    'price_range' => [
                        'min' => (float) $priceRange->min_price,
                        'max' => (float) $priceRange->max_price
                    ],
                    'rating_options' => [5, 4, 3, 2, 1],
                    'availability_options' => ['in_stock', 'out_of_stock', 'on_backorder']
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
            'sku' => $product->sku,
            'slug' => $product->slug,
            'price' => (float) $product->price,
            'original_price' => $product->original_price ? (float) $product->original_price : null,
            'discount_percentage' => $product->discount_percentage,
            'is_on_sale' => $product->is_on_sale,
            'primary_image' => $product->primary_image,
            'stock_quantity' => $product->stock_quantity,
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
                        'url' => $image->image_url,
                        'alt' => $image->alt_text,
                        'is_primary' => $image->is_primary,
                    ];
                }),
                'meta' => [
                    'title' => $product->meta_title,
                    'description' => $product->meta_description,
                    'keywords' => $product->meta_keywords,
                ]
            ]);
        } else {
            $baseData['short_description'] = $product->short_description;
        }

        return $baseData;
    }

    /**
     * Delete a product (admin)
     */
    public function destroy($id): JsonResponse
    {
        try {
            $product = Product::findOrFail($id);
            $product->delete();
            return response()->json([
                'success' => true,
                'message' => 'Product deleted',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete product',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
