import { useState, useEffect, useMemo } from "react";
import { useProducts } from "../contexts/ProductContext";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Skeleton } from "./ui/skeleton";
import { SlidersHorizontal, Grid3X3, List, Star, Filter, AlertCircle } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { ProductFilters, transformProductForDisplay } from "../services/product";
import { toast } from "sonner";

interface ProductListingPageAPIProps {
  category?: string;
  subcategory?: string;
  searchQuery?: string;
  onAddToCart?: (product: any) => void;
  onAddToWishlist?: (product: any) => void;
  onProductClick?: (product: any) => void;
  onBack?: () => void;
}

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'name';
type ViewMode = 'grid' | 'list';

export function ProductListingPageAPI({
  category,
  subcategory,
  searchQuery,
  onAddToCart,
  onAddToWishlist,
  onProductClick,
  onBack,
}: ProductListingPageAPIProps) {
  const {
    products,
    categories,
    brands,
    filterOptions,
    loading,
    slowLoading,
    error,
    currentPage,
    totalPages,
    totalProducts,
    fetchProducts,
    fetchCategories,
    fetchBrands,
    fetchFilterOptions,
    searchProducts,
    setCurrentPage,
  } = useProducts();

  // Local state for filters
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | undefined>();
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Initialize data on component mount
  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchFilterOptions();
  }, [fetchCategories, fetchBrands, fetchFilterOptions]);

  // Set initial category/subcategory from props
  useEffect(() => {
    if (category && categories.length > 0) {
      const categoryObj = categories.find(c => c.slug === category);
      if (categoryObj) {
        setSelectedCategoryId(categoryObj.id);
        
        if (subcategory && categoryObj.subcategories) {
          const subcategoryObj = categoryObj.subcategories.find(s => s.slug === subcategory);
          if (subcategoryObj) {
            setSelectedSubcategoryId(subcategoryObj.id);
          }
        }
      }
    }
  }, [category, subcategory, categories]);

  // Fetch products when filters change
  useEffect(() => {
    const filters: ProductFilters = {
      category_id: selectedCategoryId,
      subcategory_id: selectedSubcategoryId,
      brands: selectedBrands.length > 0 ? selectedBrands : undefined,
      min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
      max_price: priceRange[1] < 2000 ? priceRange[1] : undefined,
      min_rating: minRating > 0 ? minRating : undefined,
      in_stock: inStockOnly || undefined,
      sort_by: sortBy,
      page: currentPage,
      per_page: 12,
    };

    if (searchQuery) {
      searchProducts(searchQuery, filters);
    } else {
      fetchProducts(filters);
    }
  }, [
    selectedCategoryId,
    selectedSubcategoryId,
    selectedBrands,
    priceRange,
    minRating,
    inStockOnly,
    sortBy,
    currentPage,
    searchQuery,
    fetchProducts,
    searchProducts,
  ]);

  // Transform products for display
  const displayProducts = useMemo(() => {
    return products.map(transformProductForDisplay);
  }, [products]);

  const handleBrandChange = (brandId: number, checked: boolean) => {
    setSelectedBrands(prev =>
      checked ? [...prev, brandId] : prev.filter(id => id !== brandId)
    );
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategoryId(undefined);
    setSelectedSubcategoryId(undefined);
    setPriceRange([0, 2000]);
    setMinRating(0);
    setInStockOnly(false);
    setCurrentPage(1);
    toast.success('Filters cleared');
  };

  const getBrandName = (brandId: number) => {
    return brands.find(b => b.id === brandId)?.name || `Brand ${brandId}`;
  };

  const getCategoryName = () => {
    if (selectedCategoryId) {
      return categories.find(c => c.id === selectedCategoryId)?.name;
    }
    if (category) {
      return category.charAt(0).toUpperCase() + category.slice(1);
    }
    return null;
  };

  const getSubcategoryName = () => {
    if (selectedSubcategoryId && selectedCategoryId) {
      const categoryObj = categories.find(c => c.id === selectedCategoryId);
      return categoryObj?.subcategories?.find(s => s.id === selectedSubcategoryId)?.name;
    }
    if (subcategory) {
      return subcategory.charAt(0).toUpperCase() + subcategory.slice(1);
    }
    return null;
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      {!category && categories.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Categories</h3>
          <div className="space-y-2">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`category-${cat.id}`}
                  name="category"
                  checked={selectedCategoryId === cat.id}
                  onChange={() => {
                    setSelectedCategoryId(cat.id);
                    setSelectedSubcategoryId(undefined);
                    setCurrentPage(1);
                  }}
                />
                <label htmlFor={`category-${cat.id}`} className="text-sm cursor-pointer">
                  {cat.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subcategories */}
      {selectedCategoryId && (
        <div>
          <h3 className="font-semibold mb-3">Subcategories</h3>
          <div className="space-y-2">
            {categories
              .find(c => c.id === selectedCategoryId)
              ?.subcategories?.map(subcat => (
                <div key={subcat.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`subcategory-${subcat.id}`}
                    name="subcategory"
                    checked={selectedSubcategoryId === subcat.id}
                    onChange={() => {
                      setSelectedSubcategoryId(subcat.id);
                      setCurrentPage(1);
                    }}
                  />
                  <label htmlFor={`subcategory-${subcat.id}`} className="text-sm cursor-pointer">
                    {subcat.name}
                  </label>
                </div>
              ))}
          </div>
        </div>
      )}

      {categories.length > 0 && <Separator />}

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Brands</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map(brand => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand.id}`}
                  checked={selectedBrands.includes(brand.id)}
                  onCheckedChange={(checked: boolean) => handleBrandChange(brand.id, checked)}
                />
                <label htmlFor={`brand-${brand.id}`} className="text-sm cursor-pointer">
                  {brand.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {brands.length > 0 && <Separator />}

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

  const LoadingSkeleton = () => (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-4">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-6 w-1/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ErrorState = () => (
    <div className="text-center py-12">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <p className="text-lg font-medium mb-2">Failed to load products</p>
      <p className="text-muted-foreground mb-4">{error}</p>
      <Button onClick={() => window.location.reload()}>
        Try Again
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
                getSubcategoryName() || getCategoryName() || 'All Products'}
            </h1>
            <p className="text-muted-foreground">
              {loading ? 'Loading...' : `${totalProducts} products found`}
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
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
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
              <SheetContent side="left" className="w-80">
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
        {(selectedBrands.length > 0 || minRating > 0 || inStockOnly || selectedCategoryId || selectedSubcategoryId) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedBrands.map(brandId => (
              <Badge key={brandId} variant="secondary" className="cursor-pointer"
                onClick={() => handleBrandChange(brandId, false)}>
                {getBrandName(brandId)} ×
              </Badge>
            ))}
            {selectedCategoryId && (
              <Badge variant="secondary" className="cursor-pointer"
                onClick={() => {
                  setSelectedCategoryId(undefined);
                  setSelectedSubcategoryId(undefined);
                }}>
                {getCategoryName()} ×
              </Badge>
            )}
            {selectedSubcategoryId && (
              <Badge variant="secondary" className="cursor-pointer"
                onClick={() => setSelectedSubcategoryId(undefined)}>
                {getSubcategoryName()} ×
              </Badge>
            )}
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
        <aside className="hidden lg:block w-80 flex-shrink-0">
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
          {error ? (
            <ErrorState />
          ) : loading ? (
            <LoadingSkeleton />
          ) : displayProducts.length === 0 ? (
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
                {displayProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onAddToWishlist={onAddToWishlist}
                    onProductClick={onProductClick}
                    className={viewMode === 'list' ? "flex flex-row" : ""}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let page = i + 1;
                      if (totalPages > 5) {
                        if (currentPage <= 3) {
                          page = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + i;
                        } else {
                          page = currentPage - 2 + i;
                        }
                      }
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => handlePageChange(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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
