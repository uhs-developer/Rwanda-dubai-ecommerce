import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Search, Home, ArrowLeft, Package, Headphones, Wrench } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface NotFoundPageProps {
  onNavigateHome?: () => void;
  onNavigateCategory?: (categoryId: string) => void;
  onSearch?: (query: string) => void;
}

export function NotFoundPage({ onNavigateHome, onNavigateCategory, onSearch }: NotFoundPageProps) {
  const navigate = useNavigate();
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query?.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onSearch?.(query.trim());
    }
  };

  const handleNavigateHome = () => {
    navigate('/');
    onNavigateHome?.();
  };

  const handleNavigateCategory = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
    onNavigateCategory?.(categoryId);
  };

  const popularCategories = [
    { id: "electronics", name: "Electronics", icon: Package },
    { id: "auto-parts", name: "Auto Parts", icon: Wrench },
    { id: "home-appliances", name: "Home Appliances", icon: Home },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-muted-foreground/20 mb-4">404</div>
          <div className="w-48 h-48 mx-auto mb-6">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400"
              alt="Page not found"
              className="w-full h-full object-cover rounded-lg opacity-50"
            />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Oops! Page Not Found</h1>
          <p className="text-lg text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved. 
            But don't worry, we've got plenty of great products to explore!
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Search for Products</h3>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="search"
                  placeholder="Try searching for electronics, auto parts, tools..."
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" onClick={handleNavigateHome}>
                <Home className="h-4 w-4 mr-2" />
                Go to Homepage
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="font-semibold mb-4">Browse Popular Categories</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {popularCategories.map((category) => (
                <Card 
                  key={category.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleNavigateCategory(category.id)}
                >
                  <CardContent className="p-4 text-center">
                    <category.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-medium">{category.name}</h4>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-muted/50 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Still need help?</h3>
            <p className="text-muted-foreground mb-4">
              Our customer support team is available 24/7 to assist you.
            </p>
            <Button variant="outline">
              <Headphones className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}