# Complete Magento → Laravel Migration Blueprint
# Dubai-Rwanda E-commerce Platform

This comprehensive blueprint maps all identified Magento features (770+) to a Laravel implementation, organized by priority phases.

---

## MIGRATION PHASES

### **PHASE 1: CRITICAL FOUNDATION** (Months 1-3)

#### 1.1 CATALOG SYSTEM

**Database Schema:**
```sql
-- Core Products
products (id, type, sku, name, slug, status, visibility, tax_class_id, brand_id, price, special_price, cost, weight, created_at, updated_at)
product_types (simple, configurable, grouped, bundle, virtual, downloadable)

-- EAV Alternative (JSON-based)
product_attributes (id, code, label, type, scope, is_searchable, is_filterable, validation_rules, options_json)
product_attribute_sets (id, name, entity_type)
product_attribute_set_attributes (set_id, attribute_id, group_id, sort_order)
product_attribute_values (product_id, attribute_id, value_text, value_int, value_decimal, value_datetime, value_json)
-- OR use JSON column: products.attributes_data (JSONB)

-- Categories
categories (id, parent_id, name, slug, description, image, is_active, position, level, path, lft, rgt)
category_product (category_id, product_id, position)

-- Media
product_media (id, product_id, type, path, label, position, disabled, media_type[image|video], video_url, video_provider)
product_media_gallery_value (value_id, store_id, label, position, disabled)

-- Relationships
product_relations (product_id, related_product_id, relation_type[related|upsell|crosssell], position)

-- Pricing
product_tier_prices (product_id, customer_group_id, qty, value, percentage_value, website_id)
product_special_prices (product_id, customer_group_id, price, date_from, date_to, website_id)

-- URLs & SEO
url_rewrites (id, entity_type, entity_id, request_path, target_path, redirect_type, store_id, metadata_json)
product_seo (product_id, store_id, meta_title, meta_description, meta_keywords, canonical_url)
```

**Laravel Implementation:**
- **Models**: Product, Category, ProductAttribute, ProductMedia, UrlRewrite
- **Services**: 
  - `CatalogService` (CRUD, search, filtering)
  - `PriceCalculator` (base, special, tier, group prices)
  - `MediaManager` (upload, optimize, roles, watermarks)
  - `CategoryTreeService` (nested set operations)
- **API Endpoints**: 
  - `/api/products` (list, show, filter, search)
  - `/api/categories` (tree, products)
  - `/api/attributes` (values, filters)
- **Admin UI (Filament)**:
  - ProductResource (grid, mass actions, bulk edit)
  - CategoryResource (tree editor)
  - AttributeResource, AttributeSetResource

**Features Implemented:**
✅ All product types
✅ Dynamic attributes (JSON-based EAV)
✅ Category tree with nested set
✅ Media gallery (images, video)
✅ Pricing (tier, special, group)
✅ SEO (meta, URLs, canonical, redirects)
✅ Product relationships
✅ Bulk operations

---

#### 1.2 INVENTORY SYSTEM (MSI-Inspired)

**Database Schema:**
```sql
-- Multi-Source Inventory
inventory_sources (id, code, name, enabled, description, latitude, longitude, country_id, region, postcode, city, street, contact_name, email, phone, priority)
inventory_stocks (id, name)
inventory_source_stock (source_id, stock_id)
inventory_source_item (source_id, sku, status, quantity)

-- Sales Channels
stock_sales_channels (type, code, stock_id)

-- Reservations
inventory_reservation (stock_id, sku, quantity, metadata)

-- Salable Quantity (computed)
-- Use query: source_item.quantity - reservations.quantity

-- Configuration
product_inventory (product_id, manage_stock, min_qty, max_sale_qty, notify_stock_qty, backorders, use_config_settings)
```

**Laravel Implementation:**
- **Models**: InventorySource, Stock, SourceItem, Reservation
- **Services**:
  - `InventoryService` (get salable qty, reserve, cancel reservation)
  - `SourceSelectionService` (priority algorithm, distance-based)
- **Events**: `ProductReserved`, `ReservationCancelled`, `StockUpdated`
- **Admin**: InventorySourceResource, StockManagement, LowStockReport

**Features Implemented:**
✅ Multi-source inventory
✅ Stock assignment per source
✅ Reservations system
✅ Salable quantity calculation
✅ Backorders configuration
✅ Low stock alerts
✅ Source priority
✅ Inventory transfer

---

#### 1.3 CUSTOMER MANAGEMENT

