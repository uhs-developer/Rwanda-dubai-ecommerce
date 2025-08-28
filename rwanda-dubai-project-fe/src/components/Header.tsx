import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  Heart, 
  ChevronDown,
  Package,
  Headphones,
  Wrench,
  Home
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

interface HeaderProps {
  cartItemCount?: number;
  wishlistItemCount?: number;
  onCartClick?: () => void;
  onWishlistClick?: () => void;
  onSearchClick?: (query: string) => void;
  onCategoryClick?: (categoryId: string) => void;
  onNavigate?: (view: string, data?: any) => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
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
  user,
  onLogout
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearchClick) {
      onSearchClick(searchQuery);
    }
  };

  const navigationItems = [
    {
      label: "Electronics",
      id: "electronics",
      icon: Package,
      subcategories: ["Smartphones", "Laptops", "Tablets", "Audio", "Cameras", "Gaming"]
    },
    {
      label: "Auto Parts", 
      id: "auto-parts",
      icon: Wrench,
      subcategories: ["Toyota", "Honda", "Hyundai", "BMW", "Mercedes", "Nissan"]
    },
    {
      label: "Home Appliances",
      id: "home-appliances", 
      icon: Home,
      subcategories: ["Kitchen", "Laundry", "Air Conditioning", "Small Appliances"]
    },
    {
      label: "Tools & Equipment",
      id: "tools",
      icon: Wrench,
      subcategories: ["Hand Tools", "Power Tools", "Measuring", "Safety Equipment"]
    }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top banner */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm">
            Free shipping from Dubai to Rwanda on orders over $500
          </p>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate?.('home')}
          >
            <h1 className="text-2xl font-bold text-primary">TechBridge</h1>
            <span className="text-sm text-muted-foreground hidden sm:inline">Dubai → Rwanda</span>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <SearchBar
              onSearch={onSearchClick}
              placeholder="Search for electronics, auto parts, tools..."
              className="w-full"
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
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
                Account
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
              Wishlist
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
              <span className="hidden sm:inline">Cart</span>
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
                <Button variant="ghost" size="sm" className="sm:hidden">
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
                        Account Dashboard
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="justify-start w-full"
                        onClick={() => onNavigate?.('order-history')}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Order History
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="justify-start w-full text-red-600"
                        onClick={onLogout}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="ghost" 
                      className="justify-start"
                      onClick={() => onNavigate?.('auth')}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    className="justify-start"
                    onClick={onWishlistClick}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                    {wishlistItemCount > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {wishlistItemCount}
                      </Badge>
                    )}
                  </Button>
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3">Categories</h3>
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant="ghost"
                        className="justify-start w-full mb-1"
                        onClick={() => onCategoryClick?.(category.id)}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-8 mt-4 pt-4 border-t">
          {navigationItems.map((item) => (
            <DropdownMenu key={item.id}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-foreground hover:text-primary flex items-center gap-1"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onCategoryClick?.(item.id)}>
                  View All {item.label}
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
            className="text-foreground hover:text-primary"
            onClick={() => onNavigate?.('deals')}
          >
            Deals
          </Button>
          <Button 
            variant="ghost" 
            className="text-foreground hover:text-primary"
            onClick={() => onNavigate?.('new-arrivals')}
          >
            New Arrivals
          </Button>
        </nav>
      </div>
    </header>
  );
}