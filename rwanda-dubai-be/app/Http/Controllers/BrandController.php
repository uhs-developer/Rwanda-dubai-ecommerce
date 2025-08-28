<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BrandController extends Controller
{
    /**
     * Get all brands
     */
    public function index(): JsonResponse
    {
        try {
            $brands = Brand::active()
                ->orderBy('name')
                ->get()
                ->map(function ($brand) {
                    return [
                        'id' => $brand->id,
                        'name' => $brand->name,
                        'slug' => $brand->slug,
                        'description' => $brand->description,
                        'logo' => $brand->logo,
                        'website' => $brand->website,
                        'product_count' => $brand->product_count,
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'Brands retrieved successfully',
                'data' => $brands
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve brands',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single brand
     */
    public function show($slug): JsonResponse
    {
        try {
            $brand = Brand::where('slug', $slug)->active()->first();

            if (!$brand) {
                return response()->json([
                    'success' => false,
                    'message' => 'Brand not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Brand retrieved successfully',
                'data' => [
                    'id' => $brand->id,
                    'name' => $brand->name,
                    'slug' => $brand->slug,
                    'description' => $brand->description,
                    'logo' => $brand->logo,
                    'website' => $brand->website,
                    'product_count' => $brand->product_count,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve brand',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