**Database Schema:**
```sql
-- Customers
customers (id, user_id, email, firstname, lastname, dob, gender, tax_vat_number, customer_group_id, default_billing_id, default_shipping_id, is_active, created_at, updated_at)
customer_groups (id, name, tax_class_id, code)
customer_addresses (id, customer_id, firstname, lastname, company, street, city, region, postcode, country_id, telephone, is_default_billing, is_default_shipping)

-- Segments (Dynamic)
customer_segments (id, name, description, conditions_json, is_active, website_id)
customer_segment_customer (segment_id, customer_id, added_at)

-- Activity
customer_log (customer_id, action, details, ip_address, user_agent, created_at)
customers_now_online (visitor_id, customer_id, last_visit_at, last_url)
```

**Laravel Implementation:**
- **Models**: Customer, CustomerGroup, CustomerAddress, CustomerSegment
- **Services**:
  - `CustomerService` (CRUD, groups, segments)
  - `CustomerSegmentationService` (evaluate conditions, auto-assign)
  - `CustomerActivityLogger`
- **Auth**: Laravel Sanctum (customer tokens)
- **API**: `/api/customer/account`, `/api/customer/addresses`, `/api/customer/orders`
- **Admin**: CustomerResource, CustomerGroupResource, CustomerSegmentResource, NowOnlineWidget

**Features Implemented:**
✅ Registration/Login/Password Reset
✅ Customer groups
✅ Multiple addresses
✅ Address book
✅ Customer segments (dynamic)
✅ Activity tracking
✅ Real-time online customers
✅ Customer import/export

---

#### 1.4 SHOPPING CART & CHECKOUT

**Database Schema:**
```sql
-- Carts (Quotes)
carts (id, customer_id, store_id, is_active, is_guest, reserved_order_id, items_count, items_qty, currency_code, grand_total, base_grand_total, checkout_method, created_at, updated_at)
cart_items (id, cart_id, product_id, sku, name, qty, price, base_price, row_total, tax_amount, discount_amount, product_options_json)
cart_addresses (id, cart_id, address_type[billing|shipping], ...address fields, shipping_method, shipping_amount)
cart_payments (id, cart_id, method, additional_information_json)

-- Persistent Cart
persistent_sessions (key, customer_id, expires_at, info_json)
```

**Laravel Implementation:**
- **Models**: Cart, CartItem, CartAddress, CartPayment
- **Services**:
  - `CartService` (add, update, remove, merge, persist)
  - `CheckoutService` (validate, calculate totals, apply promotions)
  - `QuoteToOrderConverter`
- **API**: `/api/cart`, `/api/cart/items`, `/api/checkout`
- **Features**:
  ✅ Guest checkout
  ✅ Persistent cart
  ✅ Save cart for later
  ✅ Cart price calculation with promotions
  ✅ Shipping method selection
  ✅ Payment method selection
  ✅ Multi-address shipping

---

#### 1.5 ORDER MANAGEMENT

**Database Schema:**
```sql
-- Orders
orders (id, increment_id, customer_id, customer_email, store_id, status, state, shipping_description, billing_address_id, shipping_address_id, payment_method, shipping_method, subtotal, tax_amount, shipping_amount, discount_amount, grand_total, base_grand_total, total_paid, total_refunded, created_at, updated_at)
order_items (id, order_id, product_id, sku, name, qty_ordered, qty_shipped, qty_invoiced, qty_refunded, qty_canceled, price, base_price, row_total, tax_amount, discount_amount, product_options_json)
order_addresses (id, order_id, address_type, ...address fields)
order_status_history (id, order_id, status, comment, is_customer_notified, is_visible_on_front, created_at)

-- Invoices
invoices (id, order_id, increment_id, state, base_grand_total, shipping_amount, created_at)
invoice_items (id, invoice_id, order_item_id, qty, price, row_total)

-- Shipments
shipments (id, order_id, increment_id, total_qty, created_at)
shipment_items (id, shipment_id, order_item_id, qty)
shipment_tracks (id, shipment_id, carrier_code, title, track_number)

-- Credit Memos (Refunds)
credit_memos (id, order_id, invoice_id, increment_id, state, base_grand_total, adjustment_positive, adjustment_negative, shipping_amount, created_at)
credit_memo_items (id, credit_memo_id, order_item_id, qty, price, row_total)

-- Payments & Transactions
order_payments (id, order_id, method, amount_ordered, amount_paid, amount_refunded, additional_information_json)
payment_transactions (id, order_id, payment_id, txn_id, parent_txn_id, txn_type[auth|capture|void|refund], is_closed, additional_information_json)
```

**Laravel Implementation:**
- **Models**: Order, OrderItem, Invoice, Shipment, CreditMemo, Payment
- **Services**:
  - `OrderService` (create, invoice, ship, refund, cancel)
  - `InvoiceService` (generate, capture payment)
  - `ShipmentService` (create, add tracking, print label)
  - `CreditMemoService` (create refund, return to stock)
