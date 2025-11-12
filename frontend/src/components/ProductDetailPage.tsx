import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Share2,
  ChevronLeft,
  Plus,
  Minus,
  Check
} from "lucide-react";
import { Product } from "../data/products";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ProductImageModal } from "./ProductImageModal";
import { useTranslation } from "react-i18next";

interface ProductDetailPageProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number) => void;
  onAddToWishlist?: (product: Product) => void;
  onBack?: () => void;
  relatedProducts?: Product[];
  onRelatedProductClick?: (product: Product) => void;
}

export function ProductDetailPage({
  product,
  onAddToCart,
  onAddToWishlist,
  onBack,
  relatedProducts = [],
  onRelatedProductClick,
}: ProductDetailPageProps) {
  const { t } = useTranslation();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("");

  const images = product.images || [product.image];
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const updateQuantity = (newQuantity: number) => {
    setQuantity(Math.max(1, newQuantity));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button */}
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      )}

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div 
            className="aspect-square rounded-lg overflow-hidden bg-muted cursor-zoom-in"
            onClick={() => handleImageClick(selectedImageIndex)}
          >
            <ImageWithFallback
              src={images[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === selectedImageIndex
                      ? "border-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{product.brand}</Badge>
              {discount > 0 && (
                <Badge variant="destructive">-{discount}% OFF</Badge>
              )}
              {!product.inStock && (
                <Badge variant="outline">Out of Stock</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= product.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            {discount > 0 && (
              <p className="text-sm text-green-600">
                You save ${(product.originalPrice! - product.price).toFixed(2)}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Features */}
          {product.features && (
            <div>
              <h3 className="font-semibold mb-2">Key Features</h3>
              <ul className="space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">{t("product.quantity")}</label>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1"
                disabled={!product.inStock}
                onClick={() => onAddToCart?.(product, quantity)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.inStock ? t("product.addToCart") : 'Out of Stock'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onAddToWishlist?.(product)}
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-4 w-4" />
                {t("product.share")}
              </Button>
            </div>
          </div>

          {/* Shipping Info */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">{t("product.freeShipping")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("product.freeShippingDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">{t("product.freeReturns")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("product.freeReturnsDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">{t("product.warranty")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("product.warrantyDesc")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="specifications" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="specifications">{t("product.specifications")}</TabsTrigger>
          <TabsTrigger value="reviews">{t("product.reviews")} ({product.reviews})</TabsTrigger>
          <TabsTrigger value="shipping">{t("product.shippingReturns")}</TabsTrigger>
        </TabsList>

        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("product.technicalSpecifications")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b last:border-b-0">
                    <span className="font-medium">{key}</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("product.customerReviews")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Review Summary */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{product.rating}</div>
                    <div className="flex justify-center mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= product.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {product.reviews} reviews
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Sample Reviews */}
                <div className="space-y-4">
                  {[
                    {
                      name: "John D.",
                      rating: 5,
                      date: "2 weeks ago",
                      comment: "Excellent product! Exactly as described and shipped quickly from Dubai to Kigali.",
                    },
                    {
                      name: "Marie K.",
                      rating: 4,
                      date: "1 month ago", 
                      comment: "Great quality and good price. Would recommend to others.",
                    },
                  ].map((review, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{review.name}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping & Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Shipping Information</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Free shipping on orders over $500</li>
                    <li>• Standard shipping: 7-14 business days</li>
                    <li>• Express shipping: 3-7 business days (additional cost)</li>
                    <li>• All items shipped from Dubai, UAE</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Return Policy</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 30-day return window</li>
                    <li>• Items must be in original condition</li>
                    <li>• Return shipping costs covered by customer</li>
                    <li>• Refund processed within 5-7 business days</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map(relatedProduct => (
              <Card key={relatedProduct.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onRelatedProductClick?.(relatedProduct)}>
                <CardContent className="p-4">
                  <div className="aspect-square mb-3 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium line-clamp-2 mb-2">{relatedProduct.name}</h3>
                  <p className="font-semibold">${relatedProduct.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Product Image Modal */}
      <ProductImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        images={images}
        productName={product.name}
        initialImageIndex={selectedImageIndex}
      />
    </div>
  );
}