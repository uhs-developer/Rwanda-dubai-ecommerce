import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useProducts } from '../contexts/ProductContext';
import { ProductService, Product } from '../services/product';
import { getProductImageUrl, formatPrice } from '../services/product';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ onSearch, placeholder = "Search products...", className = "" }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('rwanda-dubai-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updated = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 5); // Keep only 5 recent searches
    
    setRecentSearches(updated);
    localStorage.setItem('rwanda-dubai-recent-searches', JSON.stringify(updated));
  };

  // Debounced search for suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim() && query.length >= 2) {
        setLoading(true);
        try {
          const response = await ProductService.searchProducts(query, { per_page: 5 });
          if (response.success && response.data) {
            setSuggestions(response.data);
          }
        } catch (error: any) {
          console.error('Search suggestions error:', error);
          setSuggestions([]);
          
          // Show user-friendly error message for timeouts
          if (error.error === 'TIMEOUT_ERROR') {
            console.log('Search is taking longer than expected, please wait...');
          }
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setLoading(false);
      }
    }, 800); // Increased debounce delay to 800ms to reduce API calls

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query);
    }
  };

  const performSearch = (searchQuery: string) => {
    saveRecentSearch(searchQuery);
    setIsOpen(false);
    setQuery('');
    onSearch?.(searchQuery);
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
  };

  const handleSuggestionClick = (product: Product) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/product/${product.slug}`);
  };

  const handleRecentSearchClick = (recentQuery: string) => {
    setQuery(recentQuery);
    performSearch(recentQuery);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('rwanda-dubai-recent-searches');
  };

  const removeRecentSearch = (searchToRemove: string) => {
    const updated = recentSearches.filter(s => s !== searchToRemove);
    setRecentSearches(updated);
    localStorage.setItem('rwanda-dubai-recent-searches', JSON.stringify(updated));
  };

  return (
    <div ref={searchRef} className={`relative w-full max-w-lg ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Search Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {/* Loading State */}
            {loading && (
              <div className="p-4 text-center">
                <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Searching...</p>
              </div>
            )}

            {/* Search Suggestions */}
            {!loading && suggestions.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs font-medium text-muted-foreground border-b">
                  Products
                </div>
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSuggestionClick(product)}
                    className="w-full p-3 text-left hover:bg-muted transition-colors flex items-center gap-3"
                  >
                    <img
                      src={getProductImageUrl(product)}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/40x40?text=?';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-primary">
                          {formatPrice(product.price)}
                        </p>
                        {product.original_price && product.original_price > product.price && (
                          <p className="text-xs text-muted-foreground line-through">
                            {formatPrice(product.original_price)}
                          </p>
                        )}
                        {product.is_on_sale && (
                          <Badge variant="destructive" className="text-xs">
                            Sale
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {!loading && query.length === 0 && recentSearches.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs font-medium text-muted-foreground border-b flex items-center justify-between">
                  Recent Searches
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-primary hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                {recentSearches.map((recentQuery, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 hover:bg-muted transition-colors"
                  >
                    <button
                      onClick={() => handleRecentSearchClick(recentQuery)}
                      className="flex-1 text-left text-sm"
                    >
                      <Search className="inline h-3 w-3 mr-2 text-muted-foreground" />
                      {recentQuery}
                    </button>
                    <button
                      onClick={() => removeRecentSearch(recentQuery)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && query.length >= 2 && suggestions.length === 0 && (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  No products found for "{query}"
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => performSearch(query)}
                  className="mt-2"
                >
                  Search anyway
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!loading && query.length === 0 && recentSearches.length === 0 && (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Start typing to search for products
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
