import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Product } from "../data/products";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";

interface ProductCardProps {
  product: Product;
  onProductClick?: (product: Product) => void;
  className?: string;
}

export function ProductCard({ 
  product, 
  onProductClick,
  className 
}: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, isInWishlist, removeByProduct } = useWishlist();
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className={`group cursor-pointer hover:shadow-md transition-shadow ${className || ''}`}>
      <CardContent className="p-0">
        <div className="relative">
          <div 
            className="aspect-square overflow-hidden rounded-t-lg"
            onClick={() => onProductClick?.(product)}
          >
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
            variant={isInWishlist(parseInt(product.id)) ? "default" : "ghost"}
            className={`absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
              isInWishlist(parseInt(product.id)) 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-white/80 hover:bg-white'
            }`}
            onClick={async (e: { stopPropagation: () => void; }) => {
              e.stopPropagation();
              if (isInWishlist(parseInt(product.id))) {
                await removeByProduct(parseInt(product.id));
              } else {
                await addToWishlist(product);
              }
            }}
          >
            <Heart className={`h-4 w-4 ${isInWishlist(parseInt(product.id)) ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <div className="p-4">
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
          <div className="flex items-center gap-2 mb-3">
            <span className="font-semibold text-lg">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Add to cart button */}
          <Button
            size="sm"
            className={`w-full ${isInCart(parseInt(product.id)) ? 'bg-green-600 hover:bg-green-700' : ''}`}
            disabled={!product.inStock}
            onClick={async (e: { stopPropagation: () => void; }) => {
              e.stopPropagation();
              if (isInCart(parseInt(product.id))) {
                // Item is already in cart, could show a message or navigate to cart
                return;
              }
              await addToCart(product);
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock 
              ? (isInCart(parseInt(product.id)) ? 'In Cart' : 'Add to Cart')
              : 'Out of Stock'
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}