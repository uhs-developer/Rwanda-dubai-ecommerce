# Authentication & Authorization

Authentication
- Laravel Sanctum bearer tokens
- GraphQL protected fields/queries use `@guard`

Authorization
- Spatie roles/permissions on admin operations
- Enforce role checks in resolvers/services

Frontend Token
- Store token under `auth_token` (align `graphqlClient.ts`)
- Attach `Authorization: Bearer <token>` to all GraphQL requests


