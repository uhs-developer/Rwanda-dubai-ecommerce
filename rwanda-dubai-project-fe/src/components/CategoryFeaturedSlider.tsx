import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Heart } from "lucide-react";
import { Product } from "../data/products";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CategoryFeaturedSliderProps {
  title: string;
  subtitle?: string;
  products: Product[];
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onProductClick?: (product: Product) => void;
  onViewAll?: () => void;
  autoPlay?: boolean;
  showOneOnMobile?: boolean;
}

export function CategoryFeaturedSlider({
  title,
  subtitle,
  products,
  onAddToCart,
  onAddToWishlist,
  onProductClick,
  onViewAll,
  autoPlay = false,
  showOneOnMobile = true,
}: CategoryFeaturedSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isHovered && products.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
      }, 4000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, isHovered, products.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const getVisibleProducts = () => {
    if (showOneOnMobile) {
      // Mobile: show 1, Desktop: show 4
      return products.slice(currentIndex, currentIndex + 4);
    } else {
      // Show 3-4 products at once
      return products.slice(currentIndex, currentIndex + 3);
    }
  };

  return (
    <section 
      className="py-6 md:py-12 bg-gradient-to-br from-muted/30 to-muted/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto px-4">
        {/* Header - compact on mobile */}
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <div>
            <h2 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">{title}</h2>
            {subtitle && (
              <p className="text-xs md:text-base text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            {onViewAll && (
              <Button variant="outline" size="sm" onClick={onViewAll} className="text-xs md:text-sm">
                View All
              </Button>
            )}
            <div className="hidden sm:flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={prevSlide}
                disabled={products.length <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={nextSlide}
                disabled={products.length <= 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Slider */}
        <div className="relative overflow-hidden">
          <div 
            ref={sliderRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{ 
              transform: `translateX(-${currentIndex * (showOneOnMobile ? 100 : 33.333)}%)`,
            }}
          >
            {products.map((product, index) => {
              const discount = product.originalPrice 
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  className={`flex-shrink-0 px-2 ${
                    showOneOnMobile 
                      ? 'w-1/2 sm:w-1/2 lg:w-1/4' 
                      : 'w-1/2 sm:w-1/2 lg:w-1/3'
                  }`}
                >
                  <Card className="group h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0">
                      <div className="relative">
                        {/* Product Image */}
                        <div 
                          className="aspect-[4/3] overflow-hidden rounded-t-lg cursor-pointer"
                          onClick={() => onProductClick?.(product)}
                        >
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                          {discount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              -{discount}%
                            </Badge>
                          )}
                          {!product.inStock && (
                            <Badge variant="secondary" className="text-xs">
                              Out of Stock
                            </Badge>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-3 right-3 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e: { stopPropagation: () => void; }) => {
                            e.stopPropagation();
                            onAddToWishlist?.(product);
                          }}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>

                        {/* Quick Add to Cart */}
                        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            className="w-full"
                            disabled={!product.inStock}
                            onClick={(e: { stopPropagation: () => void; }) => {
                              e.stopPropagation();
                              onAddToCart?.(product);
                            }}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Quick Add
                          </Button>
                        </div>
                      </div>

                      <div className="p-4">
                        {/* Brand */}
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                          {product.brand}
                        </p>

                        {/* Product Name */}
                        <h3 
                          className="font-semibold line-clamp-2 mb-2 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => onProductClick?.(product)}
                        >
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= product.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {product.rating} ({product.reviews})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">${product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${product.originalPrice}
                              </span>
                            )}
                          </div>
                          {discount > 0 && (
                            <Badge variant="outline" className="text-xs text-green-600">
                              Save ${(product.originalPrice! - product.price).toFixed(0)}
                            </Badge>
                          )}
                        </div>

                        {/* Key Features */}
                        {product.features && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs text-muted-foreground">
                              {product.features.slice(0, 2).join(" • ")}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots Indicator */}
        {products.length > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: Math.ceil(products.length / (showOneOnMobile ? 1 : 3)) }).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  Math.floor(currentIndex / (showOneOnMobile ? 1 : 3)) === index
                    ? 'bg-primary'
                    : 'bg-muted-foreground/30'
                }`}
                onClick={() => goToSlide(index * (showOneOnMobile ? 1 : 3))}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}