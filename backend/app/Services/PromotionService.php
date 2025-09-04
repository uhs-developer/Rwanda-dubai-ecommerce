<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Promotion;
use Illuminate\Support\Facades\Log;

class PromotionService
{
    /**
     * Apply all active promotions to products
     */
    public function applyPromotionsToProducts()
    {
        $activePromotions = Promotion::where('status', 'active')
            ->where(function ($query) {
                $query->whereNull('starts_at')
                      ->orWhere('starts_at', '<=', now());
            })
            ->where(function ($query) {
                $query->whereNull('ends_at')
                      ->orWhere('ends_at', '>=', now());
            })
            ->get();

        Log::info('Applying promotions to products', ['count' => $activePromotions->count()]);

        foreach ($activePromotions as $promotion) {
            $this->applyPromotionToProducts($promotion);
        }

        return $activePromotions->count();
    }

    /**
     * Apply a specific promotion to products
     */
    public function applyPromotionToProducts(Promotion $promotion)
    {
        $query = Product::query();

        // Apply to specific products if specified
        if ($promotion->applicable_products && is_array($promotion->applicable_products)) {
            $query->whereIn('id', $promotion->applicable_products);
        }

        // Apply to specific categories if specified
        if ($promotion->applicable_categories && is_array($promotion->applicable_categories)) {
            $query->whereIn('category_id', $promotion->applicable_categories);
        }

        $products = $query->get();

        Log::info('Applying promotion to products', [
            'promotion_id' => $promotion->id,
            'promotion_name' => $promotion->name,
            'products_count' => $products->count()
        ]);

        foreach ($products as $product) {
            $this->calculateAndApplyPromotionalPrice($product, $promotion);
        }

        return $products->count();
    }

    /**
     * Calculate and apply promotional price to a product
     */
    private function calculateAndApplyPromotionalPrice(Product $product, Promotion $promotion)
    {
        $originalPrice = $product->price;
        $promotionalPrice = $originalPrice;

        // Calculate discount
        if ($promotion->discount_type === 'percentage') {
            $discount = $originalPrice * ($promotion->discount_value / 100);
            $promotionalPrice = $originalPrice - $discount;
        } elseif ($promotion->discount_type === 'fixed') {
            $promotionalPrice = max(0, $originalPrice - $promotion->discount_value);
        }

        // Round to 2 decimal places
        $promotionalPrice = round($promotionalPrice, 2);

        // Only apply if promotional price is lower than original price
        if ($promotionalPrice < $originalPrice) {
            $product->applyPromotionalPricing($promotionalPrice, $promotion->id);
            
            Log::info('Applied promotional pricing', [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'original_price' => $originalPrice,
                'promotional_price' => $promotionalPrice,
                'promotion_id' => $promotion->id
            ]);
        }
    }

    /**
     * Remove promotional pricing from products when promotion expires
     */
    public function removeExpiredPromotions()
    {
        $expiredPromotions = Promotion::where('status', 'expired')
            ->orWhere('ends_at', '<', now())
            ->get();

        foreach ($expiredPromotions as $promotion) {
            $this->removePromotionFromProducts($promotion);
        }

        return $expiredPromotions->count();
    }

    /**
     * Remove a specific promotion from products
     */
    public function removePromotionFromProducts(Promotion $promotion)
    {
        $products = Product::whereJsonContains('active_promotions', $promotion->id)->get();

        foreach ($products as $product) {
            $activePromotions = $product->active_promotions ?? [];
            $updatedPromotions = array_filter($activePromotions, function ($id) use ($promotion) {
                return $id != $promotion->id;
            });

            if (empty($updatedPromotions)) {
                // No more active promotions, clear promotional pricing
                $product->clearPromotionalPricing();
            } else {
                // Update active promotions list
                $product->update([
                    'active_promotions' => array_values($updatedPromotions),
                    'promotion_updated_at' => now(),
                ]);
            }
        }

        return $products->count();
    }

    /**
     * Get products with active promotions
     */
    public function getProductsWithPromotions()
    {
        return Product::whereNotNull('promotional_price')
            ->where('promotional_price', '<', \DB::raw('price'))
            ->with(['category', 'subcategory', 'brand'])
            ->get();
    }

    /**
     * Calculate total savings for a product
     */
    public function calculateTotalSavings(Product $product)
    {
        if (!$product->has_promotional_price) {
            return 0;
        }

        return $product->price - $product->promotional_price;
    }
}
