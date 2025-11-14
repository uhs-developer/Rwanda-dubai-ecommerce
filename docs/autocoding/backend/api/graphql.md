# GraphQL API Overview

Endpoint
- `/graphql` (POST). Auth via Bearer token from Laravel Sanctum.

Schemas
- `schema.graphql`: Storefront catalog, cart, auth.
- `admin-schema.graphql`: Admin CRUD (catalog, orders, customers, CMS, config).
- `shipment-schema.graphql`: Shipping methods, routes, dynamic pricing.

Common Queries (Storefront)
- `products` with filters and `PaginatorInfo`
- `product(slug)`
- `categories`, `brands`
- `productFilters`
- `cart`, `me`, `myOrders`

Common Mutations (Storefront)
- `login`, `register`, `logout`
- `addToCart`, `updateCartItem`, `removeCartItem`
- `placeOrder`

Admin Highlights
- `adminProducts`, `createProduct`, `updateProduct`, `deleteProduct`
- `adminOrders`, `updateOrderStatus`, `cancelOrder`, `createInvoice`, `createShipment`, `createCreditMemo`
- `adminPages`, `adminBlocks`, `updatePageContent`, `adminSiteConfig`

Conventions
- Paginated lists return `Connection` with `data` + `paginatorInfo`.
- Field renames use `@rename`. Protected fields use `@guard`.
- Resolvers in `App\\GraphQL\\Queries|Mutations|Resolvers`.


