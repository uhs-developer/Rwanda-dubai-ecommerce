<?php

namespace App\GraphQL\Queries;

use App\Models\Category;

class Categories
{
    /**
     * Get all categories (tree structure) with recursive product counts
     */
    public function __invoke($_, array $args)
    {
        // TODO: Add proper multi-tenancy when ready
        // For now, use default tenant_id = 1 or null for single-tenant setup
        $categories = Category::whereNull('parent_id')
            ->with('children')
            ->orderBy('sort_order')
            ->get();
        
        // Add recursive product counts to each category
        foreach ($categories as $category) {
            $this->addProductCount($category);
        }
        
        return $categories;
    }
    
    /**
     * Recursively calculate and set product count for a category and its children
     */
    private function addProductCount($category)
    {
        // If children are already loaded, calculate their counts first
        if ($category->relationLoaded('children')) {
            foreach ($category->children as $child) {
                $this->addProductCount($child);
            }
        }
        
        // The productCount accessor will now work correctly with loaded children
        // Force the accessor to be called and cached
        $category->setAttribute('productCount', $category->productCount);
    }
}

