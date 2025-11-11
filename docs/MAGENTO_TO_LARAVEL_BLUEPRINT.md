# Magento → Laravel Migration Blueprint

This blueprint translates Magento Open Source capabilities into a Laravel architecture, prioritizing parity where it matters and simplifying where Laravel offers better ergonomics. It is intended to guide an incremental migration or a greenfield build compatible with our existing Rwanda–Dubai project.

## 1) High-Level Architecture
- Layers
  - Domain: application services (catalog, inventory, customers, sales, promotions)
  - Persistence: Eloquent models + repositories (optionally service contracts)
  - API: REST + GraphQL (Lighthouse) with auth (Sanctum/Passport)
  - Admin: Filament or Laravel Nova (role/permission gates via Spatie)
  - Search: OpenSearch/Elasticsearch client (scout + custom indexers)
  - Cache: Redis; Queues: Redis/SQS; Cron: Laravel scheduler
- Multi-tenancy analogue (websites/stores/store views)
  - Config scopes: DB-backed config with scope hierarchy (global/website/store_view)

## 2) Data Model Mapping (Simplified)
- Catalog
  - products (id, type, sku, name, slug, status, visibility, tax_class, price fields, weight…)
  - product_attributes (define name, type, scope, validation)
  - product_attribute_sets / product_attribute_set_attribute (grouping)
  - product_attribute_values (EAV-like storage or JSON column per product)
  - categories (nested set: lft, rgt, parent_id; URL key; SEO)
  - category_product (pivot)
  - product_relations (related/upsell/cross-sell)
  - media (images, roles, sort)
  - tier_prices (qty/price by customer group)
- Inventory (MSI-inspired)
  - sources (locations), stocks (sales channels)
  - source_items (product_id, source_id, qty, status)
  - reservations (order_id, sku, qty, state)
- Customers
  - customers, customer_addresses, customer_groups
- Sales
  - quotes (carts), quote_items
  - orders, order_items, order_status_history
  - invoices / invoice_items
  - shipments / shipment_items / shipment_tracks
  - credit_memos / credit_memo_items
  - payments, transactions
- Promotions
  - catalog_rules, catalog_rule_conditions
  - cart_rules, cart_rule_conditions, coupons
- System/Config
  - config (scope, scope_id, path, value) like Magento’s core_config_data

## 3) Services & Indexers
- CatalogService
  - CRUD products/categories/attributes
  - Price calculators (base/special/tier)
  - Media handling
- InventoryService
  - Salable quantity computation
  - Reservation workflow (on checkout/order create/cancel)
- CartService/CheckoutService
  - Build/price cart with promotions and tax
  - Shipping rate selection, payment selection
  - Place order → emit events
- OrderService
  - Invoice/ship/credit memo lifecycle
- PromotionEngine
  - Conditions/Actions engine (attribute-based)
- Indexers (queueable jobs)
  - Product price index
  - Category product index
  - URL rewrite index
  - Search index (OpenSearch)

## 4) Admin UI (Filament/Nova) Structure
- Dashboard
  - KPIs (sales today/week/month, AOV, top products, search terms)
- Sales
  - Orders (index/detail) with transitions (invoice/ship/refund)
  - Invoices, Shipments, Credit memos, Transactions
- Catalog
  - Products grid with mass actions & attribute editor
  - Categories tree editor
  - Attributes & Attribute Sets
- Customers
  - Customers, Groups
- Marketing
  - Catalog Rules
  - Cart Rules & Coupons
  - URL Rewrites, Search Terms (report)
- Content
  - CMS pages/blocks/widgets (+ Editor.js/Page builder alternative)
- Stores
  - Websites/Stores/Store Views (config scopes)
  - Currency/tax config, shipping/payment methods
- System
  - Cache/Index management
  - Import/Export (CSV), Integrations (API keys)

## 5) API Contract
- REST (Laravel controllers) mirroring common Magento shapes where practical
  - /api/products, /api/categories, /api/cart, /api/orders, /api/customers, /api/coupons
- GraphQL (Lighthouse)
  - Schema: products (filters/aggregations), categories, cart, checkout mutations, customer
- Auth
  - Admin tokens (roles/permissions)
  - Customer tokens (login/register/forgot)

## 6) Search Integration (OpenSearch)
- Scout driver or custom client for:
  - products index with aggregations (brand, price ranges, attributes)
  - synonyms/stopwords via index settings
  - incremental updates via events/indexers

## 7) Events & Extensibility
- Laravel Events for lifecycle hooks (order_placed, order_invoiced, product_saved, etc.)
- Module system
  - Package each domain area as internal packages (composer path repositories) for isolation
- Configuration
  - DB-backed config by scope with resolver: `getConfig(path, scope, scopeId)`

## 8) Migration Strategy
- Phase 1: Catalog & Search
  - Products, categories, attributes, media, basic price, search index
  - Admin grids & editor; API for FE integration
- Phase 2: Customers & Cart/Checkout
  - Customer accounts, addresses, quote/cart, shipping & payments adapters
  - Order placement → simple payment (COD/Bank transfer), invoices/shipments
- Phase 3: Promotions & Taxes
  - Catalog and cart rules; tax classes & zones
  - Coupons & conditions
- Phase 4: Advanced
  - Inventory MSI (sources/reservations)
  - URL rewrites, SEO, wishlists, newsletters
  - Import/export, integrations

## 9) cPanel Deployment Notes
- Use Composer over SSH for installs/updates; memory for build steps 1–2G
- Point document root to `public/` (Laravel) and ensure Redis available (optional)
- Use managed OpenSearch; set env vars for endpoint
- Cron: Laravel scheduler every minute

## 10) Deliverables & Tooling
- Packages
  - catalog, inventory, sales, promotions, customers, cms, system
- Admin
  - Filament or Nova resource set
- API
  - REST & GraphQL schema, Postman collection
- DevOps
  - cPanel deploy script (Composer install, caches, migrations, assets), ENV templates

This blueprint aims to retain Magento’s strengths—rich catalog, promotions, and sales lifecycle—while embracing Laravel’s productivity, testability, and simpler extension story.


