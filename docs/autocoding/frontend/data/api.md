# Frontend Data Layer (urql)

Client
- `frontend/src/lib/graphqlClient.ts` creates a `urql` client targeting `/graphql`
- Attaches `Authorization` header from `localStorage.getItem('auth_token')`

Usage
- Define queries/mutations in `frontend/src/graphql/*.ts` using `gql` from `urql`
- Use `useQuery`/`useMutation` hooks or `client.query/mutation` patterns

Conventions
- Collocate variables and types with ops
- Prefer paginated queries (`Connection + PaginatorInfo`)
- Normalize UI models in component-level mapping when needed

Deprecations
- Remove axios services in `src/services/*`
- Remove `apolloClient.ts`; standardize on `urql`


