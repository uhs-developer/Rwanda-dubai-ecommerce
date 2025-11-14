# Frontend Architecture & Structure

Stack
- React 18 + TypeScript + Vite
- Styling: Tailwind (migrate to v4 utility syntax as applicable)
- Data: `urql` GraphQL client

Key Directories (`frontend/src/`)
- `admin/`: Admin SPA pages/components using GraphQL
- `components/`: Storefront pages, shared UI library (`components/ui/*`)
- `graphql/`: Storefront and admin operations (`storefront.ts`, `admin.ts`)
- `lib/`: Data clients (`graphqlClient.ts` for urql; deprecate `apolloClient.ts`)
- `services/`: Legacy REST clients (to be removed)
- `contexts/`, `router/`, `i18n/`: App context, routing, translations

Routing
- SPA routing with `react-router-dom@7`
- `ProtectedRoute` for authenticated areas


