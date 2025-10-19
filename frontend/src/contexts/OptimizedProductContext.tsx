import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useMemo } from 'react';
import { OptimizedProductService } from '../services/optimizedProductService';
import { Product, Category, Brand, ProductFilters, FilterOptions } from '../services/product';
import { toast } from 'sonner';

interface OptimizedProductContextType {
  // State
  products: Product[];
  featuredProducts: Product[];
  categories: Category[];
  brands: Brand[];
  filterOptions: FilterOptions | null;
  loading: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  
  // Actions
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  searchProducts: (query: string, filters?: ProductFilters) => Promise<void>;
  getProduct: (slug: string) => Promise<Product | null>;
  clearProducts: () => void;
  setCurrentPage: (page: number) => void;
  
  // Cache management
  clearCache: () => void;
  preloadData: () => Promise<void>;
}

const OptimizedProductContext = createContext<OptimizedProductContextType | undefined>(undefined);

export const useOptimizedProducts = () => {
  const context = useContext(OptimizedProductContext);
  if (!context) {
    throw new Error('useOptimizedProducts must be used within an OptimizedProductProvider');
  }
  return context;
};

interface OptimizedProductProviderProps {
  children: ReactNode;
}

export const OptimizedProductProvider: React.FC<OptimizedProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Memoized error handler
  const handleError = useCallback((error: any, defaultMessage: string) => {
    console.error(error);
    const errorMessage = error.message || defaultMessage;
    setError(errorMessage);
    toast.error(errorMessage);
  }, []);

  // Optimized fetch products with debouncing
  const fetchProducts = useCallback(async (filters: ProductFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await OptimizedProductService.getProducts({
        ...filters,
        page: filters.page || currentPage,
        per_page: filters.per_page || 12
      });

      if (response.success && response.data) {
        setProducts(response.data);
        
        if (response.pagination) {
          setCurrentPage(response.pagination.current_page);
          setTotalPages(response.pagination.last_page);
          setTotalProducts(response.pagination.total);
        }
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
    } catch (error: any) {
      handleError(error, 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, handleError]);

  // Optimized fetch featured products
  const fetchFeaturedProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await OptimizedProductService.getFeaturedProducts();
      
      if (response.success && response.data) {
        setFeaturedProducts(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch featured products');
      }
    } catch (error: any) {
      handleError(error, 'Failed to fetch featured products');
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Load categories (cached)
  const loadCategories = useCallback(async () => {
    try {
      const response = await OptimizedProductService.getCategories();
      
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error: any) {
      console.warn('Failed to load categories:', error);
    }
  }, []);

  // Load brands (cached)
  const loadBrands = useCallback(async () => {
    try {
      const response = await OptimizedProductService.getBrands();
      
      if (response.success && response.data) {
        setBrands(response.data);
      }
    } catch (error: any) {
      console.warn('Failed to load brands:', error);
    }
  }, []);

  // Load filter options (cached)
  const loadFilterOptions = useCallback(async () => {
    try {
      const response = await OptimizedProductService.getFilterOptions();
      
      if (response.success && response.data) {
        setFilterOptions(response.data);
      }
    } catch (error: any) {
      console.warn('Failed to load filter options:', error);
    }
  }, []);

  // Optimized search products
  const searchProducts = useCallback(async (query: string, filters: ProductFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await OptimizedProductService.searchProducts(query, {
        ...filters,
        page: filters.page || currentPage,
        per_page: filters.per_page || 12
      });

      if (response.success && response.data) {
        setProducts(response.data);
        
        if (response.pagination) {
          setCurrentPage(response.pagination.current_page);
          setTotalPages(response.pagination.last_page);
          setTotalProducts(response.pagination.total);
        }
      } else {
        throw new Error(response.message || 'Failed to search products');
      }
    } catch (error: any) {
      handleError(error, 'Failed to search products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, handleError]);

  // Get single product (cached)
  const getProduct = useCallback(async (slug: string): Promise<Product | null> => {
    try {
      const response = await OptimizedProductService.getProduct(slug);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Product not found');
      }
    } catch (error: any) {
      handleError(error, 'Failed to fetch product');
      return null;
    }
  }, [handleError]);

  // Clear products
  const clearProducts = useCallback(() => {
    setProducts([]);
    setCurrentPage(1);
    setTotalPages(1);
    setTotalProducts(0);
    setError(null);
  }, []);

  // Handle page change
  const handleSetCurrentPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    OptimizedProductService.clearCache();
    toast.success('Cache cleared');
  }, []);

  // Preload essential data
  const preloadData = useCallback(async () => {
    try {
      await OptimizedProductService.preloadEssentialData();
      // Load the data into state
      await Promise.all([
        loadCategories(),
        loadBrands(),
        loadFilterOptions()
      ]);
    } catch (error) {
      console.warn('Failed to preload data:', error);
    }
  }, [loadCategories, loadBrands, loadFilterOptions]);

  // Preload data on mount
  useEffect(() => {
    preloadData();
  }, [preloadData]);

  // Memoized context value
  const value = useMemo(() => ({
    // State
    products,
    featuredProducts,
    categories,
    brands,
    filterOptions,
    loading,
    error,
    
    // Pagination
    currentPage,
    totalPages,
    totalProducts,
    
    // Actions
    fetchProducts,
    fetchFeaturedProducts,
    searchProducts,
    getProduct,
    clearProducts,
    setCurrentPage: handleSetCurrentPage,
    
    // Cache management
    clearCache,
    preloadData,
  }), [
    products,
    featuredProducts,
    categories,
    brands,
    filterOptions,
    loading,
    error,
    currentPage,
    totalPages,
    totalProducts,
    fetchProducts,
    fetchFeaturedProducts,
    searchProducts,
    getProduct,
    clearProducts,
    handleSetCurrentPage,
    clearCache,
    preloadData,
  ]);

  return (
    <OptimizedProductContext.Provider value={value}>
      {children}
    </OptimizedProductContext.Provider>
  );
};

export default OptimizedProductProvider;
