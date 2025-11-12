<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'name',
        'slug',
        'description',
        'short_description',
        'category_id',
        'subcategory_id',
        'brand_id',
        'price',
        'original_price',
        'cost_price',
        'stock_quantity',
        'min_stock_level',
        'manage_stock',
        'in_stock',
        'stock_status',
        'sku',
        'weight',
        'dimensions',
        'specifications',
        'features',
        'tags',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'average_rating',
        'total_reviews',
        'total_sales',
        'is_active',
        'is_featured',
        'is_digital',
        'published_at'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'weight' => 'decimal:2',
        'average_rating' => 'decimal:2',
        'dimensions' => 'array',
        'specifications' => 'array',
        'features' => 'array',
        'tags' => 'array',
        'meta_keywords' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'is_digital' => 'boolean',
        'manage_stock' => 'boolean',
        'in_stock' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
            if (empty($product->sku)) {
                $product->sku = 'PRD-' . strtoupper(Str::random(8));
            }
        });
    }

    // Relationships
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(Subcategory::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_product');
    }

    public function subcategories()
    {
        return $this->belongsToMany(Subcategory::class, 'subcategory_product');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    // Scopes
    public function scopeActive($query): Builder
    {
        return $query->where('is_active', true)
                    ->where('published_at', '<=', now());
    }

    public function scopeFeatured($query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeInStock($query): Builder
    {
        return $query->where('in_stock', true);
    }

    public function scopeByCategory($query, $categoryId): Builder
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeBySubcategory($query, $subcategoryId): Builder
    {
        return $query->where('subcategory_id', $subcategoryId);
    }

    public function scopeByBrand($query, $brandId): Builder
    {
        return $query->where('brand_id', $brandId);
    }

    public function scopePriceRange($query, $min, $max): Builder
    {
        return $query->whereBetween('price', [$min, $max]);
    }

    public function scopeMinRating($query, $rating): Builder
    {
        return $query->where('average_rating', '>=', $rating);
    }

    public function scopeSearch($query, $search): Builder
    {
        $searchTerm = "%{$search}%";
        $dbDriver = \DB::getDriverName();
        
        return $query->where(function ($q) use ($search, $searchTerm, $dbDriver) {
            // Case-insensitive search for text fields
            if ($dbDriver === 'mysql' || $dbDriver === 'mariadb') {
                // MySQL/MariaDB syntax
                $q->whereRaw('LOWER(name) LIKE ?', [strtolower($searchTerm)])
                  ->orWhereRaw('LOWER(description) LIKE ?', [strtolower($searchTerm)])
                  ->orWhereRaw('LOWER(short_description) LIKE ?', [strtolower($searchTerm)])
                  // Search in JSON tags array - convert JSON to text and search
                  ->orWhereRaw('LOWER(CAST(tags AS CHAR)) LIKE ?', [strtolower($searchTerm)])
                  ->orWhereHas('brand', function ($brandQuery) use ($searchTerm) {
                      $brandQuery->whereRaw('LOWER(name) LIKE ?', [strtolower($searchTerm)]);
                  });
            } else {
                // PostgreSQL syntax (for future compatibility)
                $q->where('name', 'ILIKE', $searchTerm)
                  ->orWhere('description', 'ILIKE', $searchTerm)
                  ->orWhere('short_description', 'ILIKE', $searchTerm)
                  ->orWhereRaw("tags::text ILIKE ?", [$searchTerm])
                  ->orWhereHas('brand', function ($brandQuery) use ($searchTerm) {
                      $brandQuery->where('name', 'ILIKE', $searchTerm);
                  });
            }
        });
    }

    // Accessors
    public function getOriginalPriceAttribute()
    {
        return $this->attributes['original_price'] ?? null;
    }

    public function getShortDescriptionAttribute()
    {
        return $this->attributes['short_description'] ?? null;
    }

    public function getStockQuantityAttribute()
    {
        return $this->attributes['stock_quantity'] ?? null;
    }

    public function getIsActiveAttribute()
    {
        return array_key_exists('is_active', $this->attributes) ? (bool) $this->attributes['is_active'] : null;
    }

    public function getIsFeaturedAttribute()
    {
        return array_key_exists('is_featured', $this->attributes) ? (bool) $this->attributes['is_featured'] : null;
    }

    public function getWeightAttribute()
    {
        return $this->attributes['weight'] ?? null;
    }

    public function getPrimaryImageAttribute()
    {
        // Use the already loaded images relationship to avoid N+1 queries
        if ($this->relationLoaded('images')) {
            $primaryImage = $this->images->where('is_primary', true)->first();
            return $primaryImage ? $primaryImage->image_url : null;
        }
        
        // Fallback to query if images not loaded
        $primaryImage = $this->images()->where('is_primary', true)->first();
        return $primaryImage ? $primaryImage->image_url : null;
    }

    public function getDiscountPercentageAttribute()
    {
        if ($this->original_price && $this->original_price > $this->price) {
            return round((($this->original_price - $this->price) / $this->original_price) * 100);
        }
        return 0;
    }

    public function getIsOnSaleAttribute()
    {
        return $this->original_price && $this->original_price > $this->price;
    }
}
