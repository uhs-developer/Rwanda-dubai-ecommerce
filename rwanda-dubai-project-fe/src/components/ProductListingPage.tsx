import { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { SlidersHorizontal, Grid3X3, List, Star, Filter } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { Product, products, filterOptions } from "../data/products";

interface ProductListingPageProps {
  category?: string;
  subcategory?: string;
  searchQuery?: string;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onProductClick?: (product: Product) => void;
  onBack?: () => void;
}

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest';
type ViewMode = 'grid' | 'list';

export function ProductListingPage({
  category,
  subcategory,
  searchQuery,
  onAddToCart,
  onAddToWishlist,
  onProductClick,
  onBack,
}: ProductListingPageProps) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [animationKey, setAnimationKey] = useState(0);

  // Reset animation when view mode changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [viewMode]);
  const itemsPerPage = 12;

  // Filter products based on criteria
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category/subcategory
    if (category && typeof category === 'string') {
      filtered = filtered.filter(p => p.category === category);
    }
    if (subcategory) {
      filtered = filtered.filter(p => p.subcategory === subcategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }

    // Filter by price range
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Filter by rating
    if (minRating > 0) {
      filtered = filtered.filter(p => p.rating >= minRating);
    }

    // Filter by stock
    if (inStockOnly) {
      filtered = filtered.filter(p => p.inStock);
    }

    return filtered;
  }, [category, subcategory, searchQuery, selectedBrands, priceRange, minRating, inStockOnly]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return sorted.sort((a, b) => parseInt(b.id) - parseInt(a.id));
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  // Paginate products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedProducts, currentPage]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const handleBrandChange = (brand: string, checked: boolean) => {
    setSelectedBrands(prev =>
      checked ? [...prev, brand] : prev.filter(b => b !== brand)
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, 2000]);
    setMinRating(0);
    setInStockOnly(false);
    setCurrentPage(1);
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Brands */}
      <div>
        <h3 className="font-semibold mb-3">Brands</h3>
        <div className="space-y-2">
          {filterOptions.brands.map(brand => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={brand}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked: boolean) => handleBrandChange(brand, checked as boolean)}
              />
              <label htmlFor={brand} className="text-sm cursor-pointer">
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-3">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={2000}
            step={50}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h3 className="font-semibold mb-3">Minimum Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map(rating => (
            <div key={rating} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`rating-${rating}`}
                name="rating"
                checked={minRating === rating}
                onChange={() => setMinRating(rating)}
                className="text-primary"
              />
              <label htmlFor={`rating-${rating}`} className="flex items-center text-sm cursor-pointer">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="ml-1">& up</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Availability */}
      <div>
        <h3 className="font-semibold mb-3">Availability</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={inStockOnly}
            onCheckedChange={(checked) => setInStockOnly(checked === true)}
          />
          <label htmlFor="in-stock" className="text-sm cursor-pointer">
            In stock only
          </label>
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full">
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mb-4">
            ← Back
          </Button>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {searchQuery ? `Search results for "${searchQuery}"` :
                subcategory ? subcategory :
                  category && typeof category === 'string' ? category.charAt(0).toUpperCase() + category.slice(1) :
                    'All Products'}
            </h1>
            <p className="text-muted-foreground">
              {sortedProducts.length} products found
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Most Relevant</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filter Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FiltersContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedBrands.length > 0 || minRating > 0 || inStockOnly) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedBrands.map(brand => (
              <Badge key={brand} variant="secondary" className="cursor-pointer"
                onClick={() => handleBrandChange(brand, false)}>
                {brand} ×
              </Badge>
            ))}
            {minRating > 0 && (
              <Badge variant="secondary" className="cursor-pointer"
                onClick={() => setMinRating(0)}>
                {minRating}+ stars ×
              </Badge>
            )}
            {inStockOnly && (
              <Badge variant="secondary" className="cursor-pointer"
                onClick={() => setInStockOnly(false)}>
                In stock only ×
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FiltersContent />
            </CardContent>
          </Card>
        </aside>

        {/* Products Grid/List */}
        <main className="flex-1">
          {paginatedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No products found matching your criteria.</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid'
                ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
              }>
                {paginatedProducts.map((product, index) => (
                  <div
                    key={`${product.id}-${animationKey}`}
                    className="animate-fade-in-up"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      opacity: 0
                    }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={onAddToCart}
                      onAddToWishlist={onAddToWishlist}
                      onProductClick={onProductClick}
                      className={viewMode === 'list' ? "flex flex-row" : ""}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}