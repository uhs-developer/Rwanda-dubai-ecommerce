<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class PostController extends Controller
{
    /**
     * Get all posts with filtering and pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Post::with(['author:id,name,email']);

            // Apply filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('author_id')) {
                $query->where('author_id', $request->author_id);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('excerpt', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%");
                });
            }

            // Apply sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = min($request->get('per_page', 15), 50);
            $posts = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Posts retrieved successfully',
                'data' => $posts->items(),
                'pagination' => [
                    'current_page' => $posts->currentPage(),
                    'last_page' => $posts->lastPage(),
                    'per_page' => $posts->perPage(),
                    'total' => $posts->total(),
                    'from' => $posts->firstItem(),
                    'to' => $posts->lastItem(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve posts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single post by slug
     */
    public function show($slug): JsonResponse
    {
        try {
            $post = Post::where('slug', $slug)
                ->with(['author:id,name,email'])
                ->first();

            if (!$post) {
                return response()->json([
                    'success' => false,
                    'message' => 'Post not found'
                ], 404);
            }

            // Increment views if published
            if ($post->status === 'published') {
                $post->incrementViews();
            }

            return response()->json([
                'success' => true,
                'message' => 'Post retrieved successfully',
                'data' => $post
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve post',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new post
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'excerpt' => 'nullable|string|max:500',
                'content' => 'required|string',
                'cover_image' => 'nullable|string|url',
                'status' => 'in:draft,published,archived',
                'meta_data' => 'nullable|array'
            ]);

            $post = Post::create([
                'title' => $request->title,
                'slug' => Str::slug($request->title),
                'excerpt' => $request->excerpt,
                'content' => $request->content,
                'cover_image' => $request->cover_image,
                'status' => $request->status ?? 'draft',
                'published_at' => $request->status === 'published' ? now() : null,
                'author_id' => Auth::id(),
                'meta_data' => $request->meta_data
            ]);

            $post->load('author:id,name,email');

            return response()->json([
                'success' => true,
                'message' => 'Post created successfully',
                'data' => $post
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create post',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a post
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $post = Post::findOrFail($id);

            // Check if user can edit this post
            if ($post->author_id !== Auth::id() && !Auth::user()->hasRole(['admin', 'super-admin'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to edit this post'
                ], 403);
            }

            $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'excerpt' => 'nullable|string|max:500',
                'content' => 'sometimes|required|string',
                'cover_image' => 'nullable|string|url',
                'status' => 'in:draft,published,archived',
                'meta_data' => 'nullable|array'
            ]);

            $updateData = $request->only(['title', 'excerpt', 'content', 'cover_image', 'status', 'meta_data']);

            // Update slug if title changed
            if ($request->has('title') && $request->title !== $post->title) {
                $updateData['slug'] = Str::slug($request->title);
            }

            // Set published_at if status changed to published
            if ($request->has('status') && $request->status === 'published' && $post->status !== 'published') {
                $updateData['published_at'] = now();
            }

            $post->update($updateData);
            $post->load('author:id,name,email');

            return response()->json([
                'success' => true,
                'message' => 'Post updated successfully',
                'data' => $post
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update post',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a post
     */
    public function destroy($id): JsonResponse
    {
        try {
            $post = Post::findOrFail($id);

            // Check if user can delete this post
            if ($post->author_id !== Auth::id() && !Auth::user()->hasRole(['admin', 'super-admin'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to delete this post'
                ], 403);
            }

            $post->delete();

            return response()->json([
                'success' => true,
                'message' => 'Post deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete post',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
