# Response Patterns & Errors

Success
- GraphQL returns `data` with requested fields.
- Paginated responses include `paginatorInfo` with `currentPage`, `lastPage`, `perPage`, `total`.

Errors
- Validation/business errors appear in GraphQL `errors` with message and path.
- Authentication failures return GraphQL `errors` and HTTP 200 (per GraphQL spec).

Client Handling (Frontend)
- Centralize error/success toasts using UI `sonner`.
- For retriable errors, implement limited retries (network only).
- For auth errors, clear token and redirect to `/auth`.


