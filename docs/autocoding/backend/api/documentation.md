# API Documentation Standards

Source of Truth
- GraphQL SDL files in `backend/graphql/`:
  - `schema.graphql` (storefront/cart/auth)
  - `admin-schema.graphql` (admin catalog/orders/cms/config)
  - `shipment-schema.graphql` (methods/routes/pricing)

Developer Tools
- GraphiQL/Altair against `/graphql` in local/staging.
- Schema docs are generated from SDL; keep descriptions up-to-date in SDL.

Deprecation Checklist (REST → GraphQL)
- Frontend
  - Replace `src/services/*` axios calls with GraphQL queries/mutations in `src/graphql/`.
  - Remove `HomepageAPI.tsx`, `ProductListingPageAPI.tsx` usage; use GraphQL variants.
  - Standardize on `urql`; remove `apolloClient.ts`.
- Backend
  - Remove REST routes in `routes/api.php` after FE migration.
  - Remove `darkaonline/l5-swagger` if no REST remains.
  - Update CORS/config to allow `/graphql` only.