- **State Machine**: Order status transitions
- **Events**: `OrderPlaced`, `OrderInvoiced`, `OrderShipped`, `OrderRefunded`
- **Admin**: OrderResource, InvoiceResource, ShipmentResource, CreditMemoResource
- **API**: `/api/orders`, `/api/orders/{id}/invoice`, `/api/orders/{id}/ship`, `/api/orders/{id}/refund`

**Features Implemented:**
✅ Complete order lifecycle
✅ Order statuses and state machine
✅ Invoicing (partial & full)
✅ Shipping (partial & full, tracking)
✅ Credit memos (refunds)
✅ Order comments/notes
✅ Hold/Unhold orders
✅ Order cancellation
✅ Reorder functionality
✅ Manual order creation (admin)
✅ Order history tracking

---

#### 1.6 ADMIN DASHBOARD & AUTHENTICATION

**Database Schema:**
```sql
-- Admin Users
admin_users (id, username, email, password, firstname, lastname, is_active, created_at, updated_at)
admin_roles (id, name, description)
admin_user_role (user_id, role_id)

-- Permissions (using Spatie Laravel Permission)
permissions (id, name, guard_name)
role_has_permissions (permission_id, role_id)

-- 2FA
admin_user_2fa (user_id, secret, backup_codes_json, enabled_at)

-- Admin Logs (Adobe Commerce feature)
admin_action_logs (id, user_id, action, resource_type, resource_id, changes_json, ip_address, created_at)
```

**Laravel Implementation:**
- **Auth**: Filament/Nova built-in auth + Spatie Permission
- **2FA**: Laravel Fortify or custom
- **Dashboard Widgets**:
  - Lifetime Sales, Average Order, Recent Orders
  - Sales Chart (orders/revenue over time)
  - Top Products, Top Search Terms
  - New Customers, Low Stock Products
- **Admin Resources**:
  - Products, Categories, Attributes, Customers, Orders, Invoices, Shipments, Credit Memos
  - Promotions, CMS Pages/Blocks, Configuration, Reports
- **Features**:
  ✅ Role-based access control (RBAC)
  ✅ Fine-grained permissions
  ✅ 2FA for admin
  ✅ Dashboard KPIs
  ✅ Admin action logging
  ✅ Custom admin URL

---

#### 1.7 SEARCH & SEO

**Database Schema:**
```sql
-- Search
search_query (id, query_text, num_results, popularity, redirect, synonym_for, store_id, updated_at)
search_synonyms (id, scope_id, synonyms, created_at)

-- SEO
seo_metadata (entity_type, entity_id, store_id, meta_title, meta_description, meta_keywords, meta_robots, og_title, og_description, og_image, twitter_card, canonical_url, hreflang_json)
sitemaps (id, filename, path, store_id, last_generated_at)
```

**Laravel Implementation:**
- **Search**: Laravel Scout + Elasticsearch/OpenSearch driver
- **Services**:
  - `SearchService` (index products, search, facets, filters, autocomplete)
  - `SeoService` (generate meta, sitemaps, URL rewrites)
  - `SearchSynonymService`
- **Indexing**: Jobs to update search index on product changes
- **API**: `/api/search`, `/api/search/suggestions`
- **Features**:
  ✅ Full-text search
  ✅ Faceted search (filters)
  ✅ Autocomplete/suggestions
  ✅ Search redirects
  ✅ Synonyms
  ✅ Search analytics
  ✅ SEO meta tags
  ✅ URL rewrites
  ✅ XML sitemap generation
  ✅ Canonical tags
  ✅ Hreflang for international SEO
  ✅ Schema.org markup
  ✅ Open Graph & Twitter Cards

---

### **PHASE 2: HIGH PRIORITY** (Months 4-6)

#### 2.1 PROMOTIONS ENGINE

**Database Schema:**
```sql
-- Catalog Price Rules
catalog_rules (id, name, description, from_date, to_date, is_active, customer_group_ids_json, website_ids_json, priority, stop_rules_processing)
catalog_rule_conditions (rule_id, conditions_serialized)
catalog_rule_products (rule_id, product_id, from_time, to_time, action_operator, action_amount, action_stop, sort_order)
catalog_rule_product_price (rule_product_id, date, customer_group_id, product_id, rule_price, website_id)

-- Cart Price Rules
cart_rules (id, name, description, from_date, to_date, is_active, customer_group_ids_json, website_ids_json, coupon_type[none|specific|auto], uses_per_coupon, uses_per_customer, priority, is_rss, stop_rules_processing, simple_action, discount_amount, discount_qty, discount_step, apply_to_shipping, is_free_shipping)
cart_rule_conditions (rule_id, conditions_serialized, actions_serialized)
cart_rule_labels (rule_id, store_id, label)
cart_rule_coupons (id, rule_id, code, usage_limit, usage_per_customer, times_used, expiration_date, is_primary)
cart_rule_coupon_usage (coupon_id, customer_id, times_used)

-- Related Product Rules (Adobe Commerce)
related_product_rules (id, name, from_date, to_date, is_active, apply_to[related|upsell|crosssell])
```

