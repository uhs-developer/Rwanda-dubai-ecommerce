import { useQuery } from 'urql';
import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ChevronLeft, ChevronRight, Heart, ShoppingCart } from "lucide-react";
import { GET_CATEGORY_PRODUCTS } from "../graphql/storefront";

interface CategoryFeaturedSliderDynamicProps {
  categorySlug: string;
  title?: string;
  subtitle?: string;
  onAddToCart?: (product: any) => void;
  onAddToWishlist?: (product: any) => void;
  onProductClick?: (product: any) => void;
  onViewAll?: () => void;
  autoPlay?: boolean;
  showOneOnMobile?: boolean;
}

export function CategoryFeaturedSliderDynamic({
  categorySlug,
  title = "Featured Products",
  subtitle,
  onAddToCart,
  onAddToWishlist,
  onProductClick,
  onViewAll,
  autoPlay = false,
  showOneOnMobile = false,
}: CategoryFeaturedSliderDynamicProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch products for this category
  const [productsResult] = useQuery({
    query: GET_CATEGORY_PRODUCTS,
    variables: {
      categorySlug,
      page: 1,
      perPage: 12,
    },
  });

  const products = productsResult.data?.products?.data || [];

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || products.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [autoPlay, products.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  if (productsResult.fetching) {
    return (
      <section className="py-8 sm:py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            {subtitle && <p className="text-muted-foreground mb-8">{subtitle}</p>}
            <p>Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Don't show section if no products
  }

  // Calculate visible items based on screen size
  const getVisibleCount = () => {
    if (showOneOnMobile) {
      return 1; // Show 1 on mobile, handled by responsive classes
    }
    return 4; // Default to showing 4 items
  };

  const visibleCount = getVisibleCount();
  const maxIndex = Math.max(0, products.length - visibleCount);

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
          {onViewAll && (
            <Button onClick={onViewAll} variant="outline">
              View All
            </Button>
          )}
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-4 hidden sm:flex"
            onClick={handlePrevious}
            disabled={products.length <= visibleCount}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-4 hidden sm:flex"
            onClick={handleNext}
            disabled={products.length <= visibleCount}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Products Carousel */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out gap-4"
              style={{
                transform: showOneOnMobile
                  ? `translateX(-${currentIndex * 100}%)`
                  : `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              }}
            >
              {products.map((product: any) => (
                <div
                  key={product.id}
                  className={showOneOnMobile ? "w-1/2 flex-shrink-0" : "w-1/2 sm:w-1/2 lg:w-1/4 flex-shrink-0"}
                >
                  <Card className="group cursor-pointer hover:shadow-xl transition-all h-full">
                    <div
                      className="relative overflow-hidden"
                      onClick={() => onProductClick?.(product)}
                    >
                      <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <span className="text-4xl text-gray-400">📦</span>
                          </div>
                        )}
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToWishlist?.(product);
                        }}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Heart className="h-4 w-4" />
                      </button>

                      {/* Special Price Badge */}
                      {product.specialPrice && product.specialPrice < product.price && (
                        <Badge className="absolute top-2 left-2 bg-red-500">
                          Sale
                        </Badge>
                      )}
                    </div>

                    <div className="p-4">
                      <h3
                        className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer"
                        onClick={() => onProductClick?.(product)}
                      >
                        {product.name}
                      </h3>

                      {product.brand && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {product.brand.name}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-primary">
                          ${product.specialPrice || product.price}
                        </span>
                        {product.specialPrice && product.specialPrice < product.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.price}
                          </span>
                        )}
                      </div>

                      <Button
                        className="w-full"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart?.(product);
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: Math.min(products.length, maxIndex + 1) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-gray-300"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
