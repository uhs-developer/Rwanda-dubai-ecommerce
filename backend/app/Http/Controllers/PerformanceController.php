<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Post;
use App\Models\MediaFile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PerformanceController extends Controller
{
    /**
     * Get product performance metrics
     */
    public function getProductPerformance(): JsonResponse
    {
        try {
            $metrics = [
                'total_products' => Product::count(),
                'active_products' => Product::where('status', 'active')->count(),
                'draft_products' => Product::where('status', 'draft')->count(),
                'total_views' => Product::sum('total_views') ?? 0,
                'total_sales' => Product::sum('total_sales') ?? 0,
                'average_rating' => Product::avg('average_rating') ?? 0,
                'top_products' => Product::with(['category:id,name'])
                    ->orderByDesc('total_views')
                    ->limit(5)
                    ->get(['id', 'name', 'total_views', 'average_rating', 'category_id']),
                'recent_products' => Product::with(['category:id,name'])
                    ->orderByDesc('created_at')
                    ->limit(5)
                    ->get(['id', 'name', 'status', 'created_at', 'category_id']),
            ];

            return response()->json([
                'success' => true,
                'message' => 'Product performance metrics retrieved successfully',
                'data' => $metrics
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve product performance metrics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get content performance metrics
     */
    public function getContentPerformance(): JsonResponse
    {
        try {
            $metrics = [
                'total_posts' => Post::count(),
                'published_posts' => Post::where('status', 'published')->count(),
                'draft_posts' => Post::where('status', 'draft')->count(),
                'total_views' => Post::sum('views_count') ?? 0,
                'total_comments' => Post::sum('comments_count') ?? 0,
                'total_media_files' => MediaFile::count(),
                'media_by_type' => MediaFile::selectRaw('resource_type, COUNT(*) as count')
                    ->groupBy('resource_type')
                    ->pluck('count', 'resource_type'),
                'top_posts' => Post::with(['author:id,name'])
                    ->orderByDesc('views_count')
                    ->limit(5)
                    ->get(['id', 'title', 'views_count', 'comments_count', 'author_id']),
                'recent_posts' => Post::with(['author:id,name'])
                    ->orderByDesc('created_at')
                    ->limit(5)
                    ->get(['id', 'title', 'status', 'created_at', 'author_id']),
            ];

            return response()->json([
                'success' => true,
                'message' => 'Content performance metrics retrieved successfully',
                'data' => $metrics
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve content performance metrics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get overall dashboard metrics
     */
    public function getDashboardMetrics(): JsonResponse
    {
        try {
            $metrics = [
                'products' => [
                    'total' => Product::count(),
                    'active' => Product::where('status', 'active')->count(),
                    'draft' => Product::where('status', 'draft')->count(),
                ],
                'posts' => [
                    'total' => Post::count(),
                    'published' => Post::where('status', 'published')->count(),
                    'draft' => Post::where('status', 'draft')->count(),
                ],
                'media' => [
                    'total' => MediaFile::count(),
                    'images' => MediaFile::where('resource_type', 'image')->count(),
                    'videos' => MediaFile::where('resource_type', 'video')->count(),
                ],
                'recent_activity' => [
                    'recent_products' => Product::orderByDesc('created_at')->limit(3)->get(['id', 'name', 'created_at']),
                    'recent_posts' => Post::orderByDesc('created_at')->limit(3)->get(['id', 'title', 'created_at']),
                    'recent_media' => MediaFile::orderByDesc('created_at')->limit(3)->get(['id', 'original_name', 'created_at']),
                ]
            ];

            return response()->json([
                'success' => true,
                'message' => 'Dashboard metrics retrieved successfully',
                'data' => $metrics
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve dashboard metrics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}