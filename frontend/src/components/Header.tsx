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
  Wrench,
  Home,
  Shield
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { categories } from "../data/products";
import { UserAccountDropdown } from "./UserAccountDropdown";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ui/ThemeToggle";
import { LanguageSelector } from "./ui/LanguageSelector";
import { useTranslation } from "../../node_modules/react-i18next";
import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  cartItemCount?: number;
  wishlistItemCount?: number;
  onCartClick?: () => void;
  onWishlistClick?: () => void;
  onSearchClick?: (query: string) => void;
  onCategoryClick?: (categoryId: string) => void;
  onNavigate?: (view: string, data?: any) => void;
  onLogout?: () => void;
}

export function Header({
  cartItemCount = 0,
  wishlistItemCount = 0,
  onCartClick,
  onWishlistClick,
  onSearchClick,
  onCategoryClick,
  onNavigate,
  onLogout
}: HeaderProps) {
  const { t } = useTranslation();
  const { user: authUser, isEditor, isAdmin, isSuperAdmin, logout } = useAuth();
  
  // Use auth context user
  const currentUser = authUser;
  const isUserEditor = isEditor();
  const isUserAdmin = isAdmin();
  const isUserSuperAdmin = isSuperAdmin();

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigationItems = [
    {
      label: t("nav.electronics"),
      id: "electronics",
      icon: Package,
      subcategories: ["Smartphones", "Laptops", "Tablets", "Audio", "Cameras", "Gaming"]
    },
    {
      label: t("nav.autoParts"),
      id: "auto-parts",
      icon: Wrench,
      subcategories: ["Toyota", "Honda", "Hyundai", "BMW", "Mercedes", "Nissan"]
    },
    {
      label: t("nav.homeAppliances"),
      id: "home-appliances",
      icon: Home,
      subcategories: ["Kitchen", "Laundry", "Air Conditioning", "Small Appliances"]
    },
    {
      label: t("nav.tools"),
      id: "tools",
      icon: Wrench,
      subcategories: ["Hand Tools", "Power Tools", "Measuring", "Safety Equipment"]
    }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top banner */}
      <div className="bg-primary text-primary-foreground py-1 sm:py-2">
        <div className="container mx-auto px-2 sm:px-4">
          <p className="text-center text-xs sm:text-sm truncate">
            Fast shipping from Dubai to Rwanda - RWF 35 flat rate
          </p>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        {/* Mobile/Tablet Layout */}
        <div className="flex lg:hidden items-center justify-between gap-3 sm:gap-4">
          {/* Mobile Logo */}
          <div 
            className="flex items-center gap-1 cursor-pointer flex-shrink-0 min-w-0"
            onClick={() => onNavigate?.('home')}
          >
            <h1 className="text-xs sm:text-sm md:text-base font-bold text-primary truncate">TechBridge</h1>
            <span className="text-xs text-muted-foreground hidden sm:inline">Dubai → Rwanda</span>
          </div>

          {/* Mobile Right Actions */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            {/* Mobile Cart */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-1 sm:p-1.5"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-3.5 w-3.5 sm:h-4 sm:w-4 p-0 flex items-center justify-center text-xs"
                >
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Wishlist */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-1 sm:p-1.5"
              onClick={onWishlistClick}
            >
              <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {wishlistItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-3.5 w-3.5 sm:h-4 sm:w-4 p-0 flex items-center justify-center text-xs"
                >
                  {wishlistItemCount > 9 ? "9+" : wishlistItemCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1 sm:p-1.5">
                  <Menu className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96 overflow-y-auto">
                <div className="flex flex-col gap-4 mt-8 h-full">
                  {/* Mobile Search */}
                  <div className="mb-4">
                    <SearchBar
                      onSearch={onSearchClick}
                      placeholder={t("header.search")}
                      className="w-full"
                    />
                  </div>

                  {/* Mobile User Account */}
                  {currentUser ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                          {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate">{currentUser.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{currentUser.email}</div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        className="justify-start w-full"
                        onClick={() => onNavigate?.('account-dashboard')}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Customer Dashboard
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start w-full"
                        onClick={() => onNavigate?.('order-history')}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        {t("header.orderHistory")}
                      </Button>
                      
                      {/* Editor Dashboard - Only for editors */}
                      {isUserEditor && (
                        <Button
                          variant="ghost"
                          className="justify-start w-full"
                          onClick={() => onNavigate?.('editor-dashboard')}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Editor Dashboard
                        </Button>
                      )}
                      
                      {/* Admin Dashboard - Only for admins and managers (not editors) */}
                      {isUserAdmin && !isUserEditor && (
                        <Button
                          variant="ghost"
                          className="justify-start w-full"
                          onClick={() => onNavigate?.('admin-dashboard')}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Button>
                      )}
                      
                      {/* Super Admin Dashboard - Only for super admins */}
                      {isUserSuperAdmin && (
                        <Button
                          variant="ghost"
                          className="justify-start w-full"
                          onClick={() => onNavigate?.('super-admin')}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Super Admin Dashboard
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        className="justify-start w-full text-red-600"
                        onClick={handleLogout}
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
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3">{t("header.categories")}</h3>
                    <div className="space-y-1">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant="ghost"
                          className="justify-start w-full"
                        onClick={() => onCategoryClick?.(category.id)}
                      >
                        {category.name}
                      </Button>
                    ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between gap-2 xl:gap-4">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer flex-shrink-0"
            onClick={() => onNavigate?.('home')}
          >
            <h1 className="text-2xl font-bold text-primary">TechBridge</h1>
            <span className="text-sm text-muted-foreground">Dubai → Rwanda</span>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-xl xl:max-w-2xl mx-2 xl:mx-4">
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
            {currentUser ? (
              <UserAccountDropdown
                user={currentUser}
                onLogout={handleLogout}
                onNavigate={onNavigate}
              />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate?.('auth')}
              >
                <User className="h-4 w-4 mr-2" />
                <span className="hidden xl:inline">{t("header.account")}</span>
              </Button>
            )}
            
            {/* Mini Wishlist */}
            <Button
              variant="ghost"
              size="sm"
              className="relative hidden xl:flex"
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
              <span className="hidden xl:inline">{t("header.cart")}</span>
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

        {/* Navigation - Mobile */}
        <nav className="lg:hidden mt-4 pt-4 border-t">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-3 pb-2 min-w-max">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  className="text-foreground hover:text-primary flex items-center gap-1 text-sm whitespace-nowrap flex-shrink-0"
                  onClick={() => onCategoryClick?.(item.id)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
              
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:text-primary text-sm whitespace-nowrap flex-shrink-0"
                onClick={() => onNavigate?.('deals')}
              >
                Deals
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:text-primary text-sm whitespace-nowrap flex-shrink-0"
                onClick={() => onNavigate?.('new-arrivals')}
              >
                New
              </Button>
            </div>
          </div>
        </nav>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-8 mt-4 pt-4 border-t">
          {navigationItems.map((item) => (
            <DropdownMenu key={item.id}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-foreground hover:text-primary flex items-center gap-1 text-sm xl:text-base"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden xl:inline">{item.label}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onCategoryClick?.(item.id)}>
                  {t("nav.viewAll")} {item.label}
                </DropdownMenuItem>
                {item.subcategories.map((sub) => (
                  <DropdownMenuItem 
                    key={sub}
                    onClick={() => onNavigate?.('category', { category: item.id, subcategory: sub })}
                  >
                    {sub}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
          
          <Button
            variant="ghost"
            className="text-foreground hover:text-primary text-sm xl:text-base"
            onClick={() => onNavigate?.('deals')}
          >
            <span className="hidden xl:inline">{t("header.deals")}</span>
            <span className="xl:hidden">Deals</span>
          </Button>
          <Button
            variant="ghost"
            className="text-foreground hover:text-primary text-sm xl:text-base"
            onClick={() => onNavigate?.('new-arrivals')}
          >
            <span className="hidden xl:inline">{t("header.newArrivals")}</span>
            <span className="xl:hidden">New</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}