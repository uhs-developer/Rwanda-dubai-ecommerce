# 🚀 Rwanda-Dubai E-commerce API Testing Guide

Complete guide for testing the product, category, and brand APIs using Postman.

## 📋 Table of Contents

- [Setup](#setup)
- [Base Configuration](#base-configuration)
- [Categories API](#categories-api)
- [Products API](#products-api)
- [Brands API](#brands-api)
- [Advanced Filtering Examples](#advanced-filtering-examples)
- [Response Examples](#response-examples)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Setup

### Prerequisites
- Laravel server running on `http://localhost:8000`
- Postman installed
- Database seeded with sample data

### Start the Server
```bash
cd rwanda-dubai-be
php artisan serve --port=8000
```

### Verify Server is Running
Open browser and visit: `http://localhost:8000` - you should see the Laravel welcome page.

---

## ⚙️ Base Configuration

### Postman Environment Variables
Create a new environment in Postman with these variables:

| Variable | Value |
|----------|-------|
| `base_url` | `http://localhost:8000` |
| `api_url` | `{{base_url}}/api` |

### Common Headers
For all requests, set these headers:
```
Content-Type: application/json
Accept: application/json
```

---

## 📂 Categories API

### 1. Get All Categories

**Request:**
```
GET {{api_url}}/categories
```

**Description:** Retrieves all active categories with their subcategories.

**Expected Response:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "slug": "electronics",
      "description": "Latest electronic devices and gadgets",
      "image": "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300",
      "product_count": 2,
      "subcategories": [
        {
          "id": 1,
          "name": "Smartphones",
          "slug": "smartphones",
          "description": null,
          "image": null,
          "product_count": 2
        }
      ]
    }
  ]
}
```

### 2. Get Single Category

**Request:**
```
GET {{api_url}}/categories/electronics
```

**Description:** Retrieves a specific category by its slug with subcategories.

**Parameters:**
- `{slug}`: Category slug (e.g., "electronics", "auto-parts")

---

## 🛍️ Products API

### 1. Get All Products

**Request:**
```
GET {{api_url}}/products
```

**Description:** Retrieves paginated list of all active products.

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `per_page` | integer | Items per page (default: 12) | `?per_page=8` |
| `page` | integer | Page number (default: 1) | `?page=2` |

**Example:**
```
GET {{api_url}}/products?per_page=5&page=1
```

### 2. Get Featured Products

**Request:**
```
GET {{api_url}}/products/featured
```

**Description:** Retrieves all featured products (limited to 12).

### 3. Search Products

**Request:**
```
GET {{api_url}}/products/search?q=iphone
```

**Description:** Search products by name, description, brand, or tags.

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `q` | string | Search term (required) | `?q=iphone` |
| `per_page` | integer | Items per page | `?q=phone&per_page=5` |
| `page` | integer | Page number | `?q=phone&page=2` |

**Additional Examples:**
```
GET {{api_url}}/products/search?q=samsung
GET {{api_url}}/products/search?q=laptop&per_page=10
GET {{api_url}}/products/search?q=premium&sort_by=price-high
```

### 4. Get Filter Options

**Request:**
```
GET {{api_url}}/products/filter-options
```

**Description:** Retrieves all available filter options for the product listing page.

**Expected Response:**
```json
{
  "success": true,
  "message": "Filter options retrieved successfully",
  "data": {
    "brands": [
      {
        "id": 1,
        "name": "Apple",
        "slug": "apple"
      }
    ],
    "categories": [
      {
        "id": 1,
        "name": "Electronics",
        "slug": "electronics"
      }
    ],
    "subcategories": [
      {
        "id": 1,
        "name": "Smartphones",
        "slug": "smartphones",
        "category_id": 1
      }
    ],
    "price_range": {
      "min": 1199,
      "max": 1299
    },
    "rating_options": [5, 4, 3, 2, 1],
    "availability_options": ["in_stock", "out_of_stock", "on_backorder"]
  }
}
```

### 5. Get Single Product

**Request:**
```
GET {{api_url}}/products/iphone-15-pro-max-256gb
```

**Description:** Retrieves detailed information about a specific product including related products.

**Parameters:**
- `{slug}`: Product slug

**Response includes:**
- Complete product details with specifications
- Product images
- Related products (up to 6)

### 6. Product Filtering

**Basic Filtering:**
```
GET {{api_url}}/products?category=electronics
GET {{api_url}}/products?subcategory=smartphones
GET {{api_url}}/products?brands=apple
GET {{api_url}}/products?brands=apple,samsung
```

**Price Filtering:**
```
GET {{api_url}}/products?min_price=500
GET {{api_url}}/products?max_price=1500
GET {{api_url}}/products?min_price=500&max_price=1500
```

**Rating Filtering:**
```
GET {{api_url}}/products?min_rating=4
GET {{api_url}}/products?min_rating=4.5
```

**Stock Filtering:**
```
GET {{api_url}}/products?in_stock_only=1
GET {{api_url}}/products?featured=1
```

### 7. Product Sorting

**Available Sort Options:**
```
GET {{api_url}}/products?sort_by=relevance       # Default
GET {{api_url}}/products?sort_by=price-low       # Price: Low to High
GET {{api_url}}/products?sort_by=price-high      # Price: High to Low
GET {{api_url}}/products?sort_by=rating          # Highest Rated
GET {{api_url}}/products?sort_by=newest          # Newest First
GET {{api_url}}/products?sort_by=name            # Alphabetical
GET {{api_url}}/products?sort_by=popularity      # Most Popular
```

---

## 🏷️ Brands API

### 1. Get All Brands

**Request:**
```
GET {{api_url}}/brands
```

**Description:** Retrieves all active brands with product counts.

### 2. Get Single Brand

**Request:**
```
GET {{api_url}}/brands/apple
```

**Description:** Retrieves a specific brand by its slug.

**Parameters:**
- `{slug}`: Brand slug (e.g., "apple", "samsung")

---

## 🔍 Advanced Filtering Examples

### Complex Product Filtering

**Electronics from Apple & Samsung, price range $1000-$1500, rated 4+:**
```
GET {{api_url}}/products?category=electronics&brands=apple,samsung&min_price=1000&max_price=1500&min_rating=4&sort_by=price-low
```

**Featured smartphones in stock only:**
```
GET {{api_url}}/products?subcategory=smartphones&featured=1&in_stock_only=1&sort_by=rating
```

**Search with filters:**
```
GET {{api_url}}/products/search?q=phone&brands=apple&min_price=1000&sort_by=price-high&per_page=5
```

### Pagination Examples

**Get second page of electronics (8 items per page):**
```
GET {{api_url}}/products?category=electronics&per_page=8&page=2
```

**Search results with pagination:**
```
GET {{api_url}}/products/search?q=samsung&per_page=10&page=1
```

---

## 📄 Response Examples

### Successful Product Response
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "iPhone 15 Pro Max 256GB",
      "slug": "iphone-15-pro-max-256gb",
      "price": 1299,
      "original_price": 1399,
      "discount_percentage": 7,
      "is_on_sale": true,
      "primary_image": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800",
      "category": {
        "id": 1,
        "name": "Electronics",
        "slug": "electronics"
      },
      "subcategory": {
        "id": 1,
        "name": "Smartphones",
        "slug": "smartphones"
      },
      "brand": {
        "id": 1,
        "name": "Apple",
        "slug": "apple"
      },
      "average_rating": 4.8,
      "total_reviews": 2156,
      "in_stock": true,
      "stock_status": "in_stock",
      "is_featured": true,
      "short_description": "The most advanced iPhone ever with titanium design."
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 12,
    "total": 2,
    "from": 1,
    "to": 2
  }
}
```

### Error Response Examples

**Category Not Found:**
```json
{
  "success": false,
  "message": "Category not found"
}
```

**Search Term Missing:**
```json
{
  "success": false,
  "message": "Search term is required"
}
```

**Server Error:**
```json
{
  "success": false,
  "message": "Failed to retrieve products",
  "error": "Database connection error"
}
```

---

## 🧪 Postman Collection

### Create a Collection

1. **Open Postman**
2. **Create New Collection** named "Rwanda-Dubai E-commerce API"
3. **Add requests** for each endpoint listed above
4. **Set up environment** with base_url variable

### Folder Structure
```
📁 Rwanda-Dubai E-commerce API
├── 📁 Categories
│   ├── Get All Categories
│   └── Get Single Category
├── 📁 Products
│   ├── Get All Products
│   ├── Get Featured Products
│   ├── Search Products
│   ├── Get Filter Options
│   ├── Get Single Product
│   └── 📁 Filtering Examples
│       ├── Filter by Category
│       ├── Filter by Brand
│       ├── Filter by Price Range
│       └── Complex Filtering
└── 📁 Brands
    ├── Get All Brands
    └── Get Single Brand
```

### Pre-request Scripts

For dynamic testing, add this pre-request script to get random product:
```javascript
// Get random product slug for testing
const slugs = ['iphone-15-pro-max-256gb', 'samsung-galaxy-s24-ultra'];
const randomSlug = slugs[Math.floor(Math.random() * slugs.length)];
pm.environment.set('random_product_slug', randomSlug);
```

Then use: `GET {{api_url}}/products/{{random_product_slug}}`

---

## 🐛 Troubleshooting

### Common Issues

**1. Server Not Running**
```
Error: connect ECONNREFUSED 127.0.0.1:8000
```
**Solution:** Start Laravel server with `php artisan serve --port=8000`

**2. Empty Response**
```json
{"success": true, "data": []}
```
**Solution:** Run seeder with `php artisan db:seed --class=ProductsAndCategoriesSeeder`

**3. Route Not Found**
```
404 | Not Found
```
**Solution:** Clear route cache with `php artisan route:clear`

**4. Database Error**
```json
{"success": false, "message": "SQLSTATE[42S02]: Base table or view not found"}
```
**Solution:** Run migrations with `php artisan migrate`

### Verification Steps

1. **Check server status:**
   ```bash
   curl http://localhost:8000
   ```

2. **Verify routes:**
   ```bash
   php artisan route:list --path=api
   ```

3. **Check database:**
   ```bash
   php artisan tinker
   >>> App\Models\Product::count()
   >>> App\Models\Category::count()
   ```

---

## 📞 API Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Successful request |
| 400 | Bad Request | Invalid parameters (e.g., missing search term) |
| 404 | Not Found | Product/Category/Brand not found |
| 500 | Server Error | Internal server error |

---

## 🎯 Testing Checklist

- [ ] Server is running on port 8000
- [ ] Database is migrated and seeded
- [ ] Categories API returns data
- [ ] Products API returns paginated data
- [ ] Search API works with query parameter
- [ ] Filter options API returns all filter data
- [ ] Single product API returns detailed data
- [ ] Brands API returns brand data
- [ ] Filtering by category works
- [ ] Filtering by brand works
- [ ] Price range filtering works
- [ ] Rating filtering works
- [ ] Sorting by different options works
- [ ] Pagination works correctly
- [ ] Error responses are properly formatted

---

**🎉 Your Rwanda-Dubai E-commerce API is ready for testing!**

Use this guide to thoroughly test all API endpoints and ensure they work correctly with your frontend application.


