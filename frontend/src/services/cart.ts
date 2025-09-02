import apiClient, { ApiResponse } from './api';

export interface CartItem {
  id: number;
  user_id?: number;
  product_id: number;
  quantity: number;
  price: number;
  product_options?: Record<string, any>;
  session_id?: string;
  created_at: string;
  updated_at: string;
  total_price: number;
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

export interface CartSummary {
  total_items: number;
  total_price: number;
  item_count: number;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
  product_options?: Record<string, any>;
}

export interface UpdateCartRequest {
  quantity: number;
}

// Cart API Service
export const cartService = {
  // Get all cart items
  async getCart(): Promise<ApiResponse<{ items: CartItem[]; summary: CartSummary }>> {
    try {
      const response = await apiClient.get('/cart');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Add item to cart
  async addToCart(data: AddToCartRequest): Promise<ApiResponse<CartItem>> {
    try {
      const response = await apiClient.post('/cart/add', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Update cart item quantity
  async updateCartItem(id: number, data: UpdateCartRequest): Promise<ApiResponse<CartItem>> {
    try {
      const response = await apiClient.put(`/cart/update/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Remove item from cart
  async removeFromCart(id: number): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await apiClient.delete(`/cart/remove/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Clear entire cart
  async clearCart(): Promise<ApiResponse<{ deleted_items: number }>> {
    try {
      const response = await apiClient.delete('/cart/clear');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Get cart summary
  async getCartSummary(): Promise<ApiResponse<CartSummary>> {
    try {
      const response = await apiClient.get('/cart/summary');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
};

// Local storage fallback for offline functionality
export const cartLocalStorage = {
  getCart(): CartItem[] {
    try {
      const cart = localStorage.getItem('rwanda-dubai-cart');
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      return [];
    }
  },

  saveCart(cart: CartItem[]): void {
    try {
      localStorage.setItem('rwanda-dubai-cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  },

  addToCart(product: any, quantity: number = 1): CartItem[] {
    const cart = this.getCart();
    const existingItem = cart.find(item => item.product_id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: Date.now(), // Temporary ID for local storage
        product_id: product.id,
        quantity,
        price: product.price,
        product_options: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        total_price: product.price * quantity,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          original_price: product.originalPrice,
          image: product.image,
          in_stock: product.inStock,
          stock_quantity: 999 // Default value for local storage
        }
      });
    }
    
    this.saveCart(cart);
    return cart;
  },

  updateQuantity(targetId: number, quantity: number): CartItem[] {
    const cart = this.getCart();
    // Support both product_id and item id inputs
    const item = cart.find(item => item.product_id === targetId || item.id === targetId);
    
    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(targetId);
      }
      item.quantity = quantity;
      item.total_price = item.price * quantity;
      item.updated_at = new Date().toISOString();
    }
    
    this.saveCart(cart);
    return cart;
  },

  removeFromCart(targetId: number): CartItem[] {
    const cart = this.getCart();
    // Support both product_id and item id inputs
    const filteredCart = cart.filter(item => item.product_id !== targetId && item.id !== targetId);
    this.saveCart(filteredCart);
    return filteredCart;
  },

  clearCart(): CartItem[] {
    this.saveCart([]);
    return [];
  }
};

