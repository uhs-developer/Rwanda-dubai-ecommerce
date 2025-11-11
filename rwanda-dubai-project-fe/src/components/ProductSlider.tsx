import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { Product } from "../data/products";

interface ProductSliderProps {
  title: string;
  products: Product[];
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onProductClick?: (product: Product) => void;
  onViewAll?: () => void;
}

export function ProductSlider({
  title,
  products,
  onAddToCart,
  onAddToWishlist,
  onProductClick,
  onViewAll,
}: ProductSliderProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const slider = sliderRef.current;
    if (!slider) return;

    const scrollAmount = 320; // Width of one card plus gap
    const newPosition = direction === 'left' 
      ? scrollPosition - scrollAmount 
      : scrollPosition + scrollAmount;

    const maxScroll = slider.scrollWidth - slider.clientWidth;
    const clampedPosition = Math.max(0, Math.min(newPosition, maxScroll));

    slider.scrollTo({ left: clampedPosition, behavior: 'smooth' });
    setScrollPosition(clampedPosition);
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = sliderRef.current 
    ? scrollPosition < sliderRef.current.scrollWidth - sliderRef.current.clientWidth
    : false;

  return (
    <section className="py-4 md:py-8">
      <div className="container mx-auto px-4">
        {/* Header - more compact on mobile */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
          <div className="flex items-center gap-2">
            {onViewAll && (
              <Button variant="ghost" size="sm" onClick={onViewAll} className="text-xs md:text-sm">
                View All
              </Button>
            )}
            {/* Hide navigation arrows on mobile */}
            <div className="hidden sm:flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Slider - 50% width cards on mobile */}
        <div className="relative">
          <div
            ref={sliderRef}
            className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <div key={product.id} className="flex-none w-[calc(50%-6px)] sm:w-64 md:w-80">
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onAddToWishlist={onAddToWishlist}
                  onProductClick={onProductClick}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}