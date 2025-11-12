import { useQuery } from 'urql';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { GET_CATEGORIES_WITH_MIN_PRODUCTS } from "../graphql/storefront";
import { useMemo } from 'react';

interface CategoriesGridDynamicProps {
  minProductCount?: number;
  onCategoryClick?: (categorySlug: string) => void;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  productCount: number;
  children: {
    id: string;
    name: string;
    slug: string;
    productCount: number;
  }[];
}

export function CategoriesGridDynamic({
  minProductCount = 4,
  onCategoryClick
}: CategoriesGridDynamicProps) {
  // Fetch categories from backend
  const [categoriesResult] = useQuery({
    query: GET_CATEGORIES_WITH_MIN_PRODUCTS,
  });

  const categories: Category[] = categoriesResult.data?.categories || [];

  // Filter categories with minimum product count
  const filteredCategories = useMemo(() => {
    return categories
      .filter(cat => cat.productCount >= minProductCount)
      .map(cat => ({
        ...cat,
        // Also filter children to show only those with products
        children: cat.children.filter(sub => sub.productCount > 0).slice(0, 3)
      }));
  }, [categories, minProductCount]);

  if (categoriesResult.fetching) {
    return (
      <section className="py-8 sm:py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Loading Categories...</h2>
        </div>
      </section>
    );
  }

  if (filteredCategories.length === 0) {
    return null; // Don't show section if no categories with enough products
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <Card
              key={category.id}
              className="group cursor-pointer hover:shadow-lg transition-all overflow-hidden"
              onClick={() => onCategoryClick?.(category.slug)}
            >
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
                    <span className="text-6xl font-bold text-primary/40">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {category.productCount} products available
                </p>
                {category.children.length > 0 && (
                  <div className="space-y-1 mb-3">
                    {category.children.map((sub) => (
                      <p key={sub.id} className="text-sm text-muted-foreground">
                        • {sub.name}
                      </p>
                    ))}
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  Browse {category.name}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
