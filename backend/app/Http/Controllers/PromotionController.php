<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use App\Services\PromotionService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PromotionController extends Controller
{
    public function index(Request $request)
    {
        $query = Promotion::query();

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($search = $request->query('search')) {
            $query->where('name', 'ILIKE', "%{$search}%");
        }

        $promotions = $query->orderByDesc('created_at')->paginate(20);
        return response()->json(['success' => true, 'data' => $promotions]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'discount_type' => ['required', Rule::in(['percentage', 'fixed'])],
            'discount_value' => ['required', 'numeric', 'min:0'],
            'status' => ['required', Rule::in(['draft', 'active', 'scheduled'])],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'applicable_categories' => ['nullable', 'array'],
            'applicable_products' => ['nullable', 'array'],
            'stackable' => ['boolean'],
            'is_public' => ['boolean'],
        ]);

        $promotion = Promotion::create($validated);
        return response()->json(['success' => true, 'data' => $promotion], 201);
    }

    public function show(Promotion $promotion)
    {
        return response()->json(['success' => true, 'data' => $promotion]);
    }

    public function update(Request $request, Promotion $promotion)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'discount_type' => ['sometimes', Rule::in(['percentage', 'fixed'])],
            'discount_value' => ['sometimes', 'numeric', 'min:0'],
            'status' => ['sometimes', Rule::in(['draft', 'active', 'scheduled', 'expired'])],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'applicable_categories' => ['nullable', 'array'],
            'applicable_products' => ['nullable', 'array'],
            'stackable' => ['boolean'],
            'is_public' => ['boolean'],
        ]);

        $promotion->update($validated);
        return response()->json(['success' => true, 'data' => $promotion]);
    }

    public function destroy(Promotion $promotion)
    {
        // Remove promotion from products before deleting
        $promotionService = new PromotionService();
        $productsUpdated = $promotionService->removePromotionFromProducts($promotion);
        
        $promotion->delete();
        
        return response()->json([
            'success' => true, 
            'message' => "Promotion deleted and removed from {$productsUpdated} products"
        ]);
    }

    public function activate(Promotion $promotion)
    {
        $promotion->update(['status' => 'active']);
        
        // Apply promotion to products
        $promotionService = new PromotionService();
        $productsUpdated = $promotionService->applyPromotionToProducts($promotion);
        
        return response()->json([
            'success' => true, 
            'data' => $promotion,
            'message' => "Promotion activated and applied to {$productsUpdated} products"
        ]);
    }

    public function expire(Promotion $promotion)
    {
        $promotion->update(['status' => 'expired']);
        
        // Remove promotion from products
        $promotionService = new PromotionService();
        $productsUpdated = $promotionService->removePromotionFromProducts($promotion);
        
        return response()->json([
            'success' => true, 
            'data' => $promotion,
            'message' => "Promotion expired and removed from {$productsUpdated} products"
        ]);
    }

    public function applyToProducts()
    {
        try {
            $promotionService = new PromotionService();
            $promotionsApplied = $promotionService->applyPromotionsToProducts();
            
            return response()->json([
                'success' => true,
                'message' => "Applied {$promotionsApplied} promotions to products successfully"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to apply promotions: ' . $e->getMessage()
            ], 500);
        }
    }

    public function removeExpiredPromotions()
    {
        try {
            $promotionService = new PromotionService();
            $promotionsRemoved = $promotionService->removeExpiredPromotions();
            
            return response()->json([
                'success' => true,
                'message' => "Removed {$promotionsRemoved} expired promotions from products"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove expired promotions: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getAvailableProducts()
    {
        try {
            $products = \App\Models\Product::select('id', 'name', 'price', 'category_id')
                ->with(['category:id,name'])
                ->where('is_active', true)
                ->orderBy('name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch products: ' . $e->getMessage()
            ], 500);
        }
    }
}




