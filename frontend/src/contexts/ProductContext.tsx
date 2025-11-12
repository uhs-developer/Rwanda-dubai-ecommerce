import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ProductService, Product, Category, Brand, ProductFilters, FilterOptions } from '../services/product';
import { toast } from 'sonner';

interface ProductContextType {
  // State
  products: Product[];
  featuredProducts: Product[];
  categories: Category[];
  brands: Brand[];
  filterOptions: FilterOptions | null;
  loading: boolean;
  slowLoading: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  
  // Actions
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchBrands: () => Promise<void>;
  fetchFilterOptions: () => Promise<void>;
  searchProducts: (query: string, filters?: ProductFilters) => Promise<void>;
  getProduct: (slug: string) => Promise<Product | null>;
  clearProducts: () => void;
  setCurrentPage: (page: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(false);
  const [slowLoading, setSlowLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const handleError = (error: any, defaultMessage: string) => {
    console.error(error);
    const errorMessage = error.message || defaultMessage;
    setError(errorMessage);
    toast.error(errorMessage);
  };

  const fetchProducts = useCallback(async (filters: ProductFilters = {}) => {
    let slowLoadingTimer: NodeJS.Timeout;
    
    try {
      setLoading(true);
      setSlowLoading(false);
      setError(null);
      
      // Show slow loading message after 5 seconds
      slowLoadingTimer = setTimeout(() => {
        setSlowLoading(true);
        toast.info('Loading is taking longer than expected. Please wait...');
      }, 5000);
      
      const response = await ProductService.getProducts({
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
      clearTimeout(slowLoadingTimer);
      setLoading(false);
      setSlowLoading(false);
    }
  }, [currentPage]);

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ProductService.getFeaturedProducts();
      
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
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await ProductService.getCategories();
      
      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch categories');
      }
    } catch (error: any) {
      handleError(error, 'Failed to fetch categories');
      setCategories([]);
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    try {
      const response = await ProductService.getBrands();
      
      if (response.success && response.data) {
        setBrands(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch brands');
      }
    } catch (error: any) {
      handleError(error, 'Failed to fetch brands');
      setBrands([]);
    }
  }, []);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const response = await ProductService.getFilterOptions();
      
      if (response.success && response.data) {
        setFilterOptions(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch filter options');
      }
    } catch (error: any) {
      handleError(error, 'Failed to fetch filter options');
      setFilterOptions(null);
    }
  }, []);

  const searchProducts = useCallback(async (query: string, filters: ProductFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ProductService.searchProducts(query, {
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
  }, [currentPage]);

  const getProduct = useCallback(async (slug: string): Promise<Product | null> => {
    try {
      const response = await ProductService.getProduct(slug);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Product not found');
      }
    } catch (error: any) {
      handleError(error, 'Failed to fetch product');
      return null;
    }
  }, []);

  const clearProducts = useCallback(() => {
    setProducts([]);
    setCurrentPage(1);
    setTotalPages(1);
    setTotalProducts(0);
    setError(null);
  }, []);

  const handleSetCurrentPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const value: ProductContextType = {
    // State
    products,
    featuredProducts,
    categories,
    brands,
    filterOptions,
    loading,
    slowLoading,
    error,
    
    // Pagination
    currentPage,
    totalPages,
    totalProducts,
    
    // Actions
    fetchProducts,
    fetchFeaturedProducts,
    fetchCategories,
    fetchBrands,
    fetchFilterOptions,
    searchProducts,
    getProduct,
    clearProducts,
    setCurrentPage: handleSetCurrentPage,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