**Laravel Implementation:**
- **Models**: CatalogRule, CartRule, Coupon
- **Services**:
  - `PromotionEngine` (evaluate conditions, apply actions)
  - `CouponService` (generate, validate, track usage)
  - `ConditionBuilder` (parse and evaluate attribute-based conditions)
- **Jobs**: `ApplyCatalogRules` (calculate and index rule prices)
- **API**: `/api/cart/coupon`, `/api/promotions/validate`
- **Admin**: CatalogRuleResource, CartRuleResource, CouponGenerator
- **Features**:
  ✅ Catalog price rules
  ✅ Cart price rules
  ✅ Coupon codes (specific, auto-generated)
  ✅ Conditions engine (product attributes, cart attributes, customer segments)
  ✅ Actions (%, fixed, fixed price, BOGO)
  ✅ Free shipping promotions
  ✅ Priority and stacking
  ✅ Scheduling
  ✅ Usage limits
  ✅ Coupon reports

---

#### 2.2 PAYMENT SYSTEM

**Database Schema:**
```sql
-- Payment Methods
payment_methods (id, code, name, is_active, sort_order, config_json)

-- Payment Gateway Integration
payment_tokens (id, customer_id, payment_method_code, type, token, expires_at, is_active, is_visible, gateway_token, public_hash)
```

**Laravel Implementation:**
- **Gateway Abstraction**: 
  - Interface: `PaymentGatewayInterface`
  - Implementations: PayPal, Stripe, Braintree, Authorize.Net, etc. (using Laravel packages)
- **Services**:
  - `PaymentService` (authorize, capture, void, refund)
  - `TokenizationService` (save payment methods)
- **Payment Methods**:
  ✅ PayPal (Express, Standard)
  ✅ Stripe
  ✅ Braintree (CC, PayPal, Apple Pay, Google Pay)
  ✅ Authorize.Net
  ✅ Bank Transfer
  ✅ Check/Money Order
  ✅ Cash on Delivery
  ✅ Purchase Order
  ✅ Zero Subtotal Checkout
- **Features**:
  ✅ Saved payment methods (tokenization)
  ✅ 3D Secure support
  ✅ CVV verification
  ✅ Address verification (AVS)
  ✅ Payment action config (authorize/capture)
  ✅ Transaction logs

---

#### 2.3 TAX SYSTEM

**Database Schema:**
```sql
-- Tax
tax_classes (id, class_name, class_type[product|customer])
tax_rates (id, tax_country_id, tax_region_id, tax_postcode, code, rate, zip_is_range, zip_from, zip_to)
tax_rules (id, code, priority, position, calculate_subtotal)
tax_rule_tax_rate (tax_rule_id, tax_rate_id)
tax_rule_tax_class (tax_rule_id, product_tax_class_id, customer_tax_class_id)

-- Tax Calculation
tax_order_aggregated (id, period, order_status, code, percent, orders_count, tax_base_amount_sum)
```

**Laravel Implementation:**
- **Models**: TaxClass, TaxRate, TaxRule
- **Services**:
  - `TaxCalculator` (calculate tax for products, shipping)
  - `TaxRuleService` (match rules, get rate)
- **Features**:
  ✅ Product tax classes
  ✅ Customer tax classes
  ✅ Tax zones (country, region, postcode)
  ✅ Tax rates
  ✅ Tax rules
  ✅ Origin vs Destination-based tax
  ✅ Tax display settings (incl/excl/both)
  ✅ Fixed Product Tax (FPT/WEEE)
  ✅ EU VAT validation
  ✅ Cross-border tax
  ✅ Tax reports

---

#### 2.4 SHIPPING SYSTEM

**Database Schema:**
```sql
-- Shipping Methods
shipping_methods (id, code, name, is_active, sort_order, config_json)
shipping_table_rates (id, website_id, dest_country_id, dest_region_id, dest_zip, condition_name[weight|price|qty], condition_value, price)
```

