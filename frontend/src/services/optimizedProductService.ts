import { apiRequest, ApiResponse } from './api';
import { apiCache, CACHE_TTL } from './cache';
import { Product, Category, Brand, ProductFilters, FilterOptions, ProductListResponse } from './product';

// Optimized Product Service with caching and request deduplication
export class OptimizedProductService {
  private static pendingRequests = new Map<string, Promise<any>>();

  // Get all products with caching and deduplication
  static async getProducts(filters: ProductFilters = {}): Promise<ProductListResponse> {
    const cacheKey = apiCache.generateKey('products', filters);
    
    // Check cache first
    const cached = apiCache.get<ProductListResponse>(cacheKey);
    if (cached) {
      console.log('📦 Products served from cache');
      return cached;
    }

    // Check if request is already pending
    if (this.pendingRequests.has(cacheKey)) {
      console.log('⏳ Products request already pending, waiting...');
      return this.pendingRequests.get(cacheKey)!;
    }

    // Create new request
    const requestPromise = this.fetchProductsFromAPI(filters);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      const response = await requestPromise;
      
      // Cache successful response
      if (response.success) {
        apiCache.set(cacheKey, response, CACHE_TTL.PRODUCTS);
      }
      
      return response;
    } finally {
      // Remove from pending requests
      this.pendingRequests.delete(cacheKey);
    }
  }

  private static async fetchProductsFromAPI(filters: ProductFilters): Promise<ProductListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'brands' && Array.isArray(value)) {
          value.forEach(brandId => params.append('brands', brandId.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    
    return await apiRequest<ProductListResponse>('GET', endpoint);
  }

  // Get featured products with caching
  static async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    const cacheKey = 'featured-products';
    
    const cached = apiCache.get<ApiResponse<Product[]>>(cacheKey);
    if (cached) {
      console.log('⭐ Featured products served from cache');
      return cached;
    }

    const response = await apiRequest<Product[]>('GET', '/products/featured');
    
    if (response.success) {
      apiCache.set(cacheKey, response, CACHE_TTL.FEATURED);
    }
    
    return response;
  }

  // Search products with caching
  static async searchProducts(query: string, filters: ProductFilters = {}): Promise<ProductListResponse> {
    const searchFilters = { ...filters, q: query };
    const cacheKey = apiCache.generateKey('search', searchFilters);
    
    const cached = apiCache.get<ProductListResponse>(cacheKey);
    if (cached) {
      console.log('🔍 Search results served from cache');
      return cached;
    }

    const params = new URLSearchParams({ q: query });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && key !== 'q') {
        if (key === 'brands' && Array.isArray(value)) {
          value.forEach(brandId => params.append('brands', brandId.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const response = await apiRequest<ProductListResponse>('GET', `/products/search?${params.toString()}`);
    
    if (response.success) {
      apiCache.set(cacheKey, response, CACHE_TTL.PRODUCTS);
    }
    
    return response;
  }

  // Get single product with caching
  static async getProduct(slug: string): Promise<ApiResponse<Product>> {
    const cacheKey = `product:${slug}`;
    
    const cached = apiCache.get<ApiResponse<Product>>(cacheKey);
    if (cached) {
      console.log('📄 Product served from cache');
      return cached;
    }

    const response = await apiRequest<Product>('GET', `/products/${slug}`);
    
    if (response.success) {
      apiCache.set(cacheKey, response, CACHE_TTL.PRODUCTS);
    }
    
    return response;
  }

  // Get filter options with caching
  static async getFilterOptions(): Promise<ApiResponse<FilterOptions>> {
    const cacheKey = 'filter-options';
    
    const cached = apiCache.get<ApiResponse<FilterOptions>>(cacheKey);
    if (cached) {
      console.log('🔧 Filter options served from cache');
      return cached;
    }

    const response = await apiRequest<FilterOptions>('GET', '/products/filter-options');
    
    if (response.success) {
      apiCache.set(cacheKey, response, CACHE_TTL.FILTER_OPTIONS);
    }
    
    return response;
  }

  // Get categories with caching
  static async getCategories(): Promise<ApiResponse<Category[]>> {
    const cacheKey = 'categories';
    
    const cached = apiCache.get<ApiResponse<Category[]>>(cacheKey);
    if (cached) {
      console.log('📂 Categories served from cache');
      return cached;
    }

    const response = await apiRequest<Category[]>('GET', '/categories');
    
    if (response.success) {
      apiCache.set(cacheKey, response, CACHE_TTL.CATEGORIES);
    }
    
    return response;
  }

  // Get category by slug with caching
  static async getCategory(slug: string): Promise<ApiResponse<Category>> {
    const cacheKey = `category:${slug}`;
    
    const cached = apiCache.get<ApiResponse<Category>>(cacheKey);
    if (cached) {
      console.log('📂 Category served from cache');
      return cached;
    }

    const response = await apiRequest<Category>('GET', `/categories/${slug}`);
    
    if (response.success) {
      apiCache.set(cacheKey, response, CACHE_TTL.CATEGORIES);
    }
    
    return response;
  }

  // Get subcategories with caching
  static async getSubcategories(categoryId?: number): Promise<ApiResponse<any[]>> {
    const cacheKey = categoryId ? `subcategories:${categoryId}` : 'subcategories';
    
    const cached = apiCache.get<ApiResponse<any[]>>(cacheKey);
    if (cached) {
      console.log('📁 Subcategories served from cache');
      return cached;
    }

    const endpoint = categoryId ? `/subcategories?category_id=${categoryId}` : '/subcategories';
    const response = await apiRequest<any[]>('GET', endpoint);
    
    if (response.success) {
      apiCache.set(cacheKey, response, CACHE_TTL.CATEGORIES);
    }
    
    return response;
  }

  // Get brands with caching
  static async getBrands(): Promise<ApiResponse<Brand[]>> {
    const cacheKey = 'brands';
    
    const cached = apiCache.get<ApiResponse<Brand[]>>(cacheKey);
    if (cached) {
      console.log('🏷️ Brands served from cache');
      return cached;
    }

    const response = await apiRequest<Brand[]>('GET', '/brands');
    
    if (response.success) {
      apiCache.set(cacheKey, response, CACHE_TTL.BRANDS);
    }
    
    return response;
  }

  // Get brand by slug with caching
  static async getBrand(slug: string): Promise<ApiResponse<Brand>> {
    const cacheKey = `brand:${slug}`;
    
    const cached = apiCache.get<ApiResponse<Brand>>(cacheKey);
    if (cached) {
      console.log('🏷️ Brand served from cache');
      return cached;
    }

    const response = await apiRequest<Brand>('GET', `/brands/${slug}`);
    
    if (response.success) {
      apiCache.set(cacheKey, response, CACHE_TTL.BRANDS);
    }
    
    return response;
  }

  // Clear cache for specific patterns
  static clearCache(pattern?: string): void {
    if (pattern) {
      // Clear specific cache entries
      const keys = Array.from(apiCache['cache'].keys());
      keys.forEach(key => {
        if (key.includes(pattern)) {
          apiCache.delete(key);
        }
      });
    } else {
      // Clear all cache
      apiCache.clear();
    }
  }

  // Preload essential data
  static async preloadEssentialData(): Promise<void> {
    const promises = [
      this.getCategories(),
      this.getBrands(),
      this.getFilterOptions()
    ];

    try {
      await Promise.all(promises);
      console.log('🚀 Essential data preloaded');
    } catch (error) {
      console.warn('⚠️ Some essential data failed to preload:', error);
    }
  }
}
