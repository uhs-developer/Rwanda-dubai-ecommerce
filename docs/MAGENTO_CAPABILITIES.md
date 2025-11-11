# Magento Open Source – Capabilities, Admin Dashboard, and Architecture

This document captures the major capabilities of Magento Open Source (distinct from Adobe Commerce paid features), an overview of the admin dashboard, key subsystems, and notes to inform a Laravel re‑implementation.

> Scope: Magento Open Source 2.4.x. Some capabilities marked “Adobe Commerce only” are not available in the free edition.

## 1) Core Domain Capabilities
- Catalog
  - Product types: Simple, Configurable, Virtual, Downloadable, Grouped, Bundle
  - Product attributes (EAV), Attribute Sets, Attribute scopes (Global/Website/Store)
  - Categories (tree, nested, URL keys, display/sorting)
  - Media gallery and image roles (base/small/thumbnail), video
  - Tier pricing, special price (promo period), price indexing
  - SEO fields: Meta title/description/keywords, URL rewrites, canonical tags
  - Related/Upsell/Cross‑sell relationships
- Inventory (MSI)
  - Sources (fulfillment locations), Stocks (sales channels), Reservations
  - Salable Quantity vs. Physical Quantity, backorders
- Customers
  - Registration, login, password reset
  - Customer groups (General, Wholesale, Retailer…), tax class per group
  - Addresses (billing/shipping), address book
  - Newsletter subscription, wishlists (basic)
- Sales
  - Cart, Checkout, Orders, Invoices, Shipments, Credit Memos
  - Payment methods (core): Bank transfer, Check/Money, COD, Purchase Order
  - Shipping methods (core): Flat rate, Table rates, Free shipping (carrier integrations via extensions)
  - Taxes: Tax rules, classes, zones, VAT/regions
- Promotions and Pricing Rules
  - Catalog Price Rules (pre‑cart discounts)
  - Cart Price Rules (coupons, conditions, free shipping)
- Content & CMS
  - CMS Pages, Blocks, Widgets
  - Media storage, content staging (Commerce) and Page Builder (Commerce; may be available as module depending on version/distribution)
- Search
  - OpenSearch/Elasticsearch integration required (per 2.4+)
  - Faceted search, analyzers, synonyms (via search engine config)
- Internationalization
  - Multiple websites, stores, store views
  - Locales, currencies, exchange rates, translations (CSV)
- Security & Users
  - Admin users, Roles, ACL (fine‑grained)
  - 2FA (module), CSRF/FORMKEY, reCAPTCHA modules
- System/Dev
  - Indexers (price, URL rewrites, category/product, etc.)
  - Caching (Redis), Full Page Cache (Varnish/BUILTIN)
  - Message Queue (RabbitMQ optional), Cron
  - Configuration scopes (global/website/store), Config cache

## 2) Admin Dashboard – Navigation Overview

Top‑level menu (Open Source):
- Dashboard
  - KPIs: Lifetime Sales, Average Order, Last Orders, Top Search Terms (requires data), Charts
  - Data is index/cron driven; can be extended
- Sales
  - Orders, Invoices, Shipments, Credit Memos, Transactions
- Catalog
  - Products (grid with mass actions, inline filters)
  - Categories (tree editor)
  - Attributes (Product), Attribute Sets
- Customers
  - All Customers (grid), Now Online
  - Customer Groups
- Marketing
  - Promotions: Catalog Price Rules, Cart Price Rules
  - Communications: Email Templates, Newsletter subscribers
  - SEO & Search: URL Rewrites, Search Terms, Site Map
- Content
  - Pages, Blocks, Widgets, Design Configuration, Media
- Reports (basic in OSS)
  - Sales, Products, Customers, Reviews, Search
- Stores
  - All Stores (websites/stores/store views), Configuration (global settings)
  - Currency Rates, Tax Rules/Classes
- System
  - Integrations (API), Extensions, Backups, Index Management, Cache Management, Cron, Import/Export
- Developers (via configuration)
  - Web, Dev settings, Logging, Template hints (dev mode)

Common admin UX features:
- Filters, saved filters
- Mass actions (enable/disable, attribute updates, assign categories, price updates)
- Inline editors via UI Components
- ACL‑guarded access per role

## 3) APIs and Integration
- REST
  - Base: /rest/V1
  - Auth: Integration tokens, admin tokens, customer tokens (JWT‑like bearer)
  - Common endpoints: products, categories, attributes, customers, carts, orders, stock, price rules
- GraphQL
  - Single endpoint: /graphql
  - Queries: products (search, filters, aggregations), categories, cmsPage, customer/account, cart operations, storeConfig
  - Mutations: cart operations, customer auth/registration, checkout pieces
- Webhooks: Not core; extensions or message queue integrations commonly used
- Events/Observers & Plugins (AOP)
  - Events allow reacting to lifecycle hooks
  - Plugins intercept method calls (before/around/after)
- Service Contracts
  - PHP interfaces define service boundaries; used by REST/GraphQL

