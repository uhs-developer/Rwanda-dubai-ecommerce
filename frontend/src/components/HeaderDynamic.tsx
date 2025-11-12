import { useQuery } from 'urql';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  ShoppingCart,
  User,
  Menu,
  Heart,
  ChevronDown,
  Package,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { UserAccountDropdown } from "./UserAccountDropdown";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ui/ThemeToggle";
import { LanguageSelector } from "./ui/LanguageSelector";
import { useTranslation } from "react-i18next";
import { GET_STOREFRONT_CATEGORIES } from "../graphql/storefront";
import { useMemo } from 'react';

interface HeaderDynamicProps {
  cartItemCount?: number;
  wishlistItemCount?: number;
  onCartClick?: () => void;
  onWishlistClick?: () => void;
  onSearchClick?: (query: string) => void;
  onCategoryClick?: (categorySlug: string) => void;
  onSubcategoryClick?: (categorySlug: string, subcategorySlug: string) => void;
  onNavigate?: (view: string, data?: any) => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
  onLogout?: () => void;
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

export function HeaderDynamic({
  cartItemCount = 0,
  wishlistItemCount = 0,
  onCartClick,
  onWishlistClick,
  onSearchClick,
  onCategoryClick,
  onSubcategoryClick,
  onNavigate,
  user,
  onLogout
}: HeaderDynamicProps) {
  const { t } = useTranslation();

  // Fetch categories from backend
  const [categoriesResult] = useQuery({
    query: GET_STOREFRONT_CATEGORIES,
  });

  const categories: Category[] = categoriesResult.data?.categories || [];

  // Filter categories with at least 1 product for navigation
  const navigationCategories = useMemo(() => {
    return categories
      .filter(cat => cat.productCount > 0)
      .map(cat => ({
        ...cat,
        // Show all subcategories, even if they have 0 products
        children: cat.children
      }));
  }, [categories]);

  const handleCategoryClick = (slug: string) => {
    onCategoryClick?.(slug);
  };

  const handleSubcategoryClick = (categorySlug: string, subcategorySlug: string) => {
    onSubcategoryClick?.(categorySlug, subcategorySlug);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top banner */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          {/* Lanes in top bar */}
          <div className="text-xs sm:text-sm flex items-center gap-3 overflow-x-auto whitespace-nowrap">
            <span>Dubai → Rwanda</span>
            <span className="opacity-70">•</span>
            <span>China → Rwanda</span>
            <span className="opacity-70">•</span>
            <span>Korea → Rwanda</span>
          </div>
          <p className="hidden sm:block text-sm">
            Free shipping on orders over $5000
          </p>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        {/* Desktop: Single row layout */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer flex-shrink-0"
            onClick={() => onNavigate?.('home')}
          >
            <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
              TB
            </div>
            <h1 className="text-2xl font-bold text-primary hidden lg:block">TechBridge</h1>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <SearchBar
              onSearch={onSearchClick}
              placeholder={t("header.search")}
              className="w-full"
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Language Selector */}
            <LanguageSelector />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Account - Show dropdown if logged in, button if not */}
            {user ? (
              <UserAccountDropdown
                user={user}
                onLogout={onLogout!}
                onNavigate={onNavigate}
              />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex"
                onClick={() => onNavigate?.('auth')}
              >
                <User className="h-4 w-4 mr-2" />
                {t("header.account")}
              </Button>
            )}

            {/* Mini Wishlist */}
            <Button
              variant="ghost"
              size="sm"
              className="relative hidden sm:flex"
              onClick={onWishlistClick}
            >
              <Heart className="h-4 w-4 mr-2" />
              {t("header.wishlist")}
              {wishlistItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {wishlistItemCount > 99 ? "99+" : wishlistItemCount}
                </Badge>
              )}
            </Button>

