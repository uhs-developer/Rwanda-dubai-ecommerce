# Backend Architecture & Structure

Runtime
- Laravel 12 (PHP 8.2), Lighthouse GraphQL, Sanctum, Spatie Permissions.

Key Directories
- `routes/`:
  - `web.php`: SEO endpoints + admin SPA redirect
  - `api.php`: legacy REST (to be removed after FE migration)
- `graphql/`: `schema.graphql`, `admin-schema.graphql`, `shipment-schema.graphql`
- `app/Models/`: Eloquent models (Product, Category, Brand, Cart, Order, Invoice, Shipment, etc.)
- `database/migrations/`: Full DB schema (catalog, commerce, shipping, taxes, permissions)

Patterns
- GraphQL resolvers in `App\\GraphQL\\Queries|Mutations|Resolvers`
- Admin schema mirrors Magento-like domains (catalog/orders/customers/cms)
- Shipping system separated into methods, routes, and method-route pricing

Authentication
- Sanctum bearer tokens; GraphQL protected via `@guard`
- Roles/permissions via Spatie (`roles`, `permissions`, pivots)


