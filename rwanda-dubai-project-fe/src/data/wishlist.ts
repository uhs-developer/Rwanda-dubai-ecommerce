import { Product } from './products';

export interface WishlistItem extends Product {
  dateAdded: Date;
}

export const getWishlistFromStorage = (): WishlistItem[] => {
  try {
    const wishlist = localStorage.getItem('techbridge-wishlist');
    if (wishlist) {
      const parsed = JSON.parse(wishlist);
      return parsed.map((item: any) => ({
        ...item,
        dateAdded: new Date(item.dateAdded),
      }));
    }
  } catch (error) {
    console.error('Failed to load wishlist from localStorage:', error);
  }
  return [];
};

export const saveWishlistToStorage = (wishlist: WishlistItem[]) => {
  try {
    localStorage.setItem('techbridge-wishlist', JSON.stringify(wishlist));
  } catch (error) {
    console.error('Failed to save wishlist to localStorage:', error);
  }
};