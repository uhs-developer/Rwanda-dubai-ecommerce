# Rwanda Dubai E-commerce - Laravel Backend Implementation

## 🎯 Project Overview

A **100% Magento-parity backend** built with Laravel 12, featuring:
- **GraphQL-first API** (Lighthouse) with REST compatibility
- **SaaS multi-tenant architecture** (single DB with tenant_id scoping)
- **Magento-like Admin UI** (custom Blade + Tailwind v4)
- **Enterprise-grade security** (RBAC, 2FA-ready, rate limiting, audit logs)
- **Headless/decoupled** - works with any frontend

---

## ✅ Implementation Status (Session 2 Complete)

### Foundation Layer - COMPLETE ✅

#### 1. Authentication & Authorization
- ✅ **Spatie Permission** - RBAC system installed
- ✅ **Laravel Fortify** - 2FA ready (configuration pending)
- ✅ **Laravel Sanctum** - API authentication
- ✅ **60+ Magento-parity permissions** created
- ✅ **Roles**: `superadmin` and `admin` with proper permissions

#### 2. Multi-Tenancy
- ✅ **Tenant model** with slug, domain, and JSON config
- ✅ **Tenant-scoped tables**: products, categories, brands, users, etc.
- ✅ **TenantResolver middleware** - Resolves tenant from:
  - `X-Tenant-ID` header
  - Domain/subdomain
  - Default fallback
- ✅ **Automatic query scoping** via middleware

#### 3. GraphQL API
- ✅ **Catalog Queries** (all tenant-scoped):
  - `products` - Paginated with search, category, and brand filters
  - `product(slug)` - Single product by slug
  - `categories` - Tree structure
  - `category(slug)` - Single category
  - `brands` - All brands
  - `brand(slug)` - Single brand
- ✅ **Authentication Mutations**:
  - `register` - Create customer account
  - `login` - Authenticate and get Sanctum token
  - `logout` - Revoke tokens
- ✅ **Schema**: `graphql/schema.graphql` with Magento-compatible types

#### 4. Admin UI
- ✅ **Magento-like Layout**:
  - Responsive sidebar with full menu structure
  - Top navbar with user menu
  - Flash messages support
- ✅ **Dashboard** with KPI cards:
  - Total Sales, Orders, AOV, Customers
  - Recent Orders list
  - Top Products list
- ✅ **Tailwind v4** CSS framework
- ✅ **Role-based access** - Protected routes for superadmin/admin
- ✅ **Placeholder pages** for all sections (ready to implement)

---

## 🗄️ Database Schema

### Core Tables
- **tenants** - Multi-tenant configuration
- **users** - Customer and admin accounts (with tenant_id, 2FA columns)
- **roles & permissions** - Spatie Permission tables
- **products** - Full product catalog (tenant-scoped)
- **categories** - Tree structure (tenant-scoped)
- **brands** - Product brands (tenant-scoped)
- **product_images** - Media gallery (tenant-scoped)
- **personal_access_tokens** - Sanctum tokens

---

## 🚀 Getting Started

### Prerequisites
- PHP 8.2+
- MySQL 8.0+
- Composer
- Node.js & NPM

### Installation

1. **Install Dependencies**
```bash
composer install
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
php artisan key:generate
```

