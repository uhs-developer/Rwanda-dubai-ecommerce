# Quick Start Guide - Rwanda Dubai E-commerce Backend

## 🚀 Get Running in 5 Minutes

### 1. Install & Setup (2 minutes)
```bash
cd rwanda-dubai-be
composer install
cp .env.example .env
php artisan key:generate
```

### 2. Configure Database (1 minute)
Edit `.env`:
```env
DB_DATABASE=rwanda_dubai_ecommerce
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Migrate & Seed (1 minute)
```bash
php artisan migrate:fresh --seed
```

✅ This creates:
- Default tenant
- Admin users (see below)
- Roles & permissions

### 4. Start Server (30 seconds)
```bash
php artisan serve
```

---

## 🔑 Default Credentials

### Admin Panel (`/admin/dashboard`)
```
Super Admin:
Email: superadmin@example.com
Password: SuperAdmin@123

Admin:
Email: admin@example.com
Password: Admin@123
```

---

## 🎯 Test the API

### GraphQL Endpoint
```
POST http://localhost:8000/graphql
```

### Quick Test - Register a Customer
```graphql
mutation {
  register(
    name: "Test User"
    email: "test@example.com"
    password: "password123"
  ) {
    token
    user {
      id
      name
      email
    }
  }
}
```

### Quick Test - Get Products
```graphql
query {
  products(perPage: 5) {
    data {
      id
      name
      slug
      price
    }
  }
}
```

### Quick Test - Cart Operations
```graphql
# Get cart
query {
  cart {
    id
    items {
      id
      product {
        name
        sku
      }
      quantity
      price
      row_total
    }
    subtotal
    tax_amount
    shipping_amount
    grand_total
  }
}

# Add to cart (requires product ID from products query)
mutation {
  addToCart(product_id: 1, quantity: 2) {
    id
    items {
      id
      name
      quantity
      price
    }
    grand_total
  }
}
```

### Quick Test - Place Order (requires authentication)
```graphql
mutation {
  placeOrder(
    payment_method: "stripe"
    shipping_method: "flat_rate"
    billing_address: {
      first_name: "John"
      last_name: "Doe"
      street_address: "123 Main St"
      city: "New York"
      state_province: "NY"
      postal_code: "10001"
      country: "US"
      phone: "+1234567890"
    }
    shipping_address: {
      first_name: "John"
      last_name: "Doe"
      street_address: "123 Main St"
      city: "New York"
      state_province: "NY"
      postal_code: "10001"
      country: "US"
      phone: "+1234567890"
    }
  ) {
    id
    order_number
    status
    grand_total
    items {
      name
      quantity
      price
    }
  }
}
```

---

## 📊 Access Admin Dashboard

1. Visit: `http://localhost:8000/admin/dashboard`
2. Login with admin credentials above
3. Explore the Magento-like interface

### Admin Features Available
✅ Dashboard with KPIs
✅ Sidebar navigation (Magento structure)
✅ Role-based access control
✅ Flash messages
✅ Responsive design

---

## 🧪 Test Multi-Tenancy

### Via Header
```bash
curl -X POST http://localhost:8000/graphql \
  -H "X-Tenant-ID: default" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ products { data { name } } }"}'
```

### Via Domain (future)
Configure additional tenants:
```php
Tenant::create([
    'name' => 'Store 2',
    'slug' => 'store2',
    'domain' => 'store2.example.com',
    'is_active' => true
]);
```

---

## 📁 Key Files to Explore

### GraphQL
- **Schema**: `graphql/schema.graphql`
- **Resolvers**: `app/GraphQL/Queries/` and `app/GraphQL/Mutations/`

### Admin UI
- **Layout**: `resources/views/admin/layouts/app.blade.php`
- **Sidebar**: `resources/views/admin/layouts/sidebar.blade.php`
- **Dashboard**: `resources/views/admin/dashboard/index.blade.php`

### Models
- **Tenant**: `app/Models/Tenant.php`
- **User**: `app/Models/User.php`
- **Product**: `app/Models/Product.php`

### Middleware
- **Tenant Resolver**: `app/Http/Middleware/TenantResolver.php`

---

## 🔍 Verify Installation

### Check Database
```bash
php artisan tinker
```
```php
// Check tenants
Tenant::all();

// Check admin users
User::with('roles')->get();

// Check permissions
\Spatie\Permission\Models\Permission::count();
```

### Check GraphQL
Visit: `http://localhost:8000/graphql-playground`

### Check Admin
Visit: `http://localhost:8000/admin/dashboard`

---

## 🆘 Troubleshooting

### Database Connection Error
```bash
# Create database first
mysql -u root -p
CREATE DATABASE rwanda_dubai_ecommerce;
exit;

# Then migrate
php artisan migrate:fresh --seed
```

### Permission Denied
```bash
# Fix storage permissions
chmod -R 775 storage bootstrap/cache
```

### GraphQL Not Working
```bash
# Clear config cache
php artisan config:clear
php artisan cache:clear
```

---

## 📖 Next Steps

1. **Read Full Documentation**: `README_IMPLEMENTATION.md`
2. **Check Implementation Status**: `IMPLEMENTATION_STATUS.md`
3. **Explore GraphQL Schema**: `graphql/schema.graphql`
4. **Review Architecture**: See README for flow diagrams

---

## 💡 Quick Tips

### Create a New Product (Tinker)
```bash
php artisan tinker
```
```php
$tenant = Tenant::first();
Product::create([
    'tenant_id' => $tenant->id,
    'name' => 'Test Product',
    'slug' => 'test-product',
    'sku' => 'TEST-001',
    'price' => 99.99,
    'is_active' => true,
    'in_stock' => true,
]);
```

### Create a Test Customer
```bash
php artisan tinker
```
```php
$tenant = Tenant::first();
User::create([
    'tenant_id' => $tenant->id,
    'name' => 'Customer One',
    'email' => 'customer@example.com',
    'password' => bcrypt('password123'),
    'status' => 'active',
]);
```

---

**Ready to build! 🎉**

For detailed implementation guide, see `README_IMPLEMENTATION.md`
