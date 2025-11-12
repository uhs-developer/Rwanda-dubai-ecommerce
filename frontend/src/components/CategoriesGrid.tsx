import { useState, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Category } from "../data/products";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTranslation } from "react-i18next";

interface CategoriesGridProps {
  categories: Category[];
  onCategoryClick?: (categoryId: string) => void;
  onSubcategoryClick?: (categoryId: string, subcategoryName: string) => void;
}

export function CategoriesGrid({ categories, onCategoryClick, onSubcategoryClick }: CategoriesGridProps) {
  const { t } = useTranslation();
  const [scrollPosition, setScrollPosition] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Filter to only show top-level categories (no parent)
  const topLevelCategories = categories.filter(cat => !cat.parentId);
  const useSlider = topLevelCategories.length > 4;

  const scroll = (direction: 'left' | 'right') => {
    const slider = sliderRef.current;
    if (!slider) return;

    const scrollAmount = 320;
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
    <section className="py-8 md:py-16 bg-gradient-to-b from-white to-slate-50/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              {t("categories.shopByCategory")}
            </h2>
            <p className="text-sm md:text-base text-slate-600">
              {t("categories.description")}
            </p>
          </div>
          {useSlider && (
            <div className="hidden md:flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Categories - Grid or Slider */}
        {useSlider ? (
          <div className="relative">
            <div
              ref={sliderRef}
              className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {topLevelCategories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  index={index}
                  onCategoryClick={onCategoryClick}
                  onSubcategoryClick={onSubcategoryClick}
                  t={t}
                  isSlider={true}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {topLevelCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
                onCategoryClick={onCategoryClick}
                onSubcategoryClick={onSubcategoryClick}
                t={t}
                isSlider={false}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface CategoryCardProps {
  category: Category;
  index: number;
  onCategoryClick?: (categoryId: string) => void;
  onSubcategoryClick?: (categoryId: string, subcategoryName: string) => void;
  t: any;
  isSlider: boolean;
}

function CategoryCard({ category, index, onCategoryClick, onSubcategoryClick, t, isSlider }: CategoryCardProps) {
  return (
    <Card 
      className={`group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 bg-white hover:border-slate-300 animate-fade-in ${
        isSlider ? 'flex-none w-[280px]' : ''
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
      onClick={() => onCategoryClick?.(category.id)}
    >
      <CardContent className="p-0">
        {/* Compact Image - 4:3 ratio */}
        <div className="aspect-[4/3] overflow-hidden rounded-t-lg relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent z-10"></div>
          <ImageWithFallback
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Category name overlay on image */}
          <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 z-20">
            <h3 className="font-bold text-base md:text-lg text-white drop-shadow-lg">
              {category.name}
            </h3>
          </div>
        </div>
        
        {/* Compact Content */}
        <div className="p-3 md:p-4">
          {/* Subcategories list - compact */}
          {category.subcategories && category.subcategories.length > 0 && (
            <div className="space-y-1 mb-3">
              {category.subcategories.slice(0, 3).map((sub, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubcategoryClick?.(category.id, sub);
                  }}
                  className="block text-xs md:text-sm text-slate-600 hover:text-gray-600 transition-colors text-left w-full truncate"
                >
                  • {sub}
                </button>
              ))}
              {category.subcategories.length > 3 && (
                <p className="text-xs text-slate-500 font-medium">
                  +{category.subcategories.length - 3} more
                </p>
              )}
            </div>
          )}

          {/* Explore CTA */}
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-auto text-xs md:text-sm text-gray-600 hover:text-gray-700 font-semibold group-hover:translate-x-1 transition-all duration-300 w-full justify-start"
            onClick={(e) => {
              e.stopPropagation();
              onCategoryClick?.(category.id);
            }}
          >
            {t("categories.exploreCollection") || "Explore"}
            <ArrowRight className="ml-1 h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
