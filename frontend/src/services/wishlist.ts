import apiClient, { ApiResponse } from './api';

export interface WishlistItem {
  id: number;
  user_id?: number;
  product_id: number;
  session_id?: string;
  created_at: string;
  updated_at: string;
  product: {
    id: number;
    name: string;
    price: number;
    original_price?: number;
    image?: string;
    images?: Array<{ image_url: string; is_primary: boolean }>;
    brand?: { name: string };
    category?: { name: string };
    in_stock: boolean;
    stock_quantity: number;
  };
}

export interface AddToWishlistRequest {
  product_id: number;
}

export interface WishlistCheckResponse {
  is_in_wishlist: boolean;
  product_id: number;
}

export interface WishlistCountResponse {
  count: number;
}

// Wishlist API Service
export const wishlistService = {
  // Get all wishlist items
  async getWishlist(): Promise<ApiResponse<{ items: WishlistItem[]; item_count: number }>> {
    try {
      const response = await apiClient.get('/wishlist');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Add item to wishlist
  async addToWishlist(data: AddToWishlistRequest): Promise<ApiResponse<WishlistItem>> {
    try {
      const response = await apiClient.post('/wishlist/add', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Remove item from wishlist by ID
  async removeFromWishlist(id: number): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await apiClient.delete(`/wishlist/remove/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Remove item from wishlist by product ID
  async removeByProduct(productId: number): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await apiClient.delete(`/wishlist/remove-product/${productId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Clear entire wishlist
  async clearWishlist(): Promise<ApiResponse<{ deleted_items: number }>> {
    try {
      const response = await apiClient.delete('/wishlist/clear');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Check if product is in wishlist
  async checkWishlist(productId: number): Promise<ApiResponse<WishlistCheckResponse>> {
    try {
      const response = await apiClient.get(`/wishlist/check/${productId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Get wishlist count
  async getWishlistCount(): Promise<ApiResponse<WishlistCountResponse>> {
    try {
      const response = await apiClient.get('/wishlist/count');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
};

// Local storage fallback for offline functionality
export const wishlistLocalStorage = {
  getWishlist(): WishlistItem[] {
    try {
      const wishlist = localStorage.getItem('rwanda-dubai-wishlist');
      if (wishlist) {
        const parsed = JSON.parse(wishlist);
        return parsed.map((item: any) => ({
          ...item,
          created_at: new Date(item.created_at).toISOString(),
          updated_at: new Date(item.updated_at).toISOString(),
        }));
      }
    } catch (error) {
      console.error('Failed to load wishlist from localStorage:', error);
    }
    return [];
  },

  saveWishlist(wishlist: WishlistItem[]): void {
    try {
      localStorage.setItem('rwanda-dubai-wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Failed to save wishlist to localStorage:', error);
    }
  },

  addToWishlist(product: any): WishlistItem[] {
    const wishlist = this.getWishlist();
    const isAlreadyInWishlist = wishlist.some(item => item.product_id === product.id);
    
    if (isAlreadyInWishlist) {
      return wishlist; // Already exists
    }

    const newItem: WishlistItem = {
      id: Date.now(), // Temporary ID for local storage
      product_id: product.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        original_price: product.originalPrice,
        image: product.image,
        in_stock: product.inStock,
        stock_quantity: 999 // Default value for local storage
      }
    };

    wishlist.push(newItem);
    this.saveWishlist(wishlist);
    return wishlist;
  },

  removeFromWishlist(targetId: number): WishlistItem[] {
    const wishlist = this.getWishlist();
    // Support both item id and product_id inputs
    const filteredWishlist = wishlist.filter(item => item.id !== targetId && item.product_id !== targetId);
    this.saveWishlist(filteredWishlist);
    return filteredWishlist;
  },

  clearWishlist(): WishlistItem[] {
    this.saveWishlist([]);
    return [];
  },

  isInWishlist(productId: number): boolean {
    const wishlist = this.getWishlist();
    return wishlist.some(item => item.product_id === productId);
  },

  getWishlistCount(): number {
    return this.getWishlist().length;
  }
};