**Laravel Implementation:**
- **Carrier Integration**:
  - Interface: `ShippingCarrierInterface`
  - Implementations: UPS, FedEx, DHL, USPS, Flat Rate, Table Rate, Free Shipping
- **Services**:
  - `ShippingRateService` (calculate rates, real-time API calls)
  - `ShippingLabelService` (generate labels, tracking)
- **Features**:
  ✅ Flat rate shipping
  ✅ Table rate shipping
  ✅ Free shipping (with thresholds)
  ✅ Carrier integration (UPS, FedEx, DHL, USPS)
  ✅ Real-time rates
  ✅ Shipping labels printing
  ✅ Tracking numbers
  ✅ Multiple addresses shipping
  ✅ Shipping origin configuration
  ✅ Handling fees

---

#### 2.5 CMS & CONTENT

**Database Schema:**
```sql
-- CMS Pages
cms_pages (id, title, identifier, content, meta_title, meta_keywords, meta_description, page_layout, is_active, sort_order, layout_update_xml, custom_theme, custom_root_template, custom_layout_update_xml)
cms_page_store (page_id, store_id)

-- CMS Blocks
cms_blocks (id, title, identifier, content, is_active)
cms_block_store (block_id, store_id)

-- Widgets
widgets (id, instance_type, theme_id, title, store_ids_json, widget_parameters_json, sort_order, page_groups_json)

-- Media
media_storage (id, path, filename, media_type, size, mime_type, created_at)
media_gallery_folders (id, parent_id, name)
```

**Laravel Implementation:**
- **WYSIWYG**: TinyMCE or CKEditor integration
- **Services**:
  - `CmsService` (pages, blocks, widgets)
  - `MediaService` (upload, organize, optimize)
- **Admin**: PageResource, BlockResource, WidgetResource, MediaGallery
- **Features**:
  ✅ CMS pages
  ✅ CMS blocks
  ✅ WYSIWYG editor
  ✅ Widgets (multiple types)
  ✅ Media gallery
  ✅ Image optimization
  ✅ Page layouts
  ✅ Meta tags per page/block

---

#### 2.6 ADVANCED ADMIN FEATURES

**Import/Export:**
- **Services**:
  - `ImportService` (products, customers, addresses, tax rates)
  - `ExportService` (products, customers, orders)
  - `ImportValidator`
- **Jobs**: `ProcessImport` (chunked, queued)
- **Features**:
  ✅ CSV import/export
  ✅ Product import with images (ZIP)
  ✅ Advanced pricing import
  ✅ Customer import
  ✅ Order export
  ✅ Import validation
  ✅ Import history

**Cache & Index Management:**
- **Admin UI**:
  - Cache flush (configuration, layouts, blocks, collections, page cache, translations)
  - Index management (reindex, status, modes)
- **CLI**: Artisan commands for cache/index operations
- **Features**:
  ✅ Cache management UI
  ✅ Index management UI
  ✅ Scheduled indexing
  ✅ Manual indexing

**Reporting:**
- **Reports**:
  - Sales: Orders, Tax, Invoices, Shipping, Refunds, Coupons
  - Products: Best sellers, Most viewed, Low stock, Ordered
  - Customers: Order total, Order count, New accounts
  - Marketing: Abandoned carts, Products in carts, Search terms
- **Admin**: ReportResource (filterable, exportable)
- **Features**:
  ✅ Pre-built reports
  ✅ Custom date ranges
  ✅ Export reports
  ✅ Report scheduling

---

#### 2.7 EMAIL & MARKETING

**Database Schema:**
```sql
-- Email Templates
email_templates (id, template_code, template_type, template_subject, template_text, template_styles, is_legacy, added_at, modified_at)

-- Newsletter
newsletter_templates (id, template_code, template_text, template_styles, template_type, template_subject, template_sender_name, template_sender_email, added_at, modified_at)
newsletter_queue (id, template_id, newsletter_type, newsletter_text, newsletter_styles, newsletter_subject, newsletter_sender_name, newsletter_sender_email, queue_status, queue_start_at, queue_finish_at)
newsletter_subscribers (id, store_id, subscriber_email, subscriber_status, change_status_at, customer_id, subscriber_confirm_code)

-- Email Reminders (Adobe Commerce)
email_reminder_rules (id, name, description, conditions_serialized, is_active, salesrule_id, schedule)
email_reminder_template (rule_id, template_id, store_id)
```

**Laravel Implementation:**
- **Email System**: Laravel Mail + Mailable classes
- **Services**:
  - `EmailTemplateService`
  - `NewsletterService` (subscribers, queue, send)
  - `TransactionalEmailService` (order, invoice, shipment, customer account)
