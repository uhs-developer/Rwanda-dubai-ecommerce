GraphQL API – Implementation Plan
=================================

Primary API surface for Magento-parity backend using Lighthouse.

Phases
------
1) Bootstrap
   - Install `nuwave/lighthouse`
   - Configure `/graphql` route
   - Enable GraphiQL/Playground (dev)
   - Load schema from `graphql/schema.graphql`

2) Catalog
   - Queries: products, product(slug), categories, category(slug), brands, brand(slug)
   - Filters: q, categorySlug, brandSlug, price ranges
   - Pagination: connections with `PaginatorInfo`

3) Customers & Auth
   - Mutations: register, login, logout
   - Query: me, myOrders
   - Guards: Sanctum

4) Cart & Checkout
   - Mutations: add/update/remove, applyCoupon, set addresses/methods, placeOrder
   - Totals calculation via services

5) Orders lifecycle
   - Queries: order by number
   - Admin mutations: invoice, ship, refund (role-guarded)

6) Admin
   - Admin-only mutations and queries
   - RBAC via directives (custom `@hasRole`, `@can`)

Security
--------
- Auth: Sanctum tokens for customers and admins
- RBAC: role/permission checks in resolvers/directives
- Rate limits: middleware on GraphQL endpoint
- Input validation: Lighthouse validation rules

Compatibility
-------------
- Keep field names and shapes close to Magento GraphQL where sensible
- Maintain REST for existing FE compatibility; document in OpenAPI


