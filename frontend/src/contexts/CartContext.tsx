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

  // Calculate derived values
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.total_price, 0);

  // Load from localStorage immediately on mount
  useEffect(() => {
    console.log('CartContext: Loading cart from localStorage on mount...');
    const localCart = cartLocalStorage.getCart();
    console.log('CartContext: localStorage cart data:', localCart);
    
    if (localCart.length > 0) {
      console.log('CartContext: Setting cart items from localStorage:', localCart);
      setCartItems(localCart);
    } else {
      console.log('CartContext: No localStorage cart data found');
    }
  }, []); // Empty dependency array - only run on mount

  // Sync with API when user changes (but don't override localStorage data)
  useEffect(() => {
    if (user) {
      console.log('CartContext: User changed, syncing with API...');
      syncWithAPI();
    }
  }, [user]);

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

  // Sync with API without overriding localStorage data
  const syncWithAPI = async () => {
    try {
      const response = await cartService.getCart();
      if (response.success && response.data && response.data.items && response.data.items.length > 0) {
        // Only update if API has data and it's different from current
        setCartItems(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(response.data!.items)) {
            return response.data!.items;
          }
          return prev;
        });
      }
    } catch (error: any) {
      console.warn('Failed to sync cart with API:', error);
      // Don't override localStorage data on API failure
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
        // Update local state immediately for better UX
        setCartItems(prev => prev.map(item => 
          item.id === id 
            ? { ...item, quantity, total_price: item.price * quantity, updated_at: new Date().toISOString() }
            : item
        ));
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
        // Update local state immediately for better UX
        setCartItems(prev => prev.filter(item => item.id !== id));
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

