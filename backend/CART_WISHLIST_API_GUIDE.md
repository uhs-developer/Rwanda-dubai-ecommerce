# Cart and Wishlist API Guide

This guide provides comprehensive documentation for the Cart and Wishlist API endpoints in the Rwanda-Dubai E-commerce project.

## Overview

The Cart and Wishlist functionality supports both authenticated users and guest users (using session-based tracking). All endpoints are public and work seamlessly for both user types.

## Base URL
```
http://localhost:8000/api
```

## Cart API Endpoints

### 1. Get Cart Items
**GET** `/cart`

Retrieves all items in the user's cart (authenticated user or guest session).

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "user_id": 1,
        "product_id": 1,
        "quantity": 2,
        "price": "99.99",
        "product_options": {
          "size": "M",
          "color": "Blue"
        },
        "session_id": null,
        "created_at": "2025-09-01T17:30:00.000000Z",
        "updated_at": "2025-09-01T17:30:00.000000Z",
        "total_price": "199.98",
        "product": {
          "id": 1,
          "name": "Sample Product",
          "price": "99.99",
          "images": [...],
          "brand": {...},
          "category": {...}
        }
      }
    ],
    "summary": {
      "total_items": 2,
      "total_price": "199.98",
      "item_count": 1
    }
  }
}
```

### 2. Add Item to Cart
**POST** `/cart/add`

Adds a product to the cart or updates quantity if already exists.

**Request Body:**
```json
{
  "product_id": 1,
  "quantity": 2,
  "product_options": {
    "size": "M",
    "color": "Blue"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "product_id": 1,
    "quantity": 2,
    "price": "99.99",
    "product_options": {
      "size": "M",
      "color": "Blue"
    },
    "session_id": null,
    "created_at": "2025-09-01T17:30:00.000000Z",
    "updated_at": "2025-09-01T17:30:00.000000Z",
    "product": {...}
  }
}
```

### 3. Update Cart Item Quantity
**PUT** `/cart/update/{id}`

Updates the quantity of a specific cart item.

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart item updated successfully",
  "data": {
    "id": 1,
    "quantity": 3,
    "price": "99.99",
    "total_price": "299.97",
    "product": {...}
  }
}
```

### 4. Remove Item from Cart
**DELETE** `/cart/remove/{id}`

Removes a specific item from the cart.

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart successfully"
}
```

### 5. Clear Cart
**DELETE** `/cart/clear`

Removes all items from the cart.

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "data": {
    "deleted_items": 3
  }
}
```

### 6. Get Cart Summary
**GET** `/cart/summary`

Returns a summary of cart contents (count and total price).

**Response:**
```json
{
  "success": true,
  "data": {
    "total_items": 5,
    "total_price": "499.95",
    "item_count": 3
  }
}
```

## Wishlist API Endpoints

### 1. Get Wishlist Items
**GET** `/wishlist`

Retrieves all items in the user's wishlist.

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "user_id": 1,
        "product_id": 1,
        "session_id": null,
        "created_at": "2025-09-01T17:30:00.000000Z",
        "updated_at": "2025-09-01T17:30:00.000000Z",
        "product": {
          "id": 1,
          "name": "Sample Product",
          "price": "99.99",
          "images": [...],
          "brand": {...},
          "category": {...}
        }
      }
    ],
    "item_count": 1
  }
}
```

### 2. Add Item to Wishlist
**POST** `/wishlist/add`

Adds a product to the wishlist.

**Request Body:**
```json
{
  "product_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to wishlist successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "product_id": 1,
    "session_id": null,
    "created_at": "2025-09-01T17:30:00.000000Z",
    "updated_at": "2025-09-01T17:30:00.000000Z",
    "product": {...}
  }
}
```

### 3. Remove Item from Wishlist (by ID)
**DELETE** `/wishlist/remove/{id}`

Removes a specific item from the wishlist using the wishlist item ID.

**Response:**
```json
{
  "success": true,
  "message": "Item removed from wishlist successfully"
}
```

### 4. Remove Item from Wishlist (by Product ID)
**DELETE** `/wishlist/remove-product/{productId}`

Removes an item from the wishlist using the product ID.

**Response:**
```json
{
  "success": true,
  "message": "Item removed from wishlist successfully"
}
```

### 5. Clear Wishlist
**DELETE** `/wishlist/clear`

Removes all items from the wishlist.

**Response:**
```json
{
  "success": true,
  "message": "Wishlist cleared successfully",
  "data": {
    "deleted_items": 5
  }
}
```

### 6. Check if Product is in Wishlist
**GET** `/wishlist/check/{productId}`

Checks if a specific product is in the user's wishlist.

**Response:**
```json
{
  "success": true,
  "data": {
    "is_in_wishlist": true,
    "product_id": 1
  }
}
```

### 7. Get Wishlist Count
**GET** `/wishlist/count`

Returns the number of items in the wishlist.

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 3
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors, business logic errors)
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Authentication

- **Authenticated Users**: Cart and wishlist items are associated with the user ID
- **Guest Users**: Cart and wishlist items are associated with the session ID
- **Session Management**: Laravel automatically handles session IDs for guest users

## Business Logic

### Cart Logic
- Products must be active and in stock to be added to cart
- Quantity cannot exceed available stock
- Price is stored at the time of adding to cart (price changes don't affect existing cart items)
- Duplicate products are merged by increasing quantity
- Product options (size, color, etc.) are stored as JSON

### Wishlist Logic
- Products must be active to be added to wishlist
- Duplicate products are not allowed (returns error if already exists)
- No quantity tracking (one item per product)

## Testing

Use the provided test script to verify functionality:

```bash
php test_cart_wishlist.php
```

Make sure your Laravel server is running:
```bash
php artisan serve
```

## Database Schema

### Cart Items Table
- `id` - Primary key
- `user_id` - Foreign key to users table (nullable for guests)
- `product_id` - Foreign key to products table
- `quantity` - Number of items
- `price` - Price at time of adding to cart
- `product_options` - JSON field for product variations
- `session_id` - Session ID for guest users
- `created_at`, `updated_at` - Timestamps

### Wishlist Items Table
- `id` - Primary key
- `user_id` - Foreign key to users table (nullable for guests)
- `product_id` - Foreign key to products table
- `session_id` - Session ID for guest users
- `created_at`, `updated_at` - Timestamps

## Performance Considerations

- Indexes are created on frequently queried columns
- Eager loading is used to prevent N+1 queries
- Database transactions ensure data consistency
- Unique constraints prevent duplicate entries

## Security Features

- Input validation on all endpoints
- SQL injection protection through Eloquent ORM
- CSRF protection (handled by Laravel)
- Proper error handling without exposing sensitive information

