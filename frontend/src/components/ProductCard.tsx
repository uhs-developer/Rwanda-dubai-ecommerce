import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Product } from "../data/products";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onProductClick?: (product: Product) => void;
  className?: string;
}

export function ProductCard({ 
  product, 
  onAddToCart, 
  onAddToWishlist, 
  onProductClick,
  className 
}: ProductCardProps) {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Check if list mode (flex-row class is applied)
  const isListMode = className?.includes('flex-row') || className?.includes('flex flex-row');

  return (
    <Card className={`group cursor-pointer hover:shadow-md transition-shadow ${className || ''}`}>
      <CardContent className={isListMode ? "p-0 flex" : "p-0"}>
        <div className={`relative ${isListMode ? "w-48 h-48 flex-shrink-0" : ""}`}>
          <div 
            className={`${isListMode ? "w-full h-full rounded-l-lg" : "aspect-[4/3] overflow-hidden rounded-t-lg"}`}
            onClick={() => onProductClick?.(product)}
          >
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className={`${isListMode ? "w-full h-full object-cover" : "w-full h-full object-cover"} group-hover:scale-105 transition-transform duration-300`}
            />
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
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

          {/* Wishlist button */}
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e: { stopPropagation: () => void; }) => {
              e.stopPropagation();
              onAddToWishlist?.(product);
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        <div className={`p-3 ${isListMode ? "flex-1 flex flex-col justify-between" : ""}`}>
          {/* Brand */}
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product.brand}
          </p>

          {/* Product name */}
          <h3 
            className="font-medium line-clamp-2 mb-2 hover:text-primary transition-colors"
            onClick={() => onProductClick?.(product)}
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-muted-foreground ml-1">
                {product.rating} ({product.reviews})
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-base">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Add to cart button */}
          <Button
            size="sm"
            className="w-full text-xs"
            disabled={!product.inStock}
            onClick={(e: { stopPropagation: () => void; }) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}