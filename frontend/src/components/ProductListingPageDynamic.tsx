import { useState, useEffect } from "react";
import { useQuery } from "urql";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Skeleton } from "./ui/skeleton";
import { SlidersHorizontal, Grid3X3, List, Filter, AlertCircle } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { GET_STOREFRONT_PRODUCTS, GET_PRODUCT_FILTERS } from "../graphql/storefront";
import { toast } from "sonner";

interface ProductListingPageDynamicProps {
  category?: string;
  subcategory?: string;
  searchQuery?: string;
  onAddToCart?: (product: any) => void;
  onAddToWishlist?: (product: any) => void;
  onProductClick?: (product: any) => void;
  onBack?: () => void;
}

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'name';
type ViewMode = 'grid' | 'list';

export function ProductListingPageDynamic({
  category,
  subcategory: _subcategory, // Unused - subcategories now handled via filters
  searchQuery,
  onAddToCart,
  onAddToWishlist,
  onProductClick,
  onBack,
}: ProductListingPageDynamicProps) {
  // Filter state
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | undefined>(category);
  const [selectedSubcategorySlugs, setSelectedSubcategorySlugs] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [page, setPage] = useState(1);
  const [animationKey, setAnimationKey] = useState(0);

  // Reset animation when view mode changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [viewMode]);

  // Build filter variables
  const filterVariables = {
    q: searchQuery,
    categorySlug: selectedSubcategorySlugs.length > 0 
      ? selectedSubcategorySlugs[0] // Use first selected subcategory
      : (selectedCategorySlug || category),
    brandIds: selectedBrandIds.length > 0 ? selectedBrandIds : undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 10000 ? priceRange[1] : undefined,
    inStock: inStockOnly || undefined,
    sortBy,
    page,
    perPage: 12,
  };

  // Fetch products
  const [productsResult] = useQuery({
    query: GET_STOREFRONT_PRODUCTS,
    variables: filterVariables,
  });

  // Fetch dynamic filters (only pass search query, not filter selections)
  // This ensures all filter options remain visible regardless of current selection
  const [filtersResult] = useQuery({
    query: GET_PRODUCT_FILTERS,
    variables: {
      q: searchQuery,
      // Don't pass category or brand filters - we want all options to show
    },
  });

  const products = productsResult.data?.products?.data || [];
  const paginatorInfo = productsResult.data?.products?.paginatorInfo;
  const loading = productsResult.fetching;
  const error = productsResult.error;

  const filterData = filtersResult.data?.productFilters;
  const availableCategories = filterData?.categories || [];
  const availableBrands = filterData?.brands || [];
  const dynamicMinPrice = filterData?.minPrice || 0;
  const dynamicMaxPrice = filterData?.maxPrice || 10000;

  // Get all subcategories from available categories
  const allSubcategories = availableCategories.flatMap((cat: any) => 
    (cat.children || []).map((child: any) => ({ ...child, parentName: cat.name }))
  );

  // Initialize price range from dynamic data
  useEffect(() => {
    if (filterData && !selectedBrandIds.length && !selectedCategorySlug) {
      setPriceRange([dynamicMinPrice, dynamicMaxPrice]);
    }
  }, [dynamicMinPrice, dynamicMaxPrice, filterData, selectedBrandIds.length, selectedCategorySlug]);

  const handleBrandChange = (brandId: string, checked: boolean) => {
    setSelectedBrandIds(prev =>
      checked ? [...prev, brandId] : prev.filter(id => id !== brandId)
    );
    setPage(1);
  };

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    // If checking, set this category. If unchecking, clear the category
    setSelectedCategorySlug(checked ? categorySlug : undefined);
    setSelectedSubcategorySlugs([]); // Clear subcategories when category changes
    setPage(1);
  };

  const handleSubcategoryChange = (subcategorySlug: string, checked: boolean) => {
    setSelectedSubcategorySlugs(prev =>
      checked 
        ? [...prev, subcategorySlug]
        : prev.filter(slug => slug !== subcategorySlug)
    );
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSelectedBrandIds([]);
    setSelectedCategorySlug(category);
    setSelectedSubcategorySlugs([]);
    setPriceRange([dynamicMinPrice, dynamicMaxPrice]);
    setMinRating(0);
    setInStockOnly(false);
    setPage(1);
    toast.success('Filters cleared');
  };

  const getBrandName = (brandId: string) => {
    return availableBrands.find((b: any) => b.id === brandId)?.name || `Brand ${brandId}`;
  };

  const getCategoryName = () => {
    if (selectedCategorySlug) {
      return availableCategories.find((c: any) => c.slug === selectedCategorySlug)?.name;
    }
    if (category) {
      return category.charAt(0).toUpperCase() + category.slice(1);
    }
    return null;
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      {!category && availableCategories.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Categories</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {availableCategories.map((cat: any) => (
              <div key={cat.id}>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${cat.id}`}
                    checked={selectedCategorySlug === cat.slug}
                    onCheckedChange={(checked: boolean) => handleCategoryChange(cat.slug, checked)}
                  />
                  <label htmlFor={`category-${cat.id}`} className="text-sm cursor-pointer flex-1">
                    {cat.name}
                    {cat.productCount > 0 && (
                      <span className="text-muted-foreground ml-1">({cat.productCount})</span>
                    )}
                  </label>
                </div>
                {/* Children/Subcategories */}
                {cat.children && cat.children.length > 0 && (
                  <div className="ml-6 mt-1 space-y-1">
                    {cat.children.map((child: any) => (
                      <div key={child.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${child.id}`}
                          checked={selectedCategorySlug === child.slug}
                          onCheckedChange={(checked: boolean) => handleCategoryChange(child.slug, checked)}
                        />
                        <label htmlFor={`category-${child.id}`} className="text-sm cursor-pointer flex-1">
                          {child.name}
                          {child.productCount > 0 && (
                            <span className="text-muted-foreground ml-1">({child.productCount})</span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <Separator className="mt-4" />
        </div>
      )}

      {/* Subcategories - Separate Section */}
      {allSubcategories.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Subcategories</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {allSubcategories.map((subcat: any) => (
              <div key={subcat.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`subcategory-${subcat.id}`}
                  checked={selectedSubcategorySlugs.includes(subcat.slug)}
                  onCheckedChange={(checked: boolean) => handleSubcategoryChange(subcat.slug, checked)}
                />
                <label htmlFor={`subcategory-${subcat.id}`} className="text-sm cursor-pointer flex-1">
                  {subcat.name}
                  {subcat.productCount > 0 && (
                    <span className="text-muted-foreground ml-1">({subcat.productCount})</span>
                  )}
                  {subcat.parentName && (
                    <span className="text-xs text-muted-foreground ml-1">({subcat.parentName})</span>
                  )}
                </label>
              </div>
            ))}
          </div>
          <Separator className="mt-4" />
        </div>
      )}

      {/* Brands */}
      {availableBrands.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Brands</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableBrands.map((brand: any) => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand.id}`}
                  checked={selectedBrandIds.includes(brand.id)}
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

      {availableBrands.length > 0 && <Separator />}

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-3">
          <Slider
            value={priceRange}
            onValueChange={(value) => {
              setPriceRange(value as [number, number]);
              setPage(1);
            }}
            min={dynamicMinPrice}
            max={dynamicMaxPrice}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Available range: ${dynamicMinPrice} - ${dynamicMaxPrice}
          </p>
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
            onCheckedChange={(checked) => {
              setInStockOnly(checked === true);
              setPage(1);
            }}
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
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
      <p className="text-muted-foreground mb-4">{error?.message}</p>
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
                getCategoryName() || 'All Products'}
            </h1>
            <p className="text-muted-foreground">
              {loading ? 'Loading...' : `${paginatorInfo?.total || 0} products found`}
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
            <Select value={sortBy} onValueChange={(value: SortOption) => {
              setSortBy(value);
              setPage(1);
            }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
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
              <SheetContent side="left" className="w-80 overflow-y-auto">
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
        {(selectedBrandIds.length > 0 || selectedSubcategorySlugs.length > 0 || minRating > 0 || inStockOnly || selectedCategorySlug) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedBrandIds.map(brandId => (
              <Badge key={brandId} variant="secondary" className="cursor-pointer"
                onClick={() => handleBrandChange(brandId, false)}>
                {getBrandName(brandId)} ×
              </Badge>
            ))}
            {selectedSubcategorySlugs.map(subcatSlug => {
              const subcat = allSubcategories.find((s: any) => s.slug === subcatSlug);
              return (
                <Badge key={subcatSlug} variant="secondary" className="cursor-pointer"
                  onClick={() => handleSubcategoryChange(subcatSlug, false)}>
                  {subcat?.name || subcatSlug} ×
                </Badge>
              );
            })}
            {selectedCategorySlug && selectedCategorySlug !== category && (
              <Badge variant="secondary" className="cursor-pointer"
                onClick={() => {
                  setSelectedCategorySlug(category);
                  setPage(1);
                }}>
                {getCategoryName()} ×
              </Badge>
            )}
            {inStockOnly && (
              <Badge variant="secondary" className="cursor-pointer"
                onClick={() => {
                  setInStockOnly(false);
                  setPage(1);
                }}>
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
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No products found matching your criteria.</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid'
                ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-4"
              }>
                {products.map((product: any, index: number) => {
                  // Transform product to match expected format
                  const displayProduct: any = {
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    specialPrice: product.specialPrice,
                    originalPrice: product.specialPrice ? product.price : undefined,
                    image: product.images?.[0]?.url || '/placeholder-product.jpg',
                    rating: 4.5, // Default rating since it's not in the API
                    reviews: 0,
                    category: product.categories?.[0]?.name || 'Uncategorized',
                    brand: product.brand?.name || '',
                    inStock: true,
                    description: product.shortDescription || product.description || '',
                    images: product.images?.map((img: any) => img.url) || [],
                    subcategory: product.categories?.[1]?.name || '',
                    specifications: {},
                    tags: [],
                  };

                  return (
                    <div
                      key={`${product.id}-${animationKey}`}
                      className="animate-fade-in-up"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        opacity: 0
                      }}
                    >
                      <ProductCard
                        product={displayProduct}
                        onAddToCart={onAddToCart}
                        onAddToWishlist={onAddToWishlist}
                        onProductClick={() => onProductClick?.(displayProduct)}
                        className={viewMode === 'list' ? "flex flex-row" : ""}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {paginatorInfo && paginatorInfo.lastPage > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(5, paginatorInfo.lastPage) }, (_, i) => {
                      let pageNum = i + 1;
                      if (paginatorInfo.lastPage > 5) {
                        if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= paginatorInfo.lastPage - 2) {
                          pageNum = paginatorInfo.lastPage - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          onClick={() => handlePageChange(pageNum)}
                          className="w-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(Math.min(paginatorInfo.lastPage, page + 1))}
                      disabled={page === paginatorInfo.lastPage}
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
