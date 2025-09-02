import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { wishlistService, wishlistLocalStorage, WishlistItem, AddToWishlistRequest } from '../services/wishlist';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  wishlistItemCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addToWishlist: (product: any) => Promise<void>;
  removeFromWishlist: (id: number) => Promise<void>;
  removeByProduct: (productId: number) => Promise<void>;
  clearWishlist: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  
  // Utility
  isInWishlist: (productId: number) => boolean;
  getWishlistItem: (productId: number) => WishlistItem | undefined;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Calculate derived values
  const wishlistItemCount = wishlistItems.length;

  // Load from localStorage immediately on mount
  useEffect(() => {
    console.log('WishlistContext: Loading wishlist from localStorage on mount...');
    const localWishlist = wishlistLocalStorage.getWishlist();
    console.log('WishlistContext: localStorage wishlist data:', localWishlist);
    
    if (localWishlist.length > 0) {
      console.log('WishlistContext: Setting wishlist items from localStorage:', localWishlist);
      setWishlistItems(localWishlist);
    } else {
      console.log('WishlistContext: No localStorage wishlist data found');
    }
  }, []); // Empty dependency array - only run on mount

  // Sync with API when user changes (but don't override localStorage data)
  useEffect(() => {
    if (user) {
      console.log('WishlistContext: User changed, syncing with API...');
      syncWithAPI();
    }
  }, [user]);

  // Refresh wishlist from API
  const refreshWishlist = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to load from API first
      const response = await wishlistService.getWishlist();
      if (response.success && response.data) {
        setWishlistItems(response.data.items);
        return;
      }
    } catch (error: any) {
      console.warn('Failed to load wishlist from API, falling back to localStorage:', error);
      
      // Fallback to localStorage
      try {
        const localWishlist = wishlistLocalStorage.getWishlist();
        setWishlistItems(localWishlist);
      } catch (localError) {
        console.error('Failed to load wishlist from localStorage:', localError);
        setError('Failed to load wishlist');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Sync with API without overriding localStorage data
  const syncWithAPI = async () => {
    try {
      const response = await wishlistService.getWishlist();
      if (response.success && response.data && response.data.items && response.data.items.length > 0) {
        // Only update if API has data and it's different from current
        setWishlistItems(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(response.data!.items)) {
            return response.data!.items;
          }
          return prev;
        });
      }
    } catch (error: any) {
      console.warn('Failed to sync wishlist with API:', error);
      // Don't override localStorage data on API failure
    }
  };

  // Add item to wishlist
  const addToWishlist = async (product: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if already in wishlist
      if (isInWishlist(parseInt(product.id))) {
        toast.info('Item already in wishlist');
        return;
      }

      // Try to add via API first
      const request: AddToWishlistRequest = {
        product_id: parseInt(product.id)
      };
      
      const response = await wishlistService.addToWishlist(request);
      if (response.success && response.data) {
        // Refresh wishlist to get updated data
        await refreshWishlist();
        toast.success(`${product.name} added to wishlist!`);
        return;
      }
    } catch (error: any) {
      console.warn('Failed to add to wishlist via API, falling back to localStorage:', error);
      
      // Fallback to localStorage
      try {
        const updatedWishlist = wishlistLocalStorage.addToWishlist(product);
        setWishlistItems(updatedWishlist);
        toast.success(`${product.name} added to wishlist! (offline mode)`);
      } catch (localError) {
        console.error('Failed to add to wishlist in localStorage:', localError);
        setError('Failed to add item to wishlist');
        toast.error('Failed to add item to wishlist');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from wishlist by ID
  const removeFromWishlist = async (id: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to remove via API first
      const response = await wishlistService.removeFromWishlist(id);
      if (response.success) {
        // Update local state immediately for better UX
        setWishlistItems(prev => prev.filter(item => item.id !== id));
        toast.success('Item removed from wishlist');
        return;
      }
    } catch (error: any) {
      console.warn('Failed to remove from wishlist via API, falling back to localStorage:', error);
      
      // Fallback to localStorage
      try {
        const updatedWishlist = wishlistLocalStorage.removeFromWishlist(id);
        setWishlistItems(updatedWishlist);
        toast.success('Item removed from wishlist (offline mode)');
      } catch (localError) {
        console.error('Failed to remove from wishlist in localStorage:', localError);
        setError('Failed to remove item from wishlist');
        toast.error('Failed to remove item from wishlist');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from wishlist by product ID
  const removeByProduct = async (productId: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to remove via API first
      const response = await wishlistService.removeByProduct(productId);
      if (response.success) {
        // Update local state immediately for better UX
        setWishlistItems(prev => prev.filter(item => item.product_id !== productId));
        toast.success('Item removed from wishlist');
        return;
      }
    } catch (error: any) {
      console.warn('Failed to remove from wishlist via API, falling back to localStorage:', error);
      
      // Fallback to localStorage
      try {
        const updatedWishlist = wishlistLocalStorage.removeFromWishlist(productId);
        setWishlistItems(updatedWishlist);
        toast.success('Item removed from wishlist (offline mode)');
      } catch (localError) {
        console.error('Failed to remove from wishlist in localStorage:', localError);
        setError('Failed to remove item from wishlist');
        toast.error('Failed to remove item from wishlist');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to clear via API first
      const response = await wishlistService.clearWishlist();
      if (response.success) {
        setWishlistItems([]);
        toast.success('Wishlist cleared successfully');
        return;
      }
    } catch (error: any) {
      console.warn('Failed to clear wishlist via API, falling back to localStorage:', error);
      
      // Fallback to localStorage
      try {
        wishlistLocalStorage.clearWishlist();
        setWishlistItems([]);
        toast.success('Wishlist cleared successfully (offline mode)');
      } catch (localError) {
        console.error('Failed to clear wishlist in localStorage:', localError);
        setError('Failed to clear wishlist');
        toast.error('Failed to clear wishlist');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Utility functions
  const isInWishlist = (productId: number): boolean => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  const getWishlistItem = (productId: number): WishlistItem | undefined => {
    return wishlistItems.find(item => item.product_id === productId);
  };

  const value: WishlistContextType = {
    wishlistItems,
    wishlistItemCount,
    isLoading,
    error,
    addToWishlist,
    removeFromWishlist,
    removeByProduct,
    clearWishlist,
    refreshWishlist,
    isInWishlist,
    getWishlistItem,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