3. **Configure Database**
Edit `.env`:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=rwanda_dubai_ecommerce
DB_USERNAME=root
DB_PASSWORD=
```

4. **Run Migrations & Seeders**
```bash
php artisan migrate:fresh --seed
```

This creates:
- Default tenant (slug: 'default')
- Admin users:
  - **superadmin@example.com** / SuperAdmin@123
  - **admin@example.com** / Admin@123
- Roles and permissions

5. **Start Development Server**
```bash
php artisan serve
```

---

## 📡 API Usage

### GraphQL Endpoint
```
POST /graphql
```

### Example Queries

#### 1. Get Products
```graphql
query {
  products(perPage: 10, page: 1) {
    data {
      id
      sku
      name
      slug
      price
      images {
        url
        label
      }
      brand {
        name
      }
    }
    paginatorInfo {
      currentPage
      lastPage
      total
    }
  }
}
```

#### 2. Register Customer
```graphql
mutation {
  register(
    name: "John Doe"
    email: "john@example.com"
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

#### 3. Login
```graphql
mutation {
  login(
    email: "john@example.com"
    password: "password123"
  ) {
    token
    user {
      id
      name
    }
  }
}
```

### Authentication
Include Sanctum token in headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Multi-Tenancy
Include tenant identifier:
```
X-Tenant-ID: default
```
Or use domain-based routing.

---

## 🎨 Admin Panel

### Access
```
http://localhost:8000/admin/dashboard
```

### Menu Structure (Magento-inspired)
- **Dashboard** - KPIs and overview
- **Sales** - Orders, Invoices, Shipments, Credit Memos
- **Catalog** - Products, Categories, Attributes
- **Customers** - All Customers, Customer Groups
- **Marketing** - Promotions, Coupons
- **Content** - Pages, Blocks
- **Stores** - Configuration
- **System** - Cache, Admin Users

### Features
- ✅ Responsive design
- ✅ Role-based access control
- ✅ Flash messages
- ✅ Tenant-scoped data
- 🔄 Full CRUD operations (coming next)

---

## 🏗️ Architecture

### Multi-Tenancy Flow
```
Request → TenantResolver Middleware → Resolve Tenant → Scope All Queries → Response
```

### GraphQL Resolver Flow
```
GraphQL Request → Lighthouse → Custom Resolver → Apply Tenant Filter → Eloquent → Response
```

### Admin Auth Flow
```
Login → Sanctum Token → Middleware Check → RBAC (Spatie) → Controller → View
```

---

## 📁 Project Structure

```
app/
├── GraphQL/
│   ├── Queries/           # GraphQL query resolvers
│   │   ├── Products.php
│   │   ├── Product.php
│   │   ├── Categories.php
│   │   ├── Brands.php
│   │   └── ...
│   └── Mutations/         # GraphQL mutation resolvers
│       ├── Register.php
│       ├── Login.php
│       └── Logout.php
├── Http/
│   ├── Controllers/
│   │   └── Admin/         # Admin controllers
│   │       └── DashboardController.php
│   └── Middleware/
│       └── TenantResolver.php
└── Models/
    ├── Tenant.php
    ├── User.php
    ├── Product.php
    ├── Category.php
    └── Brand.php

resources/views/admin/
├── layouts/
│   ├── app.blade.php      # Main layout
│   ├── sidebar.blade.php  # Magento-like sidebar
│   └── navbar.blade.php   # Top navigation
└── dashboard/
    └── index.blade.php    # Dashboard page

database/
├── migrations/            # All migrations
└── seeders/
    ├── TenantSeeder.php
    ├── RolesAndPermissionsSeeder.php
    └── DatabaseSeeder.php

graphql/
└── schema.graphql         # GraphQL schema definition
```

---

## 🔐 Security Features

### Implemented
- ✅ RBAC with Spatie Permission
- ✅ Sanctum API authentication
- ✅ Password hashing (Bcrypt)
- ✅ Tenant isolation
- ✅ Input validation
- ✅ CSRF protection

### Ready (Not Yet Configured)
- 🔄 2FA (Fortify installed)
- 🔄 Rate limiting
- 🔄 Audit logs
- 🔄 Security headers (CSP, HSTS)

---

## 🎯 Next Steps

### Immediate Priorities
1. **Cart & Checkout** - Implement cart mutations and order placement
2. **Order Management** - Full order lifecycle (invoice, ship, refund)
3. **Product CRUD** - Admin interfaces for product management
4. **2FA Configuration** - Enable two-factor authentication for admins
5. **Rate Limiting** - Protect API endpoints

### Phase 2
- Promotions & coupons
- Payment gateway integration
- Shipping methods
- Tax calculation
- Advanced search (Elasticsearch/OpenSearch)

---

## 🧪 Testing

### GraphQL Playground
Access GraphQL Playground at:
```
http://localhost:8000/graphql-playground
```

### Test Accounts
```
Superadmin: superadmin@example.com / SuperAdmin@123
Admin: admin@example.com / Admin@123
```

---

## 📚 Documentation

- **Implementation Status**: `IMPLEMENTATION_STATUS.md`
- **GraphQL Schema**: `graphql/schema.graphql`
- **OpenAPI Spec**: `public/openapi.yaml`
- **Migration Blueprint**: `docs/LARAVEL_MIGRATION_BLUEPRINT_COMPLETE.md`

---

## 🤝 Contributing

This is a structured implementation following Magento best practices. For new features:
1. Follow the Magento-parity principle
2. Maintain tenant scoping
3. Update GraphQL schema
4. Add admin UI interfaces
5. Update documentation

---

## 📄 License

MIT License

---

## 💡 Key Decisions

1. **Column-based tenancy** (tenant_id) vs. database-per-tenant - More scalable, simpler to maintain
2. **GraphQL-first** - Modern API standard, better for mobile/SPA
3. **Custom Blade + Tailwind** vs. Filament - More control, Magento-like UX
4. **JSON attributes** vs. full EAV - Flexible without EAV complexity
5. **Sanctum** vs. Passport - Simpler, sufficient for most use cases

---

**Built with ❤️ for Rwanda-Dubai E-commerce**
