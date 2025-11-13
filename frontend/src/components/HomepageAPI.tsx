import { useQuery } from 'urql';
import { useNavigate } from 'react-router-dom';
import { HeroBanner } from "./HeroBanner";
import { ValuesSection } from "./ValuesSection";
import { CategoriesGrid } from "./CategoriesGrid";
import { ProductSlider } from "./ProductSlider";
import { CategoryFeaturedSlider } from "./CategoryFeaturedSlider";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Truck, Shield, Headphones, CreditCard, Star, ArrowRight, AlertCircle } from "lucide-react";
import { transformProductForDisplay } from "../services/product";
import { useTranslation } from "react-i18next";
import { GET_STOREFRONT_CATEGORIES, GET_FEATURED_PRODUCTS, GET_BRANDS, GET_PAGE_CONTENT } from "../graphql/storefront";

interface HomepageAPIProps {
  onAddToCart?: (product: any) => void;
  onAddToWishlist?: (product: any) => void;
  onProductClick?: (product: any) => void;
}

export function HomepageAPI({
  onAddToCart,
  onAddToWishlist,
  onProductClick
}: HomepageAPIProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // GraphQL queries
  const [categoriesResult] = useQuery({
    query: GET_STOREFRONT_CATEGORIES,
  });
  
  const [featuredProductsResult] = useQuery({
    query: GET_FEATURED_PRODUCTS,
    variables: { perPage: 12, isFeatured: true },
  });
  
  const [brandsResult] = useQuery({
    query: GET_BRANDS,
  });

  const categories = categoriesResult.data?.categories || [];
  const featuredProducts = featuredProductsResult.data?.products?.data || [];
  const brands = brandsResult.data?.brands || [];
  const loading = categoriesResult.fetching || featuredProductsResult.fetching || brandsResult.fetching;
  const error = categoriesResult.error || featuredProductsResult.error || brandsResult.error;

  // Homepage CMS content
  const [homeContentResult] = useQuery({
    query: GET_PAGE_CONTENT,
    variables: { pageKey: 'home' }
  });
  const homeSections = homeContentResult.data?.adminPageContent?.sections || [];
  const getHome = (key: string, fallback = '') => {
    const s = homeSections.find((x: any) => x.key === key);
    return s?.content || fallback;
  };

  const handleCategoryClick = (categorySlug: string) => {
    navigate(`/category/${categorySlug}`);
  };

  const handleViewCategory = (categorySlug: string, subcategorySlug?: string) => {
    if (subcategorySlug) {
      navigate(`/category/${categorySlug}/${subcategorySlug}`);
    } else {
      navigate(`/category/${categorySlug}`);
    }
  };

  const handleSubcategoryClick = (categorySlug: string, subcategoryName: string) => {
    // Convert subcategory name to slug format
    const subcategorySlug = subcategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/category/${categorySlug}/${subcategorySlug}`);
  };

  const handleProductClick = (product: any) => {
    navigate(`/product/${product.slug}`);
    onProductClick?.(product);
  };

  const handleViewAllProducts = () => {
    navigate('/products');
  };

  const handleShopNow = () => {
    navigate('/products');
  };

  // Transform API data for display
  const displayFeaturedProducts = featuredProducts.map(transformProductForDisplay);

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-32 w-full" />
          <CardContent className="p-3">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ErrorState = ({ title, message }: { title: string; message: string }) => (
    <div className="text-center py-8">
      <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
      <p className="font-medium mb-1">{title}</p>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <HeroBanner onShopNow={handleShopNow} />

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Categories Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t("categories.shopByCategory")}</h2>
            <Button variant="ghost" onClick={() => navigate('/categories')}>
              {t("common.viewAll")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          {categories.length > 0 ? (
            <CategoriesGrid 
              categories={categories.map((cat: any) => ({
                id: cat.slug,
                name: cat.name,
                image: cat.image || `https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300`,
                subcategories: cat.children?.map((sub: any) => sub.name) || [],
                parentId: undefined // Ensure we're marking these as top-level
              }))} 
              onCategoryClick={handleCategoryClick}
              onSubcategoryClick={handleSubcategoryClick}
            />
          ) : loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <ErrorState title={t("home.failedToLoadCategories")} message={t("home.refreshPage")} />
          )}
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{t("home.featuredProducts")}</h2>
              <p className="text-muted-foreground">{t("home.handPickedProducts")}</p>
            </div>
            <Button variant="ghost" onClick={handleViewAllProducts}>
              {t("common.viewAll")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          {error && !loading ? (
            <ErrorState title={t("home.failedToLoadFeaturedProducts")} message={error.message || "An error occurred"} />
          ) : loading ? (
            <LoadingSkeleton />
          ) : displayFeaturedProducts.length > 0 ? (
            <ProductSlider
              title={t("home.featuredProducts")}
              products={displayFeaturedProducts}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
              onProductClick={handleProductClick}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t("home.noFeaturedProducts")}</p>
            </div>
          )}
        </section>

        {/* Category Featured Sections */}
        {categories.slice(0, 3).map((category: any) => (
          <section key={category.id}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">{category.name}</h2>
                <p className="text-muted-foreground">
                  {category.description || t("home.exploreCollection", { category: category.name.toLowerCase() })}
                </p>
              </div>
              <Button variant="ghost" onClick={() => handleViewCategory(category.slug)}>
                {t("common.viewAll")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            {/* For now, show featured products filtered by category if available */}
            {displayFeaturedProducts.length > 0 ? (
              <CategoryFeaturedSlider
                title={category.name}
                products={displayFeaturedProducts.slice(0, 6)}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
                onProductClick={handleProductClick}
                onViewAll={() => handleViewCategory(category.slug)}
              />
            ) : loading ? (
              <LoadingSkeleton />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t("home.noProductsInCategory")}</p>
              </div>
            )}
          </section>
        ))}

        {/* Benefits from CMS */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8">{getHome('benefit_title', t("home.whyChoosePlatform"))}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Truck className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{getHome('benefit_1_title', t("home.fastShippingTitle"))}</h3>
                <p className="text-sm text-muted-foreground">{getHome('benefit_1_desc', t("home.fastShippingDesc"))}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{getHome('benefit_2_title', t("home.qualityGuaranteedTitle"))}</h3>
                <p className="text-sm text-muted-foreground">{getHome('benefit_2_desc', t("home.qualityGuaranteedDesc"))}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Headphones className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{getHome('benefit_3_title', t("home.supportTitle"))}</h3>
                <p className="text-sm text-muted-foreground">{getHome('benefit_3_desc', t("home.supportDesc"))}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <CreditCard className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{getHome('benefit_4_title', t("home.securePaymentsTitle"))}</h3>
                <p className="text-sm text-muted-foreground">{getHome('benefit_4_desc', t("home.securePaymentsDesc"))}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works (CMS) */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-6">{getHome('how_title', 'How Kora Works')}</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[getHome('how_step1'), getHome('how_step2'), getHome('how_step3')].filter(Boolean).map((step, i) => (
              <Card key={i}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-black text-primary mb-2">{i + 1}</div>
                  <p className="text-sm text-muted-foreground">{step}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Sourcing Hubs (CMS) */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-4">{getHome('sourcing_title', 'Our Sourcing Hubs')}</h2>
          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-6">{getHome('sourcing_body')}</p>
        </section>

        {/* TLC Transparency (CMS) */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-4">{getHome('tlc_title', 'Transparent Total Landed Cost (TLC)')}</h2>
          <p className="text-center text-muted-foreground max-w-3xl mx-auto">{getHome('tlc_body')}</p>
        </section>

        {/* Our Values - pre-footer trust section */}
        <ValuesSection />

        {/* Testimonials */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8">{t("home.testimonialsTitle")}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Jean Claude Uwimana",
                location: "Kigali, Rwanda",
                rating: 5,
                comment: "Amazing quality products and fast delivery. Got my iPhone from Dubai in just 6 days!"
              },
              {
                name: "Marie Mukamana",
                location: "Butare, Rwanda", 
                rating: 5,
                comment: "Perfect auto parts for my Hyundai. Genuine parts at great prices with excellent customer service."
              },
              {
                name: "David Nkurunziza",
                location: "Gisenyi, Rwanda",
                rating: 5,
                comment: "Best e-commerce platform for international shopping. Reliable and trustworthy!"
              }
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    "{testimonial.comment}"
                  </p>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-muted rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">{t("home.newsletterTitle")}</h2>
          <p className="text-muted-foreground mb-6">
            {t("home.newsletterDesc")}
          </p>
          <div className="flex max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder={t("home.emailPlaceholder")}
              className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
            />
            <Button>{t("footer.subscribe")}</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t("home.privacyNotice")}
          </p>
        </section>
      </div>
    </div>
  );
}