- **Queue**: Send emails via queue
- **Features**:
  ✅ Email templates (transactional)
  ✅ Template variables
  ✅ Newsletter system
  ✅ Newsletter templates
  ✅ Subscriber management
  ✅ Newsletter queue
  ✅ Abandoned cart emails
  ✅ Email reminders

---

### **PHASE 3: MEDIUM PRIORITY** (Months 7-9)

#### 3.1 ADVANCED CATALOG

**Features to Implement:**
- Product reviews and ratings
- Product Q&A
- Product comparison
- Product alerts (back-in-stock, price drop)
- Recently viewed products
- Wishlist enhancements (share, multiple lists)
- Product labels/badges
- Downloadable products (links, samples)
- Gift options
- RSS feeds

**Database Schema:**
```sql
-- Reviews
reviews (id, product_id, customer_id, title, detail, nickname, rating_votes_json, status_id, created_at)
review_votes (id, review_id, rating_id, value)
ratings (id, rating_code, position)

-- Wishlist
wishlists (id, customer_id, name, visibility[public|private], shared_at, sharing_code)
wishlist_items (id, wishlist_id, product_id, qty, description, added_at)

-- Product Alerts
product_alerts (id, customer_id, product_id, alert_type[price|stock], alert_price, website_id, added_at, sent_at, send_count, status)

-- Recently Viewed
product_viewed_index (id, customer_id, visitor_id, product_id, viewed_at, added_at, store_id)

-- Product Comparison
catalog_compare_items (id, visitor_id, customer_id, product_id, store_id, added_at)
```

---

#### 3.2 ADVANCED CHECKOUT

**Features:**
- Gift messages (per item/order)
- Gift wrapping
- Gift receipts
- Persistent shopping cart
- Multiple address shipping
- Checkout agreements

**Database Schema:**
```sql
-- Gift
gift_message (id, customer_id, sender, recipient, message, design_config_json)
order_item_gift_message (order_item_id, gift_message_id)
gift_wrapping (id, design, image, price, status, website_ids_json)
order_item_gift_wrapping (order_item_id, wrapping_id)

-- Checkout Agreements
checkout_agreement (id, name, content, content_height, checkbox_text, is_active, is_html, mode[auto|manual])
checkout_agreement_store (agreement_id, store_id)
```

---

#### 3.3 CUSTOMER ENHANCEMENTS

**Features:**
- Customer segments (dynamic)
- Store credit (Adobe Commerce)
- Reward points (Adobe Commerce)
- Customer lifetime value tracking
- Customer activity dashboard
- Seller assisted shopping

**Database Schema:**
```sql
-- Store Credit (Adobe Commerce)
customer_balance (customer_id, website_id, amount, base_currency_code)
customer_balance_history (customer_id, website_id, action, balance_amount, balance_delta, additional_info, updated_at)

-- Reward Points (Adobe Commerce)
reward_history (customer_id, points_delta, points_balance, website_id, action_entity[order|review|newsletter], action_type, created_at, expired_at_static, expiration_date, is_expired, is_duplicate_of_history_id)
```

---

#### 3.4 ADVANCED SEO

**Features:**
- XML sitemap automation
- Rich snippets (Product, BreadcrumbList, Organization)
- Hreflang management
- Robots.txt editor
- SEO audit tools integration

---

### **PHASE 4: ADVANCED/OPTIONAL** (Months 10-12)

#### 4.1 B2B COMMERCE SUITE (If Required)

**Features:**
- Company accounts and hierarchy
- Company users and roles
- Quote management and negotiation
- Purchase Order workflow
- Requisition lists
- Quick order (SKU entry, CSV upload)
- Shared catalogs (company-specific)
- Company credit limits
- Payment on account

**Database Schema:**
```sql
-- Companies
companies (id, company_name, legal_name, email, status, sales_representative_id, customer_group_id, company_admin_id, created_at)
company_structure (entity_id, parent_id, entity_type[0=customer,1=division], path)
company_teams (id, company_id, name, description)
company_roles (id, company_id, role_name, permissions_json)

-- Quotes
negotiable_quotes (id, quote_id, quote_name, status, negotiated_price_type, negotiated_price_value, shipping_price, expiration_period, email_notification_sent, customer_id, sales_rep_id, snapshot_json)
quote_comments (id, parent_id, comment, creator_type, is_decline, is_draft, creator_id, created_at)

-- Purchase Orders
purchase_orders (id, order_id, increment_id, status, payment_method)
purchase_order_rules (id, company_id, name, description, is_active, conditions_json, approver_role_ids_json)

-- Requisition Lists
requisition_lists (id, customer_id, name, description, updated_at)
requisition_list_items (id, list_id, sku, qty, options_json)

-- Shared Catalogs
shared_catalogs (id, name, description, customer_group_id, type[public|custom], created_by, tax_class_id)
shared_catalog_permissions (catalog_id, category_id, permission_type, customer_group_id)
shared_catalog_product_item (catalog_id, sku, customer_group_id)
```

