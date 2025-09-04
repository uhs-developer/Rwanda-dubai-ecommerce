<?php

namespace App\Http\Controllers;

use App\Models\MediaFile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Validator;

class MediaController extends Controller
{
    /**
     * Get all media files with filtering and pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = MediaFile::with(['uploader:id,name,email', 'product:id,name']);

            // Apply filters
            if ($request->has('resource_type')) {
                $query->where('resource_type', $request->resource_type);
            }

            if ($request->has('format')) {
                $query->where('format', $request->format);
            }

            if ($request->has('uploaded_by')) {
                $query->where('uploaded_by', $request->uploaded_by);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('file_name', 'like', "%{$search}%")
                      ->orWhere('original_name', 'like', "%{$search}%");
                });
            }

            // Apply sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = min($request->get('per_page', 20), 50);
            $mediaFiles = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Media files retrieved successfully',
                'data' => $mediaFiles->items(),
                'pagination' => [
                    'current_page' => $mediaFiles->currentPage(),
                    'last_page' => $mediaFiles->lastPage(),
                    'per_page' => $mediaFiles->perPage(),
                    'total' => $mediaFiles->total(),
                    'from' => $mediaFiles->firstItem(),
                    'to' => $mediaFiles->lastItem(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve media files',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload a file to Cloudinary
     */
    public function upload(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|max:102400', // 100MB max
                'folder' => 'nullable|string|max:255',
                'public_id' => 'nullable|string|max:255',
                'product_id' => 'nullable|exists:products,id',
                'usage_type' => 'nullable|string|in:product_image,product_gallery,blog_cover,general',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $file = $request->file('file');
            $folder = $request->get('folder', 'media');
            $publicId = $request->get('public_id');
            $productId = $request->get('product_id');
            $usageType = $request->get('usage_type', 'general');

            // Upload to Cloudinary
            try {
                $uploadResult = Cloudinary::upload($file->getRealPath(), [
                    'folder' => $folder,
                    'public_id' => $publicId,
                    'resource_type' => 'auto', // Automatically detect image, video, or raw
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cloudinary upload failed: ' . $e->getMessage(),
                    'error' => 'Please check Cloudinary configuration'
                ], 500);
            }

            // Save to database
            $mediaFile = MediaFile::create([
                'public_id' => $uploadResult->getPublicId(),
                'file_name' => $uploadResult->getPublicId(),
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
                'url' => $uploadResult->getSecurePath(),
                'secure_url' => $uploadResult->getSecurePath(),
                'format' => $uploadResult->getExtension(),
                'width' => $uploadResult->getWidth(),
                'height' => $uploadResult->getHeight(),
                'resource_type' => $uploadResult->getResourceType(),
                'metadata' => $uploadResult->getArrayCopy(),
                'uploaded_by' => Auth::id(),
                'product_id' => $productId,
                'usage_type' => $usageType,
            ]);

            $mediaFile->load('uploader:id,name,email');

            return response()->json([
                'success' => true,
                'message' => 'File uploaded successfully',
                'data' => $mediaFile
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload file',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single media file
     */
    public function show($id): JsonResponse
    {
        try {
            $mediaFile = MediaFile::with(['uploader:id,name,email'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Media file retrieved successfully',
                'data' => $mediaFile
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Media file not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Delete a media file from Cloudinary and database
     */
    public function destroy($id): JsonResponse
    {
        try {
            $mediaFile = MediaFile::findOrFail($id);

            // Check if user can delete this file
            if ($mediaFile->uploaded_by !== Auth::id() && !Auth::user()->hasRole(['admin', 'super-admin'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to delete this file'
                ], 403);
            }

            // Delete from Cloudinary
            Cloudinary::destroy($mediaFile->public_id);

            // Delete from database
            $mediaFile->delete();

            return response()->json([
                'success' => true,
                'message' => 'Media file deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete media file',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get upload statistics
     */
    public function stats(): JsonResponse
    {
        try {
            $stats = [
                'total_files' => MediaFile::count(),
                'total_size' => MediaFile::sum('file_size'),
                'by_type' => MediaFile::selectRaw('resource_type, COUNT(*) as count')
                    ->groupBy('resource_type')
                    ->pluck('count', 'resource_type'),
                'by_format' => MediaFile::selectRaw('format, COUNT(*) as count')
                    ->groupBy('format')
                    ->orderByDesc('count')
                    ->limit(10)
                    ->pluck('count', 'format'),
                'recent_uploads' => MediaFile::with(['uploader:id,name'])
                    ->orderByDesc('created_at')
                    ->limit(5)
                    ->get(['id', 'original_name', 'resource_type', 'file_size', 'created_at', 'uploaded_by'])
            ];

            return response()->json([
                'success' => true,
                'message' => 'Media statistics retrieved successfully',
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve media statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}