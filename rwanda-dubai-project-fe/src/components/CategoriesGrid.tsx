import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { Category } from "../data/products";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CategoriesGridProps {
  categories: Category[];
  onCategoryClick?: (categoryId: string) => void;
}

export function CategoriesGrid({ categories, onCategoryClick }: CategoriesGridProps) {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Shop by Category
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Find exactly what you need from our comprehensive selection of 
            electronics, auto parts, tools, and home appliances.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Card 
              key={category.id} 
              className="group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onCategoryClick?.(category.id)}
            >
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden rounded-t-xl relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <ImageWithFallback
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-8">
                  <h3 className="font-bold text-xl mb-3 group-hover:text-gray-600 transition-colors duration-300">
                    {category.name}
                  </h3>
                  
                  <div className="space-y-2 mb-6">
                    {category.subcategories.slice(0, 3).map((sub, index) => (
                      <p key={index} className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors">
                        • {sub}
                      </p>
                    ))}
                    {category.subcategories.length > 3 && (
                      <p className="text-sm text-slate-500 font-medium">
                        +{category.subcategories.length - 3} more categories
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0 h-auto text-gray-600 hover:text-gray-700 font-semibold group-hover:translate-x-1 transition-all duration-300"
                  >
                    Explore Collection
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}