# API Design Guidelines (GraphQL-first)

Principles
- Single endpoint `/graphql` with versioning handled via schema evolution and deprecations.
- Explicit types and inputs; avoid `JSON` where a structured type fits.
- Pagination via `Connection + PaginatorInfo` pattern in schema.
- Auth via Laravel Sanctum Bearer tokens; protect fields with `@guard`.
- Admin operations live under dedicated admin types/queries/mutations (see `admin-schema.graphql`).

Schema Changes
- Additive by default; deprecate before removal.
- Use `@rename` for field migrations where possible.
- Prefer resolvers over `@belongsTo` when non-trivial transformation is needed.

Error Handling
- Business errors → GraphQL `errors` with meaningful messages and codes.
- Validation errors → HTTP 200 with field-level GraphQL errors (Lighthouse default).

Performance
- Use paginated lists for large collections.
- Avoid N+1 via DataLoader/resolver batching when necessary.
- Expose filter inputs rather than free-form `JSON`.


