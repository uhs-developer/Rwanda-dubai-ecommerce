import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, Truck, Shield } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "../contexts/CartContext";

interface CartPageProps {
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export function CartPage({
  onCheckout,
  onContinueShopping,
}: CartPageProps) {
  const { cartItems, updateCartItem, removeFromCart } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + item.total_price, 0);
  const shipping = 35; // Fixed shipping cost
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + shipping + tax;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);


  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any items to your cart yet. 
            Start shopping to find great deals on electronics and auto parts.
          </p>
          <Button size="lg" onClick={onContinueShopping}>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onContinueShopping}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                        <ImageWithFallback
                          src={item.product.image || ''}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold line-clamp-2">{item.product.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.product.brand?.name || 'Unknown Brand'}</p>
                            {item.product.original_price && (
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="destructive" className="text-xs">
                                  -{Math.round(((item.product.original_price - item.price) / item.product.original_price) * 100)}% OFF
                                </Badge>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateCartItem(item.id, Math.max(1, item.quantity - 1))}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-4 py-2 min-w-[3rem] text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateCartItem(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="font-semibold">
                              RWF {item.total_price.toFixed(2)}
                            </div>
                            {item.product.original_price && (
                              <div className="text-sm text-muted-foreground line-through">
                                RWF {(item.product.original_price * item.quantity).toFixed(2)}
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                              RWF {item.price} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Benefits */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Truck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      Fast shipping from Dubai to Rwanda
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Fast shipping from Dubai to Rwanda - RWF 35 flat rate
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>RWF {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>RWF {shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>RWF {tax.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>RWF {total.toFixed(2)}</span>
              </div>

              <Button size="lg" className="w-full" onClick={onCheckout}>
                Proceed to Checkout
              </Button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Secure 256-bit SSL encryption</span>
              </div>

              {/* Additional Info */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Free returns within 30 days</p>
                <p>• 2-year manufacturer warranty</p>
                <p>• Customer support in English & Kinyarwanda</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}