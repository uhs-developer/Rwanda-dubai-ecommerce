import { useNavigate } from 'react-router-dom';
import { HeroBanner } from "./HeroBanner";
import { CategoriesGrid } from "./CategoriesGrid";
import { ProductSlider } from "./ProductSlider";
import { CategoryFeaturedSlider } from "./CategoryFeaturedSlider";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Truck, Shield, Headphones, CreditCard, Star, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { 
  categories, 
  featuredProducts, 
  bestSellers, 
  newArrivals, 
  appleProducts,
  hyundaiParts,
  samsungProducts,
  audioProducts,
  Product 
} from "../data/products";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ValuesSection } from "./ValuesSection";

interface HomepageProps {
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onProductClick?: (product: Product) => void;
}

export function Homepage({
  onAddToCart,
  onAddToWishlist,
  onProductClick
}: HomepageProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  const handleViewCategory = (categoryId: string, subcategory?: string) => {
    if (subcategory) {
      navigate(`/category/${categoryId}/${subcategory}`);
    } else {
      navigate(`/category/${categoryId}`);
    }
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryName: string) => {
    // Convert subcategory name to slug format
    const subcategorySlug = subcategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/category/${categoryId}/${subcategorySlug}`);
  };

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
    onProductClick?.(product);
  };

  const handleShopNow = () => {
    navigate('/products');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <HeroBanner onShopNow={handleShopNow} />

      {/* Categories */}
      <CategoriesGrid 
        categories={categories} 
        onCategoryClick={handleCategoryClick}
        onSubcategoryClick={handleSubcategoryClick}
      />

      {/* Apple Products Showcase */}
      <CategoryFeaturedSlider
        title={t("home.latestAppleProducts")}
        subtitle={t("home.appleSubtitle")}
        products={appleProducts}
        onAddToCart={onAddToCart}
        onAddToWishlist={onAddToWishlist}
        onProductClick={handleProductClick}
        onViewAll={() => handleViewCategory('electronics', 'Apple')}
        autoPlay={true}
        showOneOnMobile={true}
      />

      {/* Featured Products */}
      <ProductSlider
        title={t("home.featuredProducts")}
        products={featuredProducts}
        onAddToCart={onAddToCart}
        onAddToWishlist={onAddToWishlist}
        onProductClick={handleProductClick}
        onViewAll={() => navigate('/products')}
      />

      {/* Promotional Banner */}
      <section className="py-24 bg-gradient-to-r from-gray-600/10 via-slate-600/10 to-gray-700/10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gray-400/20 to-slate-600/20 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl translate-y-48 -translate-x-48"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-slide-in-left">
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg animate-pulse">
                🔥 {t("home.limitedTimeOffer")}
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                {t("home.upToOff")}
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                {t("home.electronicsDealDesc")}
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg group"
                onClick={() => handleViewCategory('electronics')}
              >
                {t("home.shopElectronics")}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl animate-slide-in-right">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=450"
                alt="Electronics sale"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hyundai Auto Parts Section */}
      <CategoryFeaturedSlider
        title={t("home.hyundaiParts")}
        subtitle={t("home.hyundaiSubtitle")}
        products={hyundaiParts}
        onAddToCart={onAddToCart}
        onAddToWishlist={onAddToWishlist}
        onProductClick={handleProductClick}
        onViewAll={() => handleViewCategory('auto-parts', 'Hyundai')}
        showOneOnMobile={false}
      />

      {/* Best Sellers */}
      <ProductSlider
        title={t("home.bestSellers")}
        products={bestSellers}
        onAddToCart={onAddToCart}
        onAddToWishlist={onAddToWishlist}
        onProductClick={handleProductClick}
        onViewAll={() => navigate('/products')}
      />

      {/* Samsung Products Section */}
      <CategoryFeaturedSlider
        title={t("home.samsungCollection")}
        subtitle={t("home.samsungSubtitle")}
        products={samsungProducts}
        onAddToCart={onAddToCart}
        onAddToWishlist={onAddToWishlist}
        onProductClick={handleProductClick}
        onViewAll={() => handleViewCategory('electronics', 'Samsung')}
        autoPlay={true}
        showOneOnMobile={true}
      />

      {/* Services */}
      <section className="py-24 bg-gradient-to-b from-slate-50/50 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-br from-gray-100/30 to-slate-100/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              {t("home.whyChooseTitle")}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {t("home.whyChooseDesc")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Truck,
                title: t("home.freeShippingTitle"),
                description: t("home.freeShippingDesc"),
                color: "from-gray-500 to-gray-600",
                bgColor: "from-gray-100 to-gray-200"
              },
              {
                icon: Shield,
                title: t("home.authenticProductsTitle"),
                description: t("home.authenticProductsDesc"),
                color: "from-emerald-500 to-emerald-600",
                bgColor: "from-emerald-100 to-emerald-200"
              },
              {
                icon: Headphones,
                title: t("home.supportTitle"),
                description: t("home.supportDesc"),
                color: "from-purple-500 to-purple-600",
                bgColor: "from-purple-100 to-purple-200"
              },
              {
                icon: CreditCard,
                title: t("home.securePaymentTitle"),
                description: t("home.securePaymentDesc"),
                color: "from-amber-500 to-amber-600",
                bgColor: "from-amber-100 to-amber-200"
              }
            ].map((service, index) => (
              <Card 
                key={index} 
                className="text-center p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white animate-fade-in group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-0">
                  <div className={`inline-flex p-4 bg-gradient-to-br ${service.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className={`h-8 w-8 bg-gradient-to-br ${service.color} bg-clip-text text-transparent`} />
                  </div>
                  <h3 className="font-bold text-xl mb-4 group-hover:text-gray-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Audio Products Section */}
      {audioProducts.length > 0 && (
        <CategoryFeaturedSlider
          title={t("home.premiumAudio")}
          subtitle={t("home.audioSubtitle")}
          products={audioProducts}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
          onProductClick={handleProductClick}
          onViewAll={() => handleViewCategory('electronics', 'Audio')}
          showOneOnMobile={false}
        />
      )}

      {/* New Arrivals */}
      <ProductSlider
        title={t("footer.newArrivals")}
        products={newArrivals}
        onAddToCart={onAddToCart}
        onAddToWishlist={onAddToWishlist}
        onProductClick={handleProductClick}
        onViewAll={() => navigate('/new-arrivals')}
      />

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50/50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-yellow-200/20 to-orange-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-green-200/20 to-gray-300/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              {t("home.testimonialsTitle")}
            </h2>
            <div className="flex justify-center items-center gap-3 mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-6 w-6 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                ))}
              </div>
              <span className="text-lg text-slate-600 font-medium">{t("home.testimonialsRating")}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Jean Baptiste K.",
                location: "Kigali, Rwanda",
                rating: 5,
                text: "Excellent service! Got my iPhone 15 Pro in just 10 days and it was exactly as described. The packaging was perfect and customer service was very helpful throughout the process."
              },
              {
                name: "Marie Claire U.",
                location: "Butare, Rwanda", 
                rating: 5,
                text: "Great selection of auto parts. Found the exact brake pads for my Hyundai Tucson. Fast shipping from Dubai and competitive prices. Highly recommend!"
              },
              {
                name: "David M.",
                location: "Gisenyi, Rwanda",
                rating: 5,
                text: "Professional team, authentic products, and reasonable prices. The chatbot helped me find exactly what I needed. My go-to place for electronics from Dubai."
              }
            ].map((testimonial, index) => (
              <Card 
                key={index} 
                className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-white/90 backdrop-blur-sm group animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`h-5 w-5 ${
                        star <= testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`} />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-6 italic text-lg leading-relaxed group-hover:text-slate-700 transition-colors">
                    "{testimonial.text}"
                  </p>
                  <div className="border-t border-slate-100 pt-4">
                    <p className="font-semibold text-slate-800">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values - placed before footer to reinforce trust */}
      <ValuesSection />

      {/* Newsletter Section */}
      <section className="py-24 bg-gradient-to-r from-gray-600 via-slate-600 to-gray-700 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-48 translate-y-48"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 via-transparent to-gray-700/20"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              {t("home.newsletterTitle")}
            </h2>
            <p className="text-xl lg:text-2xl mb-12 opacity-90 leading-relaxed">
              {t("home.newsletterDesc")}
            </p>
            <div className="max-w-lg mx-auto flex flex-col sm:flex-row gap-4 mb-8">
              <input
                type="email"
                placeholder={t("footer.newsletterPlaceholder")}
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 text-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
              />
              <Button
                size="lg"
                className="bg-white text-gray-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-xl"
              >
                {t("footer.subscribe")}
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/80">
              <p className="text-sm">
                {t("home.newsletterJoin")}
              </p>
              <p className="text-sm">
                {t("home.newsletterUnsubscribe")}
              </p>
              <p className="text-sm">
                {t("home.newsletterSpam")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}