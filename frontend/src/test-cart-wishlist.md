# Cart and Wishlist Integration Test Guide

## Overview
This guide explains how to test the newly integrated cart and wishlist functionality that connects the frontend to the backend API.

## What's Been Implemented

### 1. **Backend API Integration**
- ✅ Cart API endpoints (`/api/cart/*`)
- ✅ Wishlist API endpoints (`/api/wishlist/*`)
- ✅ Guest user support (session-based)
- ✅ Authenticated user support
- ✅ Offline fallback to localStorage

### 2. **Frontend Contexts**
- ✅ `CartContext` - Manages cart state and API calls
- ✅ `WishlistContext` - Manages wishlist state and API calls
- ✅ Automatic fallback to localStorage when API is unavailable

### 3. **Updated Components**
- ✅ `ProductCard` - Now uses contexts for add to cart/wishlist
- ✅ `ShoppingCart` - Updated to use cart context
- ✅ `MiniWishlist` - Updated to use wishlist context
- ✅ `Header` - Shows real-time cart/wishlist counts

## Testing Steps

### **Prerequisites**
1. Ensure backend Laravel server is running on `http://localhost:8000`
2. Ensure frontend is running on `http://localhost:5173` (or your configured port)
3. Make sure you have some products in your database

### **Test 1: Basic Cart Functionality**

1. **Open the homepage** and look for product cards
2. **Click "Add to Cart"** on any product
   - Should see success toast: "Product added to cart!"
   - Cart icon in header should show count
   - Button should change to "In Cart" with green background

3. **Open cart sidebar** by clicking cart icon
   - Should see the added product
   - Should show correct quantity and price
   - Should be able to update quantity with +/- buttons
   - Should be able to remove items

### **Test 2: Basic Wishlist Functionality**

1. **Hover over a product card** to see the heart icon
2. **Click the heart icon** to add to wishlist
   - Should see success toast: "Product added to wishlist!"
   - Heart should turn red and filled
   - Wishlist count in header should increase

3. **Click heart again** to remove from wishlist
   - Should see success toast: "Item removed from wishlist"
   - Heart should return to normal state
   - Wishlist count should decrease

### **Test 3: Guest vs Authenticated User**

1. **Test as Guest User** (not logged in):
   - Add items to cart and wishlist
   - Refresh the page
   - Items should persist (session-based)

2. **Test as Authenticated User** (log in):
   - Add items to cart and wishlist
   - Items should be associated with your user account
   - Log out and back in - items should still be there

### **Test 4: Offline Functionality**

1. **Disconnect from internet** or stop backend server
2. **Try to add items** to cart/wishlist
   - Should see "(offline mode)" in success messages
   - Items should be stored in localStorage
   - UI should remain functional

3. **Reconnect to internet** or restart backend
4. **Refresh the page**
   - Should automatically sync with backend
   - Local storage items should be preserved

### **Test 5: API Error Handling**

1. **Stop the backend server**
2. **Try to add items** to cart/wishlist
   - Should gracefully fall back to localStorage
   - Should show appropriate error messages
   - Should continue working offline

3. **Restart backend server**
4. **Refresh the page**
   - Should automatically reconnect to API
   - Should sync any offline changes

## Expected Behavior

### **Success Scenarios**
- ✅ Adding items to cart/wishlist shows success toasts
- ✅ Cart/wishlist counts update in real-time
- ✅ Items persist across page refreshes
- ✅ Guest and authenticated users work seamlessly
- ✅ Offline mode provides fallback functionality

### **Error Scenarios**
- ✅ API errors are handled gracefully
- ✅ Offline mode activates automatically
- ✅ User sees appropriate error messages
- ✅ Functionality continues working offline

### **Performance**
- ✅ API calls are optimized with proper error handling
- ✅ Local storage fallback prevents data loss
- ✅ Real-time updates without page refreshes
- ✅ Smooth transitions between online/offline modes

## Troubleshooting

### **Common Issues**

1. **Cart/Wishlist not updating**
   - Check browser console for errors
   - Verify backend server is running
   - Check network tab for failed API calls

2. **Items not persisting**
   - Verify localStorage is enabled
   - Check if backend API is responding
   - Look for authentication issues

3. **API errors**
   - Check backend logs
   - Verify API endpoints are accessible
   - Check CORS configuration

### **Debug Information**

- **Browser Console**: Shows API calls and errors
- **Network Tab**: Shows HTTP requests and responses
- **Local Storage**: Shows offline data
- **Backend Logs**: Shows server-side errors

## API Endpoints Used

### **Cart Endpoints**
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/{id}` - Update quantity
- `DELETE /api/cart/remove/{id}` - Remove item
- `DELETE /api/cart/clear` - Clear cart
- `GET /api/cart/summary` - Get cart summary

### **Wishlist Endpoints**
- `GET /api/wishlist` - Get wishlist items
- `POST /api/wishlist/add` - Add item to wishlist
- `DELETE /api/wishlist/remove/{id}` - Remove item
- `DELETE /api/wishlist/remove-product/{productId}` - Remove by product
- `DELETE /api/wishlist/clear` - Clear wishlist
- `GET /api/wishlist/check/{productId}` - Check if in wishlist
- `GET /api/wishlist/count` - Get wishlist count

## Conclusion

The cart and wishlist integration provides:
- **Seamless user experience** with real-time updates
- **Robust offline support** with localStorage fallback
- **Guest and authenticated user support**
- **Automatic error handling** and recovery
- **Performance optimization** with proper state management

All functionality should work seamlessly whether the user is online or offline, authenticated or guest.
