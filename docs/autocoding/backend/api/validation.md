# Validation Rules

Input Validation
- Prefer typed `input` definitions in SDL instead of unstructured `JSON`.
- Apply Laravel validation in resolvers/mutations where business rules apply.

Common Constraints
- Slug uniqueness for categories/brands/products.
- Price must be >= 0; stock non-negative.
- Pagination `perPage` bounded (e.g., max 100).

Security
- Authorize admin mutations via Spatie roles/permissions.
- Use `@guard` for user-specific queries (`me`, `myOrders`).