---

#### 4.2 CONTENT STAGING (Adobe Commerce)

**Features:**
- Scheduled content updates
- Campaign management
- Preview staged content
- Timeline view

**Database Schema:**
```sql
-- Staging
staging_update (id, name, description, start_time, end_time, rollback_id, is_rollback, is_campaign)
staging_update_store (update_id, store_id)
staging_sequence (sequence_value)
```

---

#### 4.3 HEADLESS/PWA FEATURES

**Features:**
- Enhanced GraphQL API
- PWA-optimized endpoints
- Service Worker support
- Push notifications
- Offline mode

---

#### 4.4 ADVANCED REPORTING & BI

**Features:**
- Advanced analytics dashboard
- Custom report builder
- Cohort analysis
- RFM analysis
- Predictive analytics
- Data warehouse integration

---

## TECHNICAL IMPLEMENTATION DETAILS

### Multi-Store Configuration System

**Database Schema:**
```sql
-- Store Structure
websites (id, code, name, sort_order, default_group_id, is_default)
store_groups (id, website_id, name, root_category_id, default_store_id, code)
stores (id, code, website_id, group_id, name, sort_order, is_active)

-- Configuration
core_config_data (config_id, scope[default|websites|stores], scope_id, path, value, updated_at)
```

**Laravel Implementation:**
- `ConfigService::get($path, $scope, $scopeId)` with hierarchy resolution
- Middleware to set current store context
- Cache config per scope

---

### API Authentication & Authorization

**REST API:**
- Customer tokens: Laravel Sanctum
- Admin tokens: Laravel Sanctum + Spatie Permission
- Endpoints: `/api/integration/customer/token`, `/api/integration/admin/token`

**GraphQL API:**
- Lighthouse GraphQL
- Auth directives: `@auth`, `@guard`
- Queries: products, categories, cmsPage, storeConfig, customer, cart
- Mutations: cart operations, customer auth, checkout

---

### Indexing System

**Indexers (Laravel Jobs):**
1. Product Price Index (tier, special, catalog rules)
2. Category Product Index (product positions in categories)
3. URL Rewrite Index (product/category URL rewrites)
4. Search Index (Elasticsearch/OpenSearch)
5. Stock Status Index (salable quantity)

**Index Modes:**
- Update on Save (real-time)
- Update by Schedule (cron-based)

**CLI Commands:**
```bash
php artisan indexer:reindex [index_code]
php artisan indexer:status
php artisan indexer:set-mode {realtime|schedule} [index_code]
```

---

### Event System

**Key Events:**
- `ProductSaved`, `ProductDeleted`
- `CategorySaved`, `CategoryDeleted`
- `OrderPlaced`, `OrderInvoiced`, `OrderShipped`, `OrderRefunded`, `OrderCanceled`
- `CartUpdated`, `CartItemAdded`, `CartItemRemoved`
- `CustomerRegistered`, `CustomerLoggedIn`
- `CouponApplied`, `PromotionApplied`

**Listeners:**
- Invalidate caches
- Update search index
- Send emails
- Update inventory reservations
- Apply catalog rules

---

### Admin UI (Filament Recommended)

**Dashboard:**
- Revenue widget (today, week, month, year)
- Orders widget (new, processing, complete)
- Top products widget
- Low stock widget
- Recent orders table
- Sales chart (Chart.js/ApexCharts)

**Resources:**
- ProductResource (with RelationManagers for media, tiers, relations)
- CategoryResource (tree, drag-and-drop)
- CustomerResource
- OrderResource (with actions: invoice, ship, refund, cancel, hold)
- CatalogRuleResource
- CartRuleResource
- CmsPageResource
- CmsBlockResource
- ReportResource

**Bulk Actions:**
- Enable/Disable products
- Update attributes
- Delete
- Export
- Assign to categories
- Update prices

---

### Performance Optimization

**Caching Strategy:**
- Configuration cache (per scope)
- Product data cache
- Category tree cache
- Full page cache (Redis)
- Search results cache
- Tax rate cache
- Shipping rate cache

**Database Optimization:**
- Index tables (price, category_product, url_rewrite, search)
- Query optimization (eager loading, select specific columns)
- Database read replicas (for high traffic)

**CDN:**
- Cloudflare/CloudFront for static assets
- Image optimization and lazy loading
- WebP format support

