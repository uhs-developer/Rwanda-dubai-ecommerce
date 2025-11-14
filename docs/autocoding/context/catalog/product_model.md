# Product Model

Core Fields
- `sku`, `name`, `slug`, `price`, `specialPrice`
- `shortDescription`, `description`
- `brand`, `categories`, `images`

Derived/Resolvers
- `images`: resolved by `App\\GraphQL\\Resolvers\\ProductImages`
- `attributes`: extensible attribute values
- `categories`: resolved for tree/hierarchy

Admin Extensions
- SEO fields: `metaTitle`, `metaDescription`, `metaKeywords`, `structuredData`
- Feature flags: `isActive`, `isFeatured`, `stockQuantity`, `weight`


