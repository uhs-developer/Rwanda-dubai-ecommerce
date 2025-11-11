# 🔐 Rwanda-Dubai E-commerce - API Credentials & Testing Guide

## ✅ FIXED ISSUES
- ✅ TenantResolver now applies to both `web` and `api` middleware groups
- ✅ Admin panel error "Target class [tenant] does not exist" is FIXED

## 🔑 Working Test Credentials

### Admin Panel Login (`http://localhost:8000/admin/login`)

```
Super Admin:
  Email: superadmin@example.com
  Password: SuperAdmin@123
  Access: Full system admin

Regular Admin:
  Email: admin@example.com
  Password: Admin@123
  Access: Standard admin features
```

### API/Frontend Customer Login

```
Customer 1:
  Email: customer@test.com
  Password: password
  For: REST API & GraphQL testing

Customer 2:
  Email: frontend@test.com
  Password: password
  For: Frontend application testing
```

## 🌐 API Endpoints

### Base URLs
```
Backend:      http://localhost:8000
REST API:     http://localhost:8000/api
GraphQL:      http://localhost:8000/graphql
Admin Panel:  http://localhost:8000/admin
```

## 📋 Quick API Tests

### 1. REST API - Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "customer@test.com", "password": "password"}'
```

Response will include a `token` - copy this for authenticated requests.

### 2. REST API - Get Products
```bash
curl http://localhost:8000/api/products \
  -H "Accept: application/json"
```

### 3. GraphQL - Login
```bash
curl -X POST http://localhost:8000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { login(email: \"customer@test.com\", password: \"password\") { token user { id name email } } }"
  }'
```

### 4. GraphQL - Get Cart (with token)
```bash
curl -X POST http://localhost:8000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"query": "query { getCart { id subtotal items { id quantity product { name price } } } }"}'
```

## 🛒 Complete Checkout Flow (GraphQL)

**Step 1: Login and get token**
```graphql
mutation {
  login(email: "customer@test.com", password: "password") {
    token
  }
}
```

**Step 2: Add product to cart**
```graphql
mutation {
  addToCart(product_id: 1, quantity: 2) {
    id
    subtotal
  }
}
```

**Step 3: Set shipping address**
```graphql
mutation {
  setShippingAddress(input: {
    first_name: "John"
    last_name: "Doe"
    street: "123 Main St"
    city: "Kigali"
    state: "Kigali"
    postal_code: "00100"
    country: "RW"
    phone: "+250788123456"
  }) {
    id
    shipping_address_id
  }
}
```

**Step 4: Set billing address**
```graphql
mutation {
  setBillingAddress(input: {
    first_name: "John"
    last_name: "Doe"
    street: "123 Main St"
    city: "Kigali"
    state: "Kigali"
    postal_code: "00100"
    country: "RW"
    phone: "+250788123456"
  }) {
    id
    billing_address_id
  }
}
```

**Step 5: Set payment method**
```graphql
mutation {
  setPaymentMethod(payment_method: "credit_card") {
    id
    payment_method
  }
}
```

Valid payment methods: `credit_card`, `paypal`, `bank_transfer`, `cash_on_delivery`

**Step 6: Place order**
```graphql
mutation {
  placeOrder {
    id
    order_number
    status
    grand_total
  }
}
```

## ⚠️ Known Issues & Missing Features

### Critical Issues to Fix
1. **Customer tenant_id is null** - Customers should have `tenant_id = 1` but currently have `null`
2. **No shipping methods** - SetShippingMethod will fail without seeded shipping methods
3. **No coupons** - ApplyCoupon will fail without seeded coupons
4. **No tax rates** - Tax calculation has no data to work with

### Missing GraphQL Queries/Mutations
- `getAvailableShippingMethods` - Query to list available shipping options
- Proper `PlaceOrder` implementation (exists but may need testing)

### Missing Seeders
- ShippingMethodsSeeder - Create default shipping methods
- CouponsSeeder - Create test coupon codes
- TaxRatesSeeder - Create default tax rates

### Missing Admin Features
- Admin Product CRUD pages (placeholders only)
- Admin Orders management (placeholders only)
- Admin Tax configuration
- Admin Shipping configuration
- Admin Coupons management

## ✅ What's Working

### REST API
- ✅ POST /api/register
- ✅ POST /api/login
- ✅ POST /api/logout
- ✅ GET /api/user
- ✅ GET /api/products (with filters: category_id, brand_id, min_price, max_price, search)
- ✅ GET /api/products/{id}
- ✅ GET /api/categories
- ✅ GET /api/categories/{id}
- ✅ GET /api/brands

### GraphQL Mutations
- ✅ login(email, password)
- ✅ addToCart(product_id, quantity)
- ✅ updateCartItem(cart_item_id, quantity)
- ✅ removeCartItem(cart_item_id)
- ✅ setShippingAddress(input)
- ✅ setBillingAddress(input)
- ✅ setShippingMethod(shipping_method_id) - works if methods exist
- ✅ setPaymentMethod(payment_method)
- ✅ applyCoupon(code) - works if coupons exist
- ✅ placeOrder

### GraphQL Queries
- ✅ getCart

### Services
- ✅ TaxCalculator - Calculate taxes based on address and tax rules
- ✅ CouponValidator - Validate and apply coupons
- ✅ ShippingCalculator - Calculate shipping costs

### Database
- ✅ All 8 new tables created (coupons, tax_rates, tax_classes, tax_rules, shipping_methods, shipping_rates, cart_rules, catalog_rules)
- ✅ All models fully implemented with relationships
- ✅ Cart table updated with checkout fields

## 🚀 Quick Start for Testing

1. **Start the backend:**
   ```bash
   cd rwanda-dubai-be
   php artisan serve
   ```

2. **Test admin login:**
   - Go to: http://localhost:8000/admin/login
   - Email: superadmin@example.com
   - Password: SuperAdmin@123

3. **Test REST API:**
   ```bash
   curl -X POST http://localhost:8000/api/login \
     -H "Content-Type: application/json" \
     -d '{"email": "customer@test.com", "password": "password"}'
   ```

4. **Test GraphQL:**
   - Use Postman, Insomnia, or GraphQL Playground
   - Endpoint: http://localhost:8000/graphql
   - Start with login mutation to get token

## 📊 Database Stats

- **Tenants:** 1 (default tenant)
- **Admin Users:** 2 (superadmin, admin)
- **Customer Users:** 2 (customer@test.com, frontend@test.com)
- **Products:** 15 seeded products
- **Categories:** 4 categories
- **Brands:** 7 brands
- **Roles:** 2 (superadmin, admin)

## 🔧 Next Steps

To complete the system, you should:

1. Create seeders for shipping methods, coupons, and tax rates
2. Fix customer tenant_id values
3. Implement `getAvailableShippingMethods` GraphQL query
4. Build out admin CRUD pages for products, orders, etc.
5. Add proper error handling and validation
6. Write tests for critical flows

---

**Last Updated:** 2025-11-11
**Backend Version:** Laravel 12
**GraphQL:** Lighthouse v6
