import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ProductListingPageAPI } from './ProductListingPageAPI';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Search, ArrowLeft } from 'lucide-react';

interface SearchResultsPageProps {
  onAddToCart?: (product: any) => void;
  onAddToWishlist?: (product: any) => void;
  onProductClick?: (product: any) => void;
}

export function SearchResultsPage({
  onAddToCart,
  onAddToWishlist,
  onProductClick
}: SearchResultsPageProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const query = searchParams.get('q') || '';

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem('rwanda-dubai-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleRecentSearchClick = (searchQuery: string) => {
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Search Products</h1>
          <p className="text-muted-foreground mb-6">
            Enter a search term to find products
          </p>
          
          {recentSearches.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold mb-4">Recent Searches</h2>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((recentQuery, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80"
                      onClick={() => handleRecentSearchClick(recentQuery)}
                    >
                      {recentQuery}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          <Button onClick={() => navigate('/')} className="mt-6">
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ProductListingPageAPI
        searchQuery={query}
        onAddToCart={onAddToCart}
        onAddToWishlist={onAddToWishlist}
        onProductClick={onProductClick}
        onBack={handleBack}
      />
    </div>
  );
}

