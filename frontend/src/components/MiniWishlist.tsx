import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Trash2, ShoppingCart, Heart } from "lucide-react";
import { WishlistItem } from "../data/wishlist";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface MiniWishlistProps {
  isOpen: boolean;
  onClose: () => void;
  items: WishlistItem[];
  onRemoveItem: (productId: string) => void;
  onAddToCart: (item: WishlistItem) => void;
  onProductClick: (item: WishlistItem) => void;
  onViewAll: () => void;
}

export function MiniWishlist({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onAddToCart,
  onProductClick,
  onViewAll,
}: MiniWishlistProps) {
  if (items.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Wishlist
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col items-center justify-center h-96">
            <div className="text-6xl mb-4">💝</div>
            <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground text-center mb-6">
              Save items you love for later
            </p>
            <Button onClick={onClose}>Continue Shopping</Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Wishlist
              <Badge variant="secondary">{items.length}</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={onViewAll}>
              View All
            </Button>
          </SheetTitle>
        </SheetHeader>

        {/* Wishlist Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-4">
            {items.slice(0, 5).map((item) => (
              <div key={item.id} className="flex gap-4 p-3 border rounded-lg">
                <div 
                  className="w-16 h-16 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => onProductClick(item)}
                >
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 
                    className="font-medium line-clamp-2 mb-1 cursor-pointer hover:text-primary"
                    onClick={() => onProductClick(item)}
                  >
                    {item.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">{item.brand}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">${item.price}</span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        className="h-8 px-3"
                        onClick={() => onAddToCart(item)}
                        disabled={!item.inStock}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {items.length > 5 && (
              <div className="text-center py-4">
                <Button variant="outline" onClick={onViewAll}>
                  View All {items.length} Items
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <Button size="lg" className="w-full" onClick={onClose}>
            Continue Shopping
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}