# KORA Autocoding Knowledge Base

This knowledge base documents the architecture, APIs, database, and implementation patterns for the KORA e‑commerce platform.

Goals
- Give AI and engineers an accurate, current mental model
- Align with the live codebase (Laravel 12 + Lighthouse GraphQL, React + Vite + TypeScript)
- Standardize conventions to speed up development and reviews

Scope
- All GraphQL (storefront + admin). REST is being deprecated.
- Frontend uses `urql` as the GraphQL client.
- Backend uses Lighthouse GraphQL with Laravel Sanctum auth and Spatie permissions.

Key Entry Points
- Backend GraphQL schema: `backend/graphql/`
- Frontend GraphQL ops: `frontend/src/graphql/`
- Frontend data client: `frontend/src/lib/graphqlClient.ts`

Navigation
- backend/api/graphql.md
- backend/architecture/structure.md
- backend/database/schema.md
- frontend/architecture/structure.md
- frontend/data/api.md
- context/glossary.md


