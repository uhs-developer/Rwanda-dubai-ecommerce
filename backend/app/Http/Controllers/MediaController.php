<?php

namespace App\Http\Controllers;

use App\Models\MediaFile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Cloudinary\Cloudinary as CloudinarySDK;
use GuzzleHttp\Client;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Handler\CurlHandler;
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

            // Upload to Cloudinary using direct cURL approach
            try {
                // Get Cloudinary credentials
                $cloudName = config('cloudinary.cloud_url') ? parse_url(config('cloudinary.cloud_url'), PHP_URL_HOST) : env('CLOUDINARY_CLOUD_NAME');
                $apiKey = config('cloudinary.cloud_url') ? parse_url(config('cloudinary.cloud_url'), PHP_URL_USER) : env('CLOUDINARY_API_KEY');
                $apiSecret = config('cloudinary.cloud_url') ? parse_url(config('cloudinary.cloud_url'), PHP_URL_PASS) : env('CLOUDINARY_API_SECRET');
                $uploadPreset = config('cloudinary.upload_preset');

                \Log::info('Cloudinary Credentials:', [
                    'cloud_name' => $cloudName,
                    'api_key' => $apiKey ? 'Set' : 'Not set',
                    'api_secret' => $apiSecret ? 'Set' : 'Not set',
                    'upload_preset' => $uploadPreset
                ]);

                // Prepare upload data
                $uploadData = [
                    'file' => new \CURLFile($file->getRealPath(), $file->getMimeType(), $file->getClientOriginalName()),
                    'folder' => $folder,
                    'public_id' => $publicId,
                    'resource_type' => 'auto',
                ];

                // Use signed uploads for now (more reliable)
                $uploadData['api_key'] = $apiKey;
                $uploadData['timestamp'] = time();
                $uploadData['signature'] = sha1($uploadData['timestamp'] . $apiSecret);
                
                \Log::info('Using signed upload with API key: ' . $apiKey);

                // Upload using cURL directly
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, "https://api.cloudinary.com/v1_1/{$cloudName}/auto/upload");
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $uploadData);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Disable SSL verification
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false); // Disable SSL verification
                curl_setopt($ch, CURLOPT_TIMEOUT, 60);
                curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);

                $response = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                $curlError = curl_error($ch);
                curl_close($ch);

                if ($curlError) {
                    throw new \Exception("cURL Error: " . $curlError);
                }

                if ($httpCode !== 200) {
                    throw new \Exception("HTTP Error: " . $httpCode . " - " . $response);
                }

                $uploadResult = json_decode($response, true);
                if (!$uploadResult || isset($uploadResult['error'])) {
                    throw new \Exception("Cloudinary API Error: " . ($uploadResult['error']['message'] ?? 'Unknown error'));
                }

                // Debug: Log the upload result
                \Log::info('Cloudinary Upload Result:', [
                    'type' => gettype($uploadResult),
                    'is_array' => is_array($uploadResult),
                    'result' => $uploadResult
                ]);

            } catch (\Exception $e) {
                \Log::error('Cloudinary Upload Exception:', [
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Cloudinary upload failed: ' . $e->getMessage(),
                    'error' => 'Please check Cloudinary configuration'
                ], 500);
            }

            // Save to database with proper array access
            try {
            $mediaFile = MediaFile::create([
                    'public_id' => $uploadResult['public_id'] ?? null,
                    'file_name' => $uploadResult['public_id'] ?? $file->getClientOriginalName(),
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
                    'url' => $uploadResult['secure_url'] ?? null,
                    'secure_url' => $uploadResult['secure_url'] ?? null,
                    'format' => $uploadResult['format'] ?? $file->getClientOriginalExtension(),
                    'width' => $uploadResult['width'] ?? null,
                    'height' => $uploadResult['height'] ?? null,
                    'resource_type' => $uploadResult['resource_type'] ?? 'auto',
                    'metadata' => $uploadResult,
                'uploaded_by' => Auth::id(),
                'product_id' => $productId,
                'usage_type' => $usageType,
            ]);
            } catch (\Exception $e) {
                \Log::error('Database Save Exception:', [
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to save file information to database: ' . $e->getMessage(),
                    'error' => 'Database error'
                ], 500);
            }

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