            {/* Mini Cart */}
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t("header.cart")}</span>
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </Badge>
              )}
            </Button>

          </div>
        </div>

        {/* Mobile: Two row layout */}
        <div className="md:hidden space-y-3">
          {/* Row 1: Logo + Right actions */}
          <div className="flex items-center justify-between gap-2">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer flex-shrink-0"
              onClick={() => onNavigate?.('home')}
            >
              <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                TB
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Language Selector */}
              <LanguageSelector />

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Account - Show dropdown if logged in, button if not */}
              {user ? (
                <UserAccountDropdown
                  user={user}
                  onLogout={onLogout!}
                  onNavigate={onNavigate}
                />
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                  onClick={() => onNavigate?.('auth')}
                >
                  <User className="h-4 w-4" />
                </Button>
              )}

              {/* Mini Cart */}
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2"
                onClick={onCartClick}
              >
                <ShoppingCart className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </Badge>
                )}
              </Button>

              {/* Mobile menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  {/* Mobile User Account */}
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        className="justify-start w-full"
                        onClick={() => onNavigate?.('account-dashboard')}
                      >
                        <User className="h-4 w-4 mr-2" />
                        {t("header.accountDashboard")}
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start w-full"
                        onClick={() => onNavigate?.('order-history')}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        {t("header.orderHistory")}
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start w-full text-red-600"
                        onClick={onLogout}
                      >
                        <User className="h-4 w-4 mr-2" />
                        {t("header.signOut")}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => onNavigate?.('auth')}
                    >
                      <User className="h-4 w-4 mr-2" />
                      {t("header.account")}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={onWishlistClick}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    {t("header.wishlist")}
                    {wishlistItemCount > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {wishlistItemCount}
                      </Badge>
                    )}
                  </Button>
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3">{t("header.categories")}</h3>
                    {navigationCategories.map((category) => (
                      <div key={category.id} className="mb-2">
                        <Button
                          variant="ghost"
                          className="justify-start w-full"
                          onClick={() => handleCategoryClick(category.slug)}
                        >
                          {category.name} ({category.productCount})
                        </Button>
                        {category.children.length > 0 && (
                          <div className="ml-4">
                            {category.children.map((sub) => (
                              <Button
                                key={sub.id}
                                variant="ghost"
                                size="sm"
                                className="justify-start w-full text-xs"
                                onClick={() => handleSubcategoryClick(category.slug, sub.slug)}
                              >
                                {sub.name} ({sub.productCount})
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Row 2: Search bar */}
          <div className="w-full">
            <SearchBar
              onSearch={onSearchClick}
              placeholder={t("header.search")}
              className="w-full"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-8 mt-4 pt-4 border-t">
          {navigationCategories.map((category) => (
            <DropdownMenu key={category.id}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-foreground hover:text-primary flex items-center gap-1"
                >
                  <Package className="h-4 w-4" />
                  {category.name}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleCategoryClick(category.slug)}>
                  {t("nav.viewAll")} {category.name}
                </DropdownMenuItem>
                {category.children.map((sub) => (
                  <DropdownMenuItem
                    key={sub.id}
                    onClick={() => handleSubcategoryClick(category.slug, sub.slug)}
                  >
                    {sub.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}

          <Button
            variant="ghost"
            className="text-foreground hover:text-primary"
            onClick={() => onNavigate?.('deals')}
          >
            {t("header.deals")}
          </Button>
          <Button
            variant="ghost"
            className="text-foreground hover:text-primary"
            onClick={() => onNavigate?.('new-arrivals')}
          >
            {t("header.newArrivals")}
          </Button>
          <Button
            variant="ghost"
            className="text-foreground hover:text-primary"
            onClick={() => onNavigate?.('about')}
          >
            About
          </Button>
          <Button
            variant="ghost"
            className="text-foreground hover:text-primary"
            onClick={() => onNavigate?.('faq')}
          >
            FAQ
          </Button>
          <Button
            variant="ghost"
            className="text-foreground hover:text-primary"
            onClick={() => onNavigate?.('contact')}
          >
            Contact
          </Button>
        </nav>
      </div>
    </header>
  );
}
