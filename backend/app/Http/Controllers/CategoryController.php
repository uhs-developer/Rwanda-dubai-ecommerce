<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Get all categories with subcategories
     */
    public function index(): JsonResponse
    {
        try {
            $categories = Category::active()
                ->ordered()
                ->with(['subcategories' => function ($query) {
                    $query->active()->ordered();
                }])
                ->get()
                ->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'name' => $category->name,
                        'slug' => $category->slug,
                        'description' => $category->description,
                        'image' => $category->image,
                        'product_count' => $category->product_count,
                        'subcategories' => $category->subcategories->map(function ($subcategory) {
                            return [
                                'id' => $subcategory->id,
                                'name' => $subcategory->name,
                                'slug' => $subcategory->slug,
                                'description' => $subcategory->description,
                                'image' => $subcategory->image,
                                'product_count' => $subcategory->product_count,
                            ];
                        })
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'Categories retrieved successfully',
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single category with subcategories
     */
    public function show($slug): JsonResponse
    {
        try {
            $category = Category::where('slug', $slug)
                ->active()
                ->with(['subcategories' => function ($query) {
                    $query->active()->ordered();
                }])
                ->first();

            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Category not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Category retrieved successfully',
                'data' => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'description' => $category->description,
                    'image' => $category->image,
                    'product_count' => $category->product_count,
                    'subcategories' => $category->subcategories->map(function ($subcategory) {
                        return [
                            'id' => $subcategory->id,
                            'name' => $subcategory->name,
                            'slug' => $subcategory->slug,
                            'description' => $subcategory->description,
                            'image' => $subcategory->image,
                            'product_count' => $subcategory->product_count,
                        ];
                    })
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve category',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