**Queue:**
- Email sending
- Index updates
- Import processing
- Export processing
- Cache warming

---

## DEPLOYMENT (cPanel-Compatible)

### Requirements:
- PHP 8.2+ (with extensions: bcmath, ctype, fileinfo, json, mbstring, openssl, pdo_mysql, tokenizer, xml, gd, intl)
- MySQL 8.0+ or MariaDB 10.6+
- Redis (for cache, sessions, queues)
- Composer 2.x
- Node.js 18+ (for asset compilation)
- SSH access
- Cron access

### Deployment Steps:

1. **Initial Setup:**
```bash
cd public_html
composer install --no-dev --optimize-autoloader
cp .env.example .env
php artisan key:generate
# Configure .env (DB, Redis, Mail, Search)
```

2. **Database Migration:**
```bash
php artisan migrate --force
php artisan db:seed --class=RolesAndPermissionsSeeder
php artisan db:seed --class=InitialDataSeeder
```

3. **Build Assets:**
```bash
npm install
npm run build
```

4. **Permissions:**
```bash
chmod -R 755 storage bootstrap/cache
```

5. **Cron Configuration:**
```bash
* * * * * cd /path-to-project && php artisan schedule:run >> /dev/null 2>&1
```

6. **Queue Worker (via Supervisor or cron):**
```bash
php artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
```

7. **Cache & Index:**
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan indexer:reindex
```

8. **Search Index:**
```bash
# Configure OpenSearch endpoint in .env
php artisan scout:import "App\Models\Product"
```

---

## TESTING STRATEGY

### Unit Tests:
- Services (CartService, PriceCalculator, TaxCalculator, PromotionEngine)
- Models (relations, scopes, mutators)
- Helpers

### Feature Tests:
- API endpoints (products, cart, checkout, orders)
- Admin operations (CRUD, bulk actions)
- Authentication & authorization

### Integration Tests:
- Cart to order flow
- Payment processing
- Search indexing
- Email sending

### Performance Tests:
- Load testing (Apache Bench, k6)
- Database query optimization
- Cache effectiveness

---

## MONITORING & MAINTENANCE

### Logging:
- Application logs (Laravel Log)
- Error tracking (Sentry, Bugsnag)
- Performance monitoring (New Relic, Datadog)
- Database query logging (Laravel Telescope in dev)

### Backups:
- Daily database backups
- Weekly full backups (code + DB + media)
- Off-site backup storage (S3, Backblaze)

### Security:
- SSL/TLS enforcement
- Regular security updates
- SQL injection prevention (Eloquent ORM)
- XSS protection (Blade escaping)
- CSRF protection (Laravel middleware)
- Rate limiting (API throttle)
- Admin IP whitelist
- 2FA for admin

### Maintenance Mode:
```bash
php artisan down --secret="token"
# Perform updates
php artisan up
```

---

## ESTIMATED TIMELINE & RESOURCES

### Phase 1 (Months 1-3): 3 Full-Stack Developers
- Catalog, Inventory, Customers, Cart, Orders, Admin, Search

### Phase 2 (Months 4-6): 3 Full-Stack Developers + 1 Frontend
- Promotions, Payments, Tax, Shipping, CMS, Advanced Admin, Email

### Phase 3 (Months 7-9): 2 Full-Stack Developers + 1 Frontend
- Advanced Catalog, Advanced Checkout, Customer Enhancements, Advanced SEO

### Phase 4 (Months 10-12): 2 Full-Stack Developers (if B2B required)
- B2B Suite, Content Staging, Headless, Advanced BI

**Total Estimated Effort:** 30-40 developer-months for full implementation

---

## CONCLUSION

This blueprint provides a complete roadmap for migrating 770+ Magento features to a Laravel-based Dubai-Rwanda e-commerce platform. The phased approach ensures a working system at each milestone while progressively adding advanced capabilities. The architecture leverages Laravel's strengths (Eloquent, Events, Queues) while preserving Magento's powerful features (EAV-like attributes, MSI, Promotions, Multi-Store).

The resulting system will be:
- ✅ **Performant**: Optimized queries, caching, indexing
- ✅ **Scalable**: Horizontal scaling, queue-based processing
- ✅ **Maintainable**: Clean Laravel code, well-documented
- ✅ **Extensible**: Event-driven, package-based architecture
- ✅ **Feature-Rich**: Matching or exceeding Magento Open Source
- ✅ **Developer-Friendly**: Laravel ecosystem, modern tooling
- ✅ **cPanel-Compatible**: Deployable on shared/VPS hosting

Next steps: Begin Phase 1 implementation, starting with database migrations and core catalog system.

