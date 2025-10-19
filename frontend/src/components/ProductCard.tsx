import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Product as MockProduct } from "../data/products";
import { Product as ApiProduct } from "../services/product";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";

type Product = MockProduct | ApiProduct;

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
  
  // Handle both mock and API product types
  const isApiProduct = 'effective_price' in product;
  const displayPrice = isApiProduct ? product.effective_price : product.price;
  const originalPrice = isApiProduct ? product.price : product.originalPrice;
  const hasPromotionalPrice = isApiProduct ? product.has_promotional_price : false;
  const discountPercentage = isApiProduct ? product.promotional_discount_percentage : 
    (product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);

  return (
    <Card className={`group cursor-pointer hover:shadow-md transition-shadow ${className || ''}`}>
      <CardContent className="p-0">
        <div className="relative">
          <div 
            className="aspect-square overflow-hidden rounded-t-lg"
            onClick={() => onProductClick?.(product)}
          >
            <ImageWithFallback
              src={isApiProduct ? (typeof product.images?.[0] === 'string' ? product.images[0] : product.images?.[0]?.image_url || '') : product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {((discountPercentage || 0) > 0 || hasPromotionalPrice) && (
              <Badge variant="destructive" className="text-xs">
                -{discountPercentage || 0}%
              </Badge>
            )}
            {!isApiProduct && !product.inStock && (
              <Badge variant="secondary" className="text-xs">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Wishlist button */}
          <Button
            size="sm"
            variant={isInWishlist(parseInt(String(product.id))) ? "default" : "ghost"}
            className={`absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
              isInWishlist(parseInt(String(product.id))) 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-white/80 hover:bg-white'
            }`}
            onClick={async (e: { stopPropagation: () => void; }) => {
              e.stopPropagation();
              if (isInWishlist(parseInt(String(product.id)))) {
                await removeByProduct(parseInt(String(product.id)));
              } else {
                await addToWishlist(product);
              }
            }}
          >
            <Heart className={`h-4 w-4 ${isInWishlist(parseInt(String(product.id))) ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <div className="p-4">
          {/* Brand */}
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {isApiProduct ? product.brand?.name || 'Unknown' : product.brand}
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
                {isApiProduct ? 4.5 : product.rating} ({isApiProduct ? 0 : product.reviews})
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-semibold text-lg">RWF {displayPrice}</span>
            {(originalPrice && originalPrice > displayPrice) && (
              <span className="text-sm text-muted-foreground line-through">
                RWF {originalPrice}
              </span>
            )}
          </div>

          {/* Add to cart button */}
          <Button
            size="sm"
            className={`w-full ${isInCart(parseInt(String(product.id))) ? 'bg-green-600 hover:bg-green-700' : ''}`}
            disabled={!isApiProduct && !product.inStock}
            onClick={async (e: { stopPropagation: () => void; }) => {
              e.stopPropagation();
              if (isInCart(parseInt(String(product.id)))) {
                // Item is already in cart, could show a message or navigate to cart
                return;
              }
              await addToCart(product);
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {!isApiProduct && product.inStock 
              ? (isInCart(parseInt(String(product.id))) ? 'In Cart' : 'Add to Cart')
              : 'Add to Cart'
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}