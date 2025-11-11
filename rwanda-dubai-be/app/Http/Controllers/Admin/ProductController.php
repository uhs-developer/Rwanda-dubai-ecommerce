<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\TaxClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $tenant = app('tenant');

        $query = Product::where('tenant_id', $tenant->id)
            ->with(['category', 'brand', 'images']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by brand
        if ($request->filled('brand_id')) {
            $query->where('brand_id', $request->brand_id);
        }

        // Filter by status (is_active)
        if ($request->filled('status')) {
            $isActive = $request->status === 'enabled' ? 1 : 0;
            $query->where('is_active', $isActive);
        }

        $products = $query->latest()->paginate(20);
        $categories = Category::where('tenant_id', $tenant->id)->get();
        $brands = Brand::where('tenant_id', $tenant->id)->get();

        return view('admin.products.index', compact('products', 'categories', 'brands'));
    }

    public function create()
    {
        $tenant = app('tenant');
        $categories = Category::where('tenant_id', $tenant->id)->get();
        $brands = Brand::where('tenant_id', $tenant->id)->get();

        return view('admin.products.create', compact('categories', 'brands'));
    }

    public function store(Request $request)
    {
        $tenant = app('tenant');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:255|unique:products,sku,NULL,id,tenant_id,' . $tenant->id,
            'description' => 'nullable|string',
            'short_description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'stock_quantity' => 'required|integer|min:0',
            'weight' => 'nullable|numeric|min:0',
            'is_active' => 'required|boolean',
            'is_featured' => 'nullable|boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $validated['tenant_id'] = $tenant->id;
        $validated['slug'] = Str::slug($validated['name']);

        // Set defaults if not provided
        if (!isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }
        if (!isset($validated['is_featured'])) {
            $validated['is_featured'] = false;
        }
        if (!isset($validated['stock_quantity'])) {
            $validated['stock_quantity'] = 0;
        }

        // Create product first
        $product = Product::create($validated);

        // Handle image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('products', 'public');
                $product->images()->create([
                    'image_url' => asset('storage/' . $path),
                    'image_path' => $path,
                    'is_primary' => $index === 0,
                    'sort_order' => $index,
                ]);
            }
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $tenant = app('tenant');

        // Ensure product belongs to tenant
        if ($product->tenant_id != $tenant->id) {
            abort(404);
        }

        // Load images relationship
        $product->load('images');

        $categories = Category::where('tenant_id', $tenant->id)->get();
        $brands = Brand::where('tenant_id', $tenant->id)->get();

        return view('admin.products.edit', compact('product', 'categories', 'brands'));
    }

    public function update(Request $request, Product $product)
    {
        $tenant = app('tenant');

        // Ensure product belongs to tenant
        if ($product->tenant_id != $tenant->id) {
            abort(404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:255|unique:products,sku,' . $product->id . ',id,tenant_id,' . $tenant->id,
            'description' => 'nullable|string',
            'short_description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'stock_quantity' => 'required|integer|min:0',
            'weight' => 'nullable|numeric|min:0',
            'is_active' => 'required|boolean',
            'is_featured' => 'nullable|boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        // Update product
        $product->update($validated);

        // Handle new image uploads
        if ($request->hasFile('images')) {
            $existingCount = $product->images()->count();

            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('products', 'public');
                $product->images()->create([
                    'image_url' => asset('storage/' . $path),
                    'image_path' => $path,
                    'is_primary' => ($existingCount === 0 && $index === 0),
                    'sort_order' => $existingCount + $index,
                ]);
            }
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $tenant = app('tenant');

        // Ensure product belongs to tenant
        if ($product->tenant_id != $tenant->id) {
            abort(404);
        }

        // Delete images from storage
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image_path);
            $image->delete();
        }

        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    public function deleteImage(Product $product, $imageId)
    {
        $tenant = app('tenant');

        // Ensure product belongs to tenant
        if ($product->tenant_id != $tenant->id) {
            abort(404);
        }

        $image = $product->images()->find($imageId);

        if ($image) {
            Storage::disk('public')->delete($image->image_path);
            $image->delete();

            // If we deleted the primary image, set the next image as primary
            if ($image->is_primary) {
                $nextImage = $product->images()->orderBy('sort_order')->first();
                if ($nextImage) {
                    $nextImage->update(['is_primary' => true]);
                }
            }
        }

        return back()->with('success', 'Image deleted successfully.');
    }
}
