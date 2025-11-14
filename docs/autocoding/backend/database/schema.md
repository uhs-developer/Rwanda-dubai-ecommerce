# Database Schema Overview

Domains
- Catalog: categories (tree), subcategories, brands, products, product_images, pivots (`category_product`, `subcategory_product`)
- Commerce: carts, cart_items, orders, order_items, invoices, shipments, credit_memos, addresses, coupons, exchange_rates
- Shipping: shipping_methods, shipping_routes, shipping_method_route_prices, shipping_rates
- Taxes & Rules: tax_classes, tax_rates, tax_rules, cart_rules, catalog_rules
- Security & Ops: users (+ 2FA columns), personal_access_tokens, tenants, audit_logs, jobs, cache
- RBAC (Spatie): roles, permissions, model/user mappings

Notes
- Category hierarchy via `parent_id` + children queries
- Orders normalize monetary totals (subtotal, discounts, tax, shipping, grand_total)
- Shipping pricing decouples method, route, and price policies for flexibility


