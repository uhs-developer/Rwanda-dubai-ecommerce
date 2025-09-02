import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { cartService, cartLocalStorage, CartItem, AddToCartRequest, UpdateCartRequest } from '../services/cart';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  cartItemCount: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addToCart: (product: any, quantity?: number, options?: Record<string, any>) => Promise<void>;
  updateCartItem: (id: number, quantity: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  
  // Utility
  isInCart: (productId: number) => boolean;
  getCartItem: (productId: number) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load cart on mount and when user changes
  useEffect(() => {
    refreshCart();
  }, [user]);

  // Calculate derived values
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.total_price, 0);

  // Refresh cart from API
  const refreshCart = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to load from API first
      const response = await cartService.getCart();
      if (response.success && response.data) {
        setCartItems(response.data.items);
        return;
      }
    } catch (error: any) {
      console.warn('Failed to load cart from API, falling back to localStorage:', error);
      
      // Fallback to localStorage
      try {
        const localCart = cartLocalStorage.getCart();
        setCartItems(localCart);
      } catch (localError) {
        console.error('Failed to load cart from localStorage:', localError);
        setError('Failed to load cart');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (product: any, quantity: number = 1, options: Record<string, any> = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to add via API first
      const request: AddToCartRequest = {
        product_id: parseInt(product.id),
        quantity,
        product_options: options
      };
      
      const response = await cartService.addToCart(request);
      if (response.success && response.data) {
        // Refresh cart to get updated data
        await refreshCart();
        toast.success(`${product.name} added to cart!`);
        return;
      }
    } catch (error: any) {
      console.warn('Failed to add to cart via API, falling back to localStorage:', error);
      
      // Fallback to localStorage
      try {
        const updatedCart = cartLocalStorage.addToCart(product, quantity);
        setCartItems(updatedCart);
        toast.success(`${product.name} added to cart! (offline mode)`);
      } catch (localError) {
        console.error('Failed to add to cart in localStorage:', localError);
        setError('Failed to add item to cart');
        toast.error('Failed to add item to cart');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (id: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Try to update via API first
      const request: UpdateCartRequest = { quantity };
      const response = await cartService.updateCartItem(id, request);
      if (response.success && response.data) {
        // Refresh cart to get updated data
        await refreshCart();
        toast.success('Cart updated successfully!');
        return;
      }
    } catch (error: any) {
      console.warn('Failed to update cart via API, falling back to localStorage:', error);
      
      // Fallback to localStorage
      try {
        const updatedCart = cartLocalStorage.updateQuantity(id, quantity);
        setCartItems(updatedCart);
        toast.success('Cart updated successfully! (offline mode)');
      } catch (localError) {
        console.error('Failed to update cart in localStorage:', localError);
        setError('Failed to update cart');
        toast.error('Failed to update cart');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (id: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to remove via API first
      const response = await cartService.removeFromCart(id);
      if (response.success) {
        // Refresh cart to get updated data
        await refreshCart();
        toast.success('Item removed from cart');
        return;
      }
    } catch (error: any) {
      console.warn('Failed to remove from cart via API, falling back to localStorage:', error);
      
      // Fallback to localStorage
      try {
        const updatedCart = cartLocalStorage.removeFromCart(id);
        setCartItems(updatedCart);
        toast.success('Item removed from cart (offline mode)');
      } catch (localError) {
        console.error('Failed to remove from cart in localStorage:', localError);
        setError('Failed to remove item from cart');
        toast.error('Failed to remove item from cart');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to clear via API first
      const response = await cartService.clearCart();
      if (response.success) {
        setCartItems([]);
        toast.success('Cart cleared successfully');
        return;
      }
    } catch (error: any) {
      console.warn('Failed to clear cart via API, falling back to localStorage:', error);
      
      // Fallback to localStorage
      try {
        cartLocalStorage.clearCart();
        setCartItems([]);
        toast.success('Cart cleared successfully (offline mode)');
      } catch (localError) {
        console.error('Failed to clear cart in localStorage:', localError);
        setError('Failed to clear cart');
        toast.error('Failed to clear cart');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Utility functions
  const isInCart = (productId: number): boolean => {
    return cartItems.some(item => item.product_id === productId);
  };

  const getCartItem = (productId: number): CartItem | undefined => {
    return cartItems.find(item => item.product_id === productId);
  };

  const value: CartContextType = {
    cartItems,
    cartItemCount,
    totalPrice,
    isLoading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    isInCart,
    getCartItem,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

