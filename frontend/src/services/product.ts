import { apiRequest, ApiResponse } from './api';

// Product Types (matching backend API responses) - Updated with additional fields
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  promotional_price?: number;
  effective_price: number;
  original_price?: number;
  discount_percentage?: number;
  promotional_discount_percentage?: number;
  is_on_sale: boolean;
  has_promotional_price: boolean;
  primary_image?: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  subcategory: {
    id: number;
    name: string;
    slug: string;
  };
  brand: {
    id: number;
    name: string;
    slug: string;
  };
  average_rating: number;
  total_reviews: number;
  in_stock: boolean;
  stock_status: string;
  is_featured: boolean;
  is_active?: boolean;
  is_digital?: boolean;
  created_at?: string;
  updated_at?: string;
  short_description?: string;
  description?: string;
  sku?: string;
  stock_quantity?: number;
  min_stock_level?: number;
  weight?: number;
  dimensions?: string;
  cost_price?: number;
  meta_title?: string;
  meta_description?: string;
  specifications?: Record<string, string>;
  images?: ProductImage[];
  tags?: string[];
  features?: string[];
}

export interface ProductImage {
  id: number;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  category_id: number;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  is_active: boolean;
}

export interface ProductFilters {
  category_id?: number;
  subcategory_id?: number;
  brands?: number[];
  brand_id?: number; // Keep for backward compatibility
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  in_stock?: boolean;
  is_featured?: boolean;
  include_inactive?: boolean; // Include inactive products for editors
  search?: string;
  sort_by?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'name';
  page?: number;
  per_page?: number;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface ProductListResponse {
  success: boolean;
  message: string;
  data: Product[];
  pagination?: PaginationMeta;
}

export interface FilterOptions {
  brands: Brand[];
  categories: Category[];
  subcategories: Subcategory[];
  price_ranges: {
    min: number;
    max: number;
  };
}

// Product API Service
export class ProductService {
  // Get all products with filtering and pagination
  static async getProducts(filters: ProductFilters = {}): Promise<ProductListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'brands' && Array.isArray(value)) {
          // Handle brands array properly
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

  // Get featured products
  static async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    return await apiRequest<Product[]>('GET', '/products/featured');
  }

  // Search products
  static async searchProducts(query: string, filters: ProductFilters = {}): Promise<ProductListResponse> {
    const params = new URLSearchParams({ q: query });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && key !== 'q') {
        if (key === 'brands' && Array.isArray(value)) {
          // Handle brands array properly
          value.forEach(brandId => params.append('brands', brandId.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    return await apiRequest<ProductListResponse>('GET', `/products/search?${params.toString()}`);
  }

  // Get single product by slug
  static async getProduct(slug: string): Promise<ApiResponse<Product>> {
    return await apiRequest<Product>('GET', `/products/${slug}`);
  }

  // Get filter options
  static async getFilterOptions(): Promise<ApiResponse<FilterOptions>> {
    return await apiRequest<FilterOptions>('GET', '/products/filter-options');
  }

  // Get categories
  static async getCategories(): Promise<ApiResponse<Category[]>> {
    return await apiRequest<Category[]>('GET', '/categories');
  }

  // Get category by slug
  static async getCategory(slug: string): Promise<ApiResponse<Category>> {
    return await apiRequest<Category>('GET', `/categories/${slug}`);
  }

  // Get subcategories for a category
  static async getSubcategories(categoryId?: number): Promise<ApiResponse<Subcategory[]>> {
    const endpoint = categoryId ? `/subcategories?category_id=${categoryId}` : '/subcategories';
    return await apiRequest<Subcategory[]>('GET', endpoint);
  }

  // Get brands
  static async getBrands(): Promise<ApiResponse<Brand[]>> {
    return await apiRequest<Brand[]>('GET', '/brands');
  }

  // Get brand by slug
  static async getBrand(slug: string): Promise<ApiResponse<Brand>> {
    return await apiRequest<Brand>('GET', `/brands/${slug}`);
  }

  // Update product
  static async updateProduct(id: number, data: CreateProductData): Promise<ApiResponse<Product>> {
    return await apiRequest<Product>('PUT', `/products/${id}`, data);
  }

  // Update product status only
  static async updateProductStatus(id: number, isActive: boolean): Promise<ApiResponse<Product>> {
    return await apiRequest<Product>('PATCH', `/products/${id}/status`, { is_active: isActive });
  }
}

// Helper functions for data transformation
export const transformProductForDisplay = (product: Product) => {
  return {
    id: product.id.toString(),
    name: product.name,
    price: product.effective_price, // Use effective price (promotional or regular)
    originalPrice: product.has_promotional_price ? product.price : product.original_price, // Show original price if on promotion
    image: product.primary_image || 'https://via.placeholder.com/400x400?text=No+Image',
    images: product.images?.map(img => img.image_url) || [],
    category: product.category?.name || 'Unknown Category',
    subcategory: product.subcategory?.name || 'Unknown Subcategory',
    rating: product.average_rating,
    reviews: product.total_reviews,
    description: product.description || product.short_description || '',
    specifications: product.specifications || {},
    inStock: product.in_stock,
    brand: product.brand?.name || 'Unknown Brand',
    tags: product.tags || [],
    features: product.features || [],
    slug: product.slug,
    discount_percentage: product.has_promotional_price ? product.promotional_discount_percentage : product.discount_percentage,
    is_on_sale: product.has_promotional_price || product.is_on_sale,
    is_featured: product.is_featured
  };
};

export const getProductImageUrl = (product: Product): string => {
  if (product.primary_image) {
    return product.primary_image;
  }
  if (product.images && product.images.length > 0) {
    const primaryImage = product.images.find(img => img.is_primary);
    return primaryImage?.image_url || product.images[0].image_url;
  }
  return 'https://via.placeholder.com/400x400?text=No+Image';
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

export const calculateDiscount = (price: number, originalPrice?: number): number => {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

// Create product interface
export interface CreateProductData {
  name: string;
  description: string;
  short_description?: string;
  price: number;
  original_price?: number;
  cost_price?: number;
  category_id: number;
  subcategory_id?: number;
  brand_id?: number;
  sku?: string;
  stock_quantity: number;
  min_stock_level?: number;
  weight?: number;
  dimensions?: string;
  specifications?: Record<string, string>;
  features?: string[];
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  is_active?: boolean;
  is_featured?: boolean;
  is_digital?: boolean;
  status?: 'active' | 'inactive' | 'draft';
  images?: Array<{
    url: string;
    alt_text?: string;
    is_primary?: boolean;
  }>;
}

// Create product function - Updated with new fields
export const createProduct = async (data: CreateProductData): Promise<ApiResponse<Product>> => {
  return apiRequest<Product>('POST', '/products', data);
};

// Default export
export default ProductService;