## 4) Architecture Notes (for migration)
- EAV Model
  - Products, categories leverage EAV for dynamic attributes
  - Attribute Sets define product type templates
- Dependency Injection
  - di.xml, preferences, virtual types, constructor injection
- UI Components (Admin)
  - XML‑driven, Knockout.js bindings, data providers
- Theming (Frontend)
  - Themes, layout XML, PHTML templates, LESS/SASS, RequireJS; can be replaced with headless FE
- Indexers
  - Heavy operations handled via indexers (price, search, category product, etc.). Cron required.

## 5) Open Source vs Adobe Commerce (selected highlights)
- Available only in Adobe Commerce (not exhaustive):
  - B2B: Company accounts, Shared Catalog, Quotes/Negotiation, Requisition Lists, Quick Order
  - Advanced segmentation, Visual Merchandiser (enhanced), Gift cards, Rewards, Store credit
  - Content Staging, Page Builder (often bundled in Commerce; availability for OSS varies by version/packaging)
  - Advanced reporting, Customer attributes (admin), Product Recommendations (SaaS)

## 6) Operational Requirements (cPanel‑friendly)
- PHP 8.2 + extensions (bcmath, intl, mbstring, pdo_mysql, soap, xsl, zip, opcache, etc.)
- MySQL 8.0+ or MariaDB 10.6+
- OpenSearch/Elasticsearch 2.x/7.x endpoint (managed, as shared hosting cannot run it)
- Cron: Run Magento cron every minute
- Memory:
  - Web: 512M–1G typical
  - CLI build: 1–2G recommended for `setup:di:compile` and static content deploy

## 7) What to Emulate in Laravel (High‑level)
- Catalog:
  - Product model with dynamic attributes (EAV‑like or JSON attributes), Attribute Sets
  - Categories tree, URL keys, rewrites, SEO fields
  - Media library (primary/role images), video
  - Price model (base, special price, tier pricing) and index tables for performance
  - Relationships: related/upsell/cross‑sell
- Inventory (MSI‑inspired):
  - Sources, Stocks, Reservations, salable vs. physical quantity
- Customers and Auth:
  - Groups, addresses, tax class mapping
  - Tokens (admin/customer), role/permission (RBAC)
- Sales:
  - Carts/Quotes, Orders, Invoices, Shipments, Credit memos
  - Payment abstraction (gateways), the same for shipping rates/carriers
- Promotions:
  - Catalog rules and cart rules (conditions/conditions tree)
- CMS:
  - Pages/Blocks with WYSIWYG/PageBuilder alternative (e.g., Editor.js), Widgets
- Search:
  - OpenSearch/Elasticsearch integration (external managed endpoint)
- System:
  - Indexers (queueable), cache (Redis), cron jobs
- Admin UI:
  - Role‑aware admin with grids, mass actions, filters (Laravel Nova/Filament/Custom)

## 8) Admin Dashboard – Detailed Sections to Port
- Dashboard KPIs
  - Sales (today/week/month), Orders count, Average Order Value, Top products, Top search terms
- Sales
  - Orders workflow with statuses and transitions
  - Invoice/Ship/Credit memo lifecycle
  - Transactions log
- Catalog
  - Product grid with filters and mass actions
  - Product editor with attribute tabs, images, related items, price tiers, SEO
  - Categories tree editor, category landing content
  - Attributes/Attribute Sets UI
- Customers
  - Customer grid, view/edit customer with addresses and activity
  - Customer groups
- Marketing
  - Catalog price rules
  - Cart price rules (coupons, conditions tree, free shipping)
  - URL rewrites, Search terms (reporting)
- Content
  - Pages, Blocks, Widgets, Design per store view
- Stores
  - Configuration screens per scope (global/website/store view)
  - Currency rates, tax rules/classes, shipping/payment settings
- System
  - Index management, Cache management, Import/Export, Integrations (API keys)

## 9) Key Data Models (Simplified)
- Product
  - Core fields + EAV attributes, price matrix (tier/special), relations, media
- Category
  - Nested set/tree, SEO fields, display settings
- Customer
  - User profile, addresses, group, tax class
- Cart/Quote
  - Items, prices/taxes/discounts, shipping/billing, payment selection
- Order
  - Items, totals, status history, invoices, shipments, credit memos
- Promotions
  - Rules, conditions (attribute‑based), actions (set discount), coupons

## 10) Extension & Customization Mechanisms to Mirror
- Events/Observers -> Laravel Events/Listeners
- Plugins (AOP) -> Laravel middleware/macros/overrides (documented extension points)
- Service Contracts -> Interfaces + application services
- Config scopes -> Hierarchical config (env + DB per website/store view)

---

This reference should serve as a feature map for a Laravel build that preserves Magento’s breadth while adopting Laravel’s idioms and simplicity. Next steps: define a concrete migration blueprint with tables, services, indexers, and an admin UX plan (Nova/Filament/custom) aligned to the sections above.


