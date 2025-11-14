# Shipping Methods & Routes

Entities
- ShippingMethod: `name`, `code`, `type (air|sea|land|express)`, `basePrice`, `est. days`, `isActive`, `routes[]`
- ShippingRoute: `name`, `code`, `originCountry/city`, `destinationCountry/city`, `transitPoints[]`, `isActive`
- MethodRoutePrice: pricing policy fields (per‑kg/cbm, flatRate, fees, tax/duty %, estimated days)

Queries
- `shippingMethods`, `shippingMethod(id)`
- `shippingRoutes`, `shippingRoute(id)`
- `availableShippingOptions(destinationCountry, weightKg, volumeCbm?, orderValue)`

Mutations (Admin)
- `create/update/deleteShippingMethod`
- `create/update/deleteShippingRoute`
- `setMethodRoutePrice`, `updateMethodRoutePrice`, `deleteMethodRoutePrice`